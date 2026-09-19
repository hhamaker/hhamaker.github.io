import assert from "node:assert/strict";
import { chromium } from "playwright";
import { HtmlValidate } from "html-validate";
import axe from "axe-core";

const root = new URL("../", import.meta.url);
const html = await Bun.file(new URL("index.html", root)).text();
const validator = new HtmlValidate({ extends: ["html-validate:standard"] });
const report = await validator.validateString(html, "index.html");
assert.ok(report.valid, JSON.stringify(report.results, null, 2));
console.log("PASS HTML validation");

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    const file = Bun.file(new URL(`.${pathname === "/" ? "/index.html" : pathname}`, root));
    return await file.exists() ? new Response(file) : new Response("Not found", { status: 404 });
  },
});
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const url = `http://localhost:${server.port}/`;
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);

  // Check actual targets and resources, not just the presence of link attributes.
  const links = await page.locator("[href], [src]").evaluateAll(elements => elements.map(element => ({
    value: element.getAttribute("href") || element.getAttribute("src"),
  })));
  for (const { value } of links) {
    if (value.startsWith("#")) {
      assert.ok(await page.locator(value).count(), `Missing anchor: ${value}`);
    } else if (!/^(https?:|mailto:|data:)/.test(value)) {
      assert.ok((await page.request.get(new URL(value, url).href)).ok(), `Missing asset: ${value}`);
    }
  }
  const metadata = await page.locator('script[type="application/ld+json"]').textContent();
  assert.equal(JSON.parse(metadata)["@type"], "Person");
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  assert.ok((await page.request.get(new URL(new URL(socialImage).pathname, url).href)).ok(), "Missing social image");
  console.log("PASS local links, assets, and structured data");

  for (const [width, height] of [[320, 740], [375, 812], [768, 1024], [901, 768], [1024, 768], [1101, 768], [1280, 720], [1440, 900], [1440, 600], [1920, 1080]]) {
    await page.evaluate(() => document.activeElement.blur());
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(pageWidth <= width, `Horizontal overflow: ${width}px viewport, ${pageWidth}px page`);
    await page.locator('.socials a[aria-label="Email"]').focus();
    await page.waitForFunction(() => {
      const box = document.querySelector('.socials a[aria-label="Email"]').getBoundingClientRect();
      return box.top >= -1 && box.bottom <= innerHeight + 1;
    }, null, { timeout: 3000 }).catch(async () => {
      throw new Error(`Focus failed at ${width}x${height}: ${JSON.stringify(await page.locator('.socials a[aria-label="Email"]').boundingBox())}`);
    });
    const box = await page.locator('.socials a[aria-label="Email"]').boundingBox();
    assert.ok(box.y >= -1 && box.y + box.height <= height + 1, `Social link unreachable at ${width}x${height}`);
  }
  console.log("PASS responsive overflow and sidebar reachability at 10 viewport sizes");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to main content");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main");
  await page.locator('.side-nav a[href="#experience"]').click();
  await page.waitForFunction(() => document.querySelector('.side-nav a[href="#experience"]').getAttribute("aria-current") === "location");
  assert.equal(await page.locator('.side-nav [aria-current="location"]').count(), 1);
  assert.equal(await page.locator("main section > h2").count(), 7);
  await page.evaluate(() => { window.print = () => { window.printRequested = true; }; });
  await page.getByRole("button", { name: "Print / save résumé" }).click();
  assert.ok(await page.evaluate(() => window.printRequested));
  console.log("PASS skip link, section navigation, and print action");

  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addScriptTag({ content: axe.source });
    for (const expanded of [false, true]) {
      await page.locator("details").evaluate((element, open) => { element.open = open; }, expanded);
      const results = await page.evaluate(() => axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
      }));
      assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(node => node.target) })), [], `Accessibility violations at ${width}px`);
    }
  }
  console.log("PASS axe accessibility checks on mobile and desktop");

  for (const javaScriptEnabled of [false, true]) {
    const fallback = await browser.newPage({ javaScriptEnabled });
    await fallback.goto(url);
    if (javaScriptEnabled) await fallback.emulateMedia({ media: "print" });
    await fallback.waitForTimeout(600);
    const visible = await fallback.locator("main section").evaluateAll(sections => sections.every(section => {
      const style = getComputedStyle(section);
      return style.opacity === "1" && style.display !== "none" && section.getBoundingClientRect().height > 0;
    }));
    assert.ok(visible, javaScriptEnabled ? "Hidden print content" : "Hidden no-JavaScript content");
    await fallback.close();
  }
  assert.deepEqual(errors, [], "Browser JavaScript errors");
  console.log("PASS no-JavaScript and print visibility; no browser errors");
} finally {
  await browser?.close();
  server.stop();
}
