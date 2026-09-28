# Creations of Chris Cajes — App Portfolios Website

A static, zero-build **web portal** that acts as the central launch point for every application
portfolio and its interactive **user manual**. Built with plain HTML, CSS, and JavaScript —
no framework, no bundler, no server-side code.

Open `index.html` and every project is rendered as a card. Clicking a card launches that
project's full manual: a standalone, self-contained documentation page with a fixed sidebar
table of contents, section navigation, feature grids, step cards, and data tables.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Included Manuals](#included-manuals)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How the Dynamic Engine Works](#how-the-dynamic-engine-works)
- [Adding a New App](#adding-a-new-app)
- [Configuration Reference](#configuration-reference)
- [Metadata Reference](#metadata-reference)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## Overview

| | |
|---|---|
| **Project Name** | Creations of Chris Cajes – App Portfolios |
| **Portal Title** | Creations Portal — Dynamic Web Version |
| **Type** | Static site / documentation hub |
| **Entry Point** | `index.html` |
| **Build Step** | None |
| **Runtime Dependencies** | None |
| **External Resources** | Tailwind CSS (CDN), Google Fonts (CDN) |
| **Theme** | Light / Dark, persisted in `localStorage` |
| **License** | Personal portfolio — all rights reserved |

The portal was created to replace a manually maintained list of links. The app catalog is
now driven by a JSON manifest and, on HTTP(S) hosts, a folder prober that auto-discovers
new manual folders at runtime.

---

## Features

### Portal

- **Dynamic app grid** — cards rendered at runtime from the manifest, not hardcoded in markup.
- **Manifest support** — `apps.json` defines title, description, icon, platform, and tags.
- **Auto-discovery** — probes `app1`…`app15` plus common folder names and parses each
  `index.html` for metadata. Discovered cards are badged **Auto-Discovered**.
- **Manual scan button** — "Scan New Folders" re-runs discovery and reports how many new
  folders were found via toast notification.
- **Live search** — filters by title, description, platform, and tags, case-insensitive.
- **Category filters** — All Projects, Mobile Apps, Desktop Apps, Admin Tools, User Manuals.
- **Light / dark theming** — class-based dark mode, persisted under `portal-theme`.
- **Glassmorphism cards** — blurred translucent surfaces, lift-on-hover, accent gradient text.
- **Live stats** — total app count and active/visible card count.
- **Resilient offline mode** — falls back to a built-in registry when opened over `file://`
  where `fetch()` is blocked by the browser.
- **Responsive** — 1 / 2 / 3 column grid, collapses to a single column on mobile.

### Manuals (each sub-project)

- Fixed top header with a "← Home Portal" back link.
- Fixed, scrollable sidebar navigation grouped into sections.
- Smooth-scrolling anchor links to every section.
- Table of contents grid.
- Hero banner, feature cards, numbered step cards, and data tables.
- Info callouts: tip, note, warning, danger.
- Collapses to a single column under 960px.
- Entirely self-contained — styles inlined in each `index.html`.

---

## Project Structure

```
Chris Cajes App Portfolios/
├── .gitignore              # Ignore rules for OS / editor / build artifacts
├── README.md               # This document
├── index.html              # Portal home page
├── script.js               # AppPortal dynamic engine
├── styles.css              # Portal theming, glass cards, pills, toasts
├── apps.json               # App manifest (source of truth for catalog)
│
├── app2/                   # La-Fierce (Android) — user manual
│   └── index.html
│
├── app3/                   # Admin Console (Android) — user manual
│   └── index.html
│
├── app4/                   # Admin Console (Windows Desktop) — user manual
│   ├── index.html
│   └── winform_screenshots/
│       ├── Winform1.PNG
│       └── Winform2.PNG
│
└── winform_screenshots/    # Legacy copy of the WinForms screenshots
    ├── Winform1.PNG
    └── Winform2.PNG
```

### File Responsibilities

| File | Purpose |
|---|---|
| `index.html` | Portal shell: navbar, hero, search, category pills, card container, modal, toast, footer. |
| `script.js` | `AppPortal` class — theme, listeners, manifest load, folder probing, filtering, rendering. |
| `styles.css` | CSS custom properties, glass card surfaces, category pill states, toast, gradient text. |
| `apps.json` | Catalog manifest. Loaded via `fetch('apps.json')`. |
| `appN/index.html` | Standalone manual page with inlined CSS and metadata `<meta>` tags. |

---

## Included Manuals

### app2 — La-Fierce (Android)

**Platform:** Android Mobile · **Tags:** Android, Social, Mobile, User Manual

A bold, positive, and empowering social platform. Members connect with others, share their
story, celebrate the community, and earn their place in the fierce world.

**Sections (21):** Introduction · System Requirements · Account Setup · Home & Navigation ·
Posts · Shares · Search · Notifications · Messages · Follow & Friends · User Profiles ·
Badges & Streaks · Nominations · Bookmarks · Reporting Content · Editing Your Profile ·
Theme & Display Settings · Providing Feedback · App Updates · FAQ & Troubleshooting

---

### app3 — Admin Console (Android)

**Platform:** Android Admin · **Tags:** Android, Admin, CRUD, User Manual

Back-office console for managing success stories, editing profiles, and curating
inspirational content for La-Fierce.

**Sections (14):** Table of Contents · Getting Started · Splash Screen · Login Screen ·
Dashboard · Person Editor · Search & Sort · Highlights · Status Toggle · Delete Person ·
API Reference · Data Model · Troubleshooting · Quick Reference

---

### app4 — Admin Console (Windows Desktop)

**Platform:** Windows Desktop · **Tags:** WinForms, Desktop, C#, User Manual

Windows Forms CRUD tool with authentication, rich data visualization, and REST API
integration.

- **Stack:** .NET 8, WinForms, `HttpClient`, `Newtonsoft.Json`
- **Theme:** `ThemeManager`, `#161616` dark base with `#ff3700` accent
- **Endpoints:** `GET/POST/PUT/DELETE/PATCH /api/successstories[/{id}[/status]]`
- **Screenshots:** embedded from `winform_screenshots/`

**Sections (10):** Introduction · Requirements · Login · Main Dashboard · People List ·
Detail View · Editor Dialog · Theme Toggle · API Endpoints · FAQ

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN) + custom CSS with CSS custom properties |
| Scripting | Vanilla ES2020+ JavaScript (single class, no modules) |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Data | Static JSON manifest |
| Persistence | `localStorage` (`portal-theme`) |
| Build | None |
| Package manager | None |

Dependencies are loaded from public CDNs, so a network connection is required for correct
fonts and Tailwind utility rendering. Core layout remains readable offline because
`styles.css` carries the theme tokens, card surfaces, pills, and toasts.

---

## Getting Started

### Run Locally

Open `index.html` directly in a browser — no installation, no build.

### Recommended: Local HTTP Server

Some browsers block `fetch()` on the `file://` protocol. Serving over HTTP enables
manifest loading and folder auto-discovery.

```bash
# Python
python -m http.server 8000

# Node
npx serve .

# .NET
dotnet run --project $env:TEMP\serve.cs
```

Then visit `http://localhost:8000`.

### Git

```bash
git init
git add .
git commit -m "Initial commit: app portfolio portal"
git remote add origin <remote-url>
git push -u origin main
```

---

## How the Dynamic Engine Works

`script.js` exposes a single class, `AppPortal`, instantiated on `DOMContentLoaded`
as `window.portalApp`.

### Boot sequence

1. `setupTheme()` — reads `localStorage['portal-theme']`, applies the `dark` class to `<html>`.
2. `setupEventListeners()` — wires the theme toggle, search input, scan button, and category pills.
3. `loadAllApps()` — populates the registry, in priority order:
   - **Built-in defaults** seeded first (guarantees content when `fetch` fails).
   - **`apps.json` manifest** — overwrites defaults per `folder` key (`source: 'manifest'`).
   - **Folder probing** — fetches `<folder>/index.html` and parses metadata
     (`source: 'auto-discovered'`).
4. `render()` — writes the card grid and updates the stat counters.

### Discovery pipeline

```
candidates: app1 … app15, plus app, app5…app8, project, manual, docs
  └─ fetch "<folder>/index.html"
       ├─ 200 → parse <title>, <meta name="description|app-icon|app-platform|app-tags">
       │        → register as 'auto-discovered'
       └─ fail → skip
```

Folders already loaded from the manifest are skipped. `probingLimit` (default `15`)
controls the `appN` scan range.

### Rendering

Cards are injected via `innerHTML` into `#apps-container`. An empty result set renders a
"no matching applications" placeholder. Each card shows icon, platform, title, description,
up to three tags, and a launch affordance.

### Filtering

Category and search predicates are combined with `AND`. Category matching checks the
platform string, any tag, and falls back to icon heuristics (`📱` → Mobile, `🖥️` → Desktop).
Search matches title, description, platform, or any tag.

---

## Adding a New App

### Method A — Manifest (recommended, explicit)

1. Create `app5/index.html` with your manual.
2. Add the metadata `<meta>` tags described below.
3. Append an entry to `apps.json`:

```json
{
  "folder": "app5",
  "title": "My New App",
  "description": "Short summary shown on the card.",
  "icon": "🚀",
  "platform": "Web App",
  "tags": ["Web", "New", "User Manual"]
}
```

4. Click **Scan New Folders** or reload the portal.

### Method B — Auto-Discovery (zero config)

Create a folder whose name matches a probe candidate (`app5`, `project`, `manual`, …)
containing an `index.html`. The portal parses it and badges the card **Auto-Discovered**.
Descriptions are truncated to 180 characters.

### Required Entry Point

Every manual folder must contain `index.html`. It is the launch target for the card link.

---

## Configuration Reference

### `apps.json`

```json
{
  "apps": [
    {
      "folder": "app2",
      "title": "La-Fierce (Android)",
      "description": "Card description text.",
      "icon": "📱",
      "platform": "Android Mobile",
      "tags": ["Android", "Social", "Mobile", "User Manual"]
    }
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `folder` | string | Yes | Must match the directory name. Used as the map key. |
| `title` | string | No | Falls back to the folder name. |
| `description` | string | No | Falls back to a generic string. |
| `icon` | string | No | Any emoji or glyph. Defaults to `📱`. |
| `platform` | string | No | Drives category filtering. Defaults to `Web App`. |
| `tags` | string[] | No | Only the first three render on the card. |

### `styles.css` Theme Tokens

| Token | Light | Dark usage |
|---|---|---|
| `--primary` | `#FF6B00` | Accent, active pills, links |
| `--primary-hover` | `#e05d00` | Hover state |
| `--primary-light` | `#fff3eb` | Tinted surfaces |
| `--bg-light` | `#f8fafc` | Light page background |
| `--bg-dark` | `#090d16` | Dark page background |
| `--card-light` | `rgba(255,255,255,0.85)` | Light glass card |
| `--card-dark` | `rgba(15,23,42,0.75)` | Dark glass card |
| `--border-light` | `rgba(226,232,240,0.8)` | Light border |
| `--border-dark` | `rgba(255,255,255,0.08)` | Dark border |

### `localStorage`

| Key | Values | Effect |
|---|---|---|
| `portal-theme` | `dark` \| `light` | Adds/removes `dark` on `<html>`. Defaults to `dark`. |

---

## Metadata Reference

Optional `<meta>` tags in a manual's `<head>`. These drive auto-discovered cards.

```html
<title>My App – User Manual</title>
<meta name="description" content="Summary used for the card body." />
<meta name="app-icon" content="🚀" />
<meta name="app-platform" content="Web App" />
<meta name="app-tags" content="Web,Dashboard,User Manual" />
```

| Tag | Fallback when absent |
|---|---|
| `title` | First `<h1>` text, then the folder name. |
| `description` | First `<p>` text, then a generic string. |
| `app-icon` | Inferred from page text: desktop/WinForms/Windows → `🖥️`; Android/mobile/phone → `📱`; API/backend/server → `🌐`; otherwise `✨`. |
| `app-platform` | Inferred from page text: WinForms/desktop → `Windows Desktop`; Android → `Android App`; web → `Web Portal`; otherwise `Interactive App`. |
| `app-tags` | `['Auto-Discovered', 'User Manual']` |

---

## Deployment

Because the site is fully static, any static host works.

| Platform | Steps |
|---|---|
| **GitHub Pages** | Push the repo, then Settings → Pages → deploy from branch, root. |
| **Netlify** | Drag the folder onto the Netlify Drop page, or connect the repository. |
| **Vercel** | `npx vercel --prod` and accept the defaults. |
| **Cloudflare Pages** | Connect the repository; build command and output directory both empty. |
| **Local LAN** | `python -m http.server 8000 --bind 0.0.0.0` and share the host IP. |

Notes:

- HTTPS is preferred; `file://` blocks `fetch()` in most browsers.
- CDNs (`cdn.tailwindcss.com`, `fonts.googleapis.com`) require outbound network access.
- Serve the **repository root**, not a subfolder — card links are root-relative.

---

## Browser Support

Targets current evergreen browsers.

| Browser | Minimum |
|---|---|
| Chrome / Edge | 90+ |
| Firefox | 90+ |
| Safari | 15.4+ |
| Mobile Safari / Chrome | Latest |

Required features: CSS custom properties, `backdrop-filter`, `async`/`await`,
optional chaining (`?.`), `DOMParser`, `localStorage`, ES2015 template literals.
`backdrop-filter` degrades gracefully to a solid surface.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Cards show but metadata is stale | Manifest not fetched | Serve over HTTP instead of `file://`. |
| New folder not appearing | Outside probe range or no `index.html` | Name it `appN` under 15, or add it to `apps.json`. |
| "Auto-Discovered" instead of custom title | Manifest fetch failed | Check `apps.json` is valid JSON and served as `text/json`. |
| Page renders unstyled | Tailwind CDN blocked | Check network/proxy; offline styling is partial by design. |
| Theme resets on refresh | `localStorage` unavailable | Private browsing or blocked storage. |
| Manuals show no styling | Manual opened standalone without its assets | Manuals inline their CSS; verify the file is complete. |
| Images missing in app4 | Wrong serve root | Serve the repository root so `winform_screenshots/` resolves. |
| Port already in use | Conflict | `python -m http.server 8080`. |

---

## Credits

- **Tailwind CSS** — utility CSS framework via CDN
- **Plus Jakarta Sans** — typeface via Google Fonts
- **Icons** — Unicode emoji, no icon font dependency
- **Author** — Creations of Chris Cajes

---

© 2026 Creations of Chris Cajes
