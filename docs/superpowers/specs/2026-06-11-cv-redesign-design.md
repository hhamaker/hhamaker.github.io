# CV Website Redesign — Design

Date: 2026-06-11
Site: www.hunterhamaker.com (GitHub Pages, single `index.html`)

## Goal

Replace the w3.css parallax template with a sleek, modern, dark single-page CV
that positions Hunter Hamaker as a senior software engineer / integration
specialist with nearly a decade of experience. Target audience: potential
employers.

## Decisions (user-approved)

- **Aesthetic:** dark engineer — charcoal near-black base, emerald green accent.
- **Layout:** split sidebar — fixed left identity column (name, title, section
  nav, social links) with right scrolling content. Stacks vertically on mobile.
- **Typography:** Space Grotesk for headings, JetBrains Mono for labels/dates/
  chips, system-friendly body font (Inter).
- **Positioning:** integration specialist — Salesforce, MuleSoft, AWS, Twilio,
  Workday called out in tagline.
- **Personal content:** trimmed — photo plus one human line; Ben Franklin quote
  and house-project details cut.
- **Bullets:** trimmed to strongest, achievement-focused items per role
  (Claude's judgment, optimized to impress employers).
- **Scripts:** Google AdSense and Visualime tracking removed.
- **Footer links:** email, GitHub, LinkedIn, Trailblazer. Facebook dropped.

## Page structure

1. Left sidebar: name, title, integration-specialist tagline, section nav with
   active-state highlighting, social icons.
2. About — short professional summary, small photo, one personal line.
3. Skills — grouped chips: Languages, Platforms & Integration, Cloud & DevOps.
4. Experience — vertical timeline, 4 roles (Appfolio ×2, LogMeIn, Citrix
   Online), trimmed bullets.
5. Certifications — 4 Salesforce badge grid (`adminCert1.png`, `muleDev1.png`,
   `sfDevCert1.png`, `sfDevCert2.png`).
6. Education — Cal Lutheran, BS Computer Science, one line.
7. Contact/footer — email CTA.

## Technical

- Single static `index.html`, vanilla HTML/CSS/minimal JS. No frameworks, no
  build step. Google Fonts only external dependency.
- Scroll-reveal animations + sidebar nav active-state via IntersectionObserver;
  honors `prefers-reduced-motion`.
- Fixes folded in: malformed head (`<title>`/`<meta>` outside `<head>`), broken
  cert image references (old deleted jpgs), proper meta description + Open
  Graph tags.
- `CNAME` untouched.
