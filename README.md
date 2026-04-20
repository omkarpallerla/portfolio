# Omkar Pallerla — Portfolio

Personal portfolio site for **Omkar Pallerla**, BI Developer & Data Analyst.

**Live:** https://omkarpallerla.github.io/portfolio/

---

## Features

- **Interactive WebGL hero** — animated data-flow field that reacts to the cursor
- **3D skill constellation** — rotating sphere of tools you can drag/hover
- **3D-tilt project cards** with gradient-border hover
- **Editorial typography** — Instrument Serif (display) + Geist (body) + JetBrains Mono (UI)
- **Scroll-driven reveals & animated counters**
- **Dark theme** with aurora gradient accents (sky → violet → fuchsia)
- **Fully responsive**, zero build step, zero dependencies, respects `prefers-reduced-motion`

---

## File structure

```
portfolio/
├── index.html          # Single-page site
├── css/
│   └── style.css       # Design system, layout, animations
├── js/
│   └── main.js         # Canvas, tilt, reveal, counters, filters
├── assets/             # Drop images/icons here as needed
└── README.md
```

---

## Local preview

No build tools required. Just serve the folder:

```bash
# Python
python3 -m http.server 8000

# Or Node
npx serve .
```

Open `http://localhost:8000`.

---

## Deploy to GitHub Pages

1. Push the contents of this folder to your `portfolio` repo (on `main` branch).
2. In GitHub → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `/ (root)`.
3. Site will be live at `https://omkarpallerla.github.io/portfolio/` within ~1 minute.

---

## Updating content

- **Hero stats, bio, timeline** → edit `index.html` (clearly labeled sections)
- **Projects** → edit the `<article class="project">` blocks in the `#projects` section
- **Colors / fonts / spacing** → tweak CSS variables at the top of `css/style.css`
- **Skill constellation nodes** → edit the `TOOLS` array in `js/main.js`

---

## Tech

- Vanilla HTML / CSS / JavaScript
- Canvas 2D for both the hero field and the 3D constellation (no Three.js, keeps it lightweight)
- Google Fonts: Instrument Serif, Geist, JetBrains Mono

---

© 2026 Omkar Pallerla
