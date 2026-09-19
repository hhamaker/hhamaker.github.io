# Hunter Hamaker — portfolio

Static professional portfolio at **https://www.hunterhamaker.com/**, hosted on GitHub Pages. The site uses hand-written HTML, CSS, and a small amount of JavaScript. There is no production build step.

## Preview locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. You can also open `index.html` directly.

## Editing

- `index.html`: content, styles, metadata, and progressive enhancements.
- `img/me.jpg`: profile portrait (376 × 376).
- `img/favicon.svg`: favicon.
- `img/social-preview.svg`: editable social-card source.
- `img/social-preview.png`: 1200 × 630 image used by social platforms.
- `CNAME`: GitHub Pages custom domain.

Keep section order and numbering aligned with the navigation. Use `<h2>` for section labels and `<h3>` for their subsections. Keep claims and metrics consistent across the introduction, selected work, and experience. Update the JSON-LD and social metadata when changing professional details.

The main content is visible without JavaScript. JavaScript adds entrance animations, active-navigation announcements, and the **Print / save résumé** button. The browser's print command also works without JavaScript; select “Save as PDF” for a résumé copy. Supplemental projects live in the “More integration work” disclosure; expand it before printing if you want them included.

## Checks

Development tooling uses [Bun](https://bun.sh/) 1.3.14. Dependencies are pinned in `package.json` and `bun.lock`; they are not shipped to the page.

```sh
bun install --frozen-lockfile
bunx --bun playwright install chromium
bun run check
```

Checks cover HTML validity, local assets and anchors, structured data, overflow at ten viewport sizes, sidebar reachability, keyboard navigation, the print action, axe WCAG accessibility checks, no-JavaScript rendering, and print visibility. GitHub Actions runs the same suite on pushes and pull requests.

To use an existing Chrome installation instead of downloading Chromium on macOS:

```sh
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" bun run check
```

After editing the social SVG, regenerate and commit its PNG:

```sh
bun run social-image
```

The `CHROME_PATH` override also works for that command. Manually review the card and print preview after visual changes. Automated accessibility checks supplement keyboard and visual testing.

## Deployment and domain

GitHub Pages serves the repository's static files; `.nojekyll` disables Jekyll processing. In the repository's **Settings → Pages**, configure deployment from the publishing branch's root, set `www.hunterhamaker.com` as the custom domain, and enable HTTPS. The checks workflow validates the site; it does not change the Pages publishing configuration.

The canonical URL is `https://www.hunterhamaker.com/`. The apex domain currently redirects through HTTP before reaching that URL. In Cloudflare, create a permanent redirect rule matching hostname `hunterhamaker.com`, targeting `https://www.hunterhamaker.com` with the incoming path and query string preserved. Confirm the rule takes precedence over the origin redirect and keep HTTPS enforcement enabled. This hosting change is outside the repository.

Verify after changing it:

```sh
curl -IL https://hunterhamaker.com/
```

Expected: one redirect directly to `https://www.hunterhamaker.com/`, then `200`.
