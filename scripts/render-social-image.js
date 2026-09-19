import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(new URL("../img/social-preview.svg", import.meta.url).href);
  await page.screenshot({ path: new URL("../img/social-preview.png", import.meta.url).pathname });
  console.log("Rendered img/social-preview.png (1200 × 630)");
} finally {
  await browser.close();
}
