# CV Website Redesign — Design

Date: 2026-06-11
Updated: 2026-09-18
Site: www.hunterhamaker.com (GitHub Pages, single `index.html`)

## Goal

Replace the w3.css parallax template with a sleek, modern, dark single-page CV
that positions Hunter Hamaker as a staff software engineer / integration
specialist with 10+ years of experience. Target audience: potential
employers.

## Decisions (user-approved)

- **Aesthetic:** dark engineer — charcoal near-black base, emerald green accent.
- **Layout:** split sidebar — sticky left identity column on tall desktop
  screens, normal document flow on short screens. Stacks below 1100px with
  wrapping section navigation retained on mobile.
- **Typography:** Syne headings, IBM Plex Mono labels/dates/chips, Instrument Sans body.
- **Positioning:** production AI systems and integration architecture —
  Salesforce, MuleSoft, and AWS, supported by concrete business outcomes.
- **Personal content:** trimmed — photo plus one human line; Ben Franklin quote
  and house-project details cut.
- **Bullets:** trimmed to strongest, achievement-focused items per role
  (Claude's judgment, optimized to impress employers).
- **Scripts:** Google AdSense and Visualime tracking removed.
- **Footer links:** email, GitHub, LinkedIn, Trailblazer. Facebook dropped.

## Page structure

1. Left sidebar: name, title, integration-specialist tagline, section nav with
   active-state highlighting, social icons.
2. About — two-paragraph summary, portrait, and three featured outcomes.
3. Selected work — platform scheduling, enterprise AI, and contract/payment
   portal case studies; supplemental integration projects in a disclosure.
4. Experience — AppFolio and LogMeIn (formerly Citrix Online), with concise,
   achievement-focused bullets.
5. Skills — grouped chips for AI, languages, Salesforce, integrations, and DevOps.
6. Certifications — seven linked credentials with inline SVG badges:
   five Salesforce/MuleSoft and two Workato.
7. Education — Cal Lutheran, BS Computer Science, one line.
8. Contact/footer — email CTA. Sidebar includes a print/save résumé action.

## Technical

- Single static `index.html`, vanilla HTML/CSS/minimal JS. No frameworks, no
  build step. Google Fonts only external dependency.
- Optional entrance animations and sidebar nav active-state via IntersectionObserver;
  content remains visible without JavaScript and honors `prefers-reduced-motion`.
- Semantic headings, skip link, visible focus and verification affordances,
  `aria-current` navigation, and higher-contrast secondary text.
- Print stylesheet uses a light, linear document layout with all main sections visible.
- Canonical URL, Person JSON-LD, Open Graph/Twitter metadata, SVG favicon,
  and a dedicated 1200 × 630 social-preview PNG.
- Bun-based development checks validate HTML, assets, browser behavior, and
  accessibility in GitHub Actions. Production remains build-free.
- Fixes folded in: malformed head (`<title>`/`<meta>` outside `<head>`), broken
  cert image references (old deleted jpgs), proper meta description + Open
  Graph tags.
- `CNAME` untouched.
