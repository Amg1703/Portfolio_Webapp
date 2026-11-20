# Arjun Mageswaran — Portfolio

**Live:** https://arjunmageswaran.vercel.app/

Personal portfolio for **Arjun Mageswaran**, AI/LLM engineer in Sydney. A single-page site built with **Next.js 16 (App Router)**, **React 19** and **Tailwind CSS v4**, exported as fully static files so it can be hosted anywhere.

It covers skills, experience (Valeon Partners, Deckoviz Space Labs), education and featured projects, with a few interactive touches: a 3D intro, a cursor-reactive ripple background, scroll-tracking rails and optional background music.

---

## Features

| Feature | What it does | Where |
|---|---|---|
| **3D intro** | Extruded “AMG” monogram spins in from depth while a status readout counts to 100%, then rushes the camera and a portal opens onto the site. Plays once per session; click / any key skips. | `intro-loader.tsx`, `globals.css` |
| **Launch with music** | Button in the intro starts the soundtrack *and* launches (the click satisfies browser autoplay rules). | `intro-loader.tsx`, `music.ts` |
| **Ripple field** | Canvas dot-grid that lights up under the cursor; ripples trail the pointer and burst on click, pushing dots outward as rings pass. Runs only while something is animating. | `ripple-field.tsx` |
| **Page-wide glow** | Drifting teal/violet radial gradients fixed behind every section. | `page.tsx` |
| **Terminal** | Fake shell that types `whoami`, current roles and engine stats — waits until the intro has launched. | `terminal.tsx` |
| **Typewriter** | Cycles through what I’m “currently building”. | `typewriter.tsx` |
| **Experience timeline** | Glowing pointer travels down the timeline as you scroll; milestones light up when reached. | `timeline-progress.tsx` |
| **Scroll rail** | Fixed left rail (≥1280px) with a pointer gliding between section markers; click to jump. | `scroll-rail.tsx` |
| **Dock** | Floating bottom nav that highlights the section in view, plus a CV download. | `dock.tsx` |
| **Live clock** | Sydney time in the header. | `live-clock.tsx` |
| **Music toggle** | Header “music on/off” with fade in/out and animated EQ bars. Hidden if no track is present. | `music-toggle.tsx`, `music.ts` |

**Accessibility & resilience**

- Every animation respects `prefers-reduced-motion` (intro skipped, ripples/typing/marquee disabled).
- Animated text (terminal, typewriter) has an `sr-only` full-text equivalent.
- The intro is decided by an inline script **before first paint** (no flash of content), and a CSS failsafe hides the overlay after 8s if scripts never run.
- Light and dark themes via CSS custom properties, following the OS setting.

---

## Tech stack

- **Framework:** Next.js 16 (App Router, `output: "export"` static build), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (`@theme` tokens), hand-written CSS for 3D/scroll-driven animations
- **Rendering:** Server Components for content; small Client Components for interactivity
- **Graphics:** Canvas 2D (ripple field), CSS 3D transforms (intro), CSS scroll-driven animations (`animation-timeline: view()`)
- **No runtime dependencies** beyond Next/React

---

## Architecture

```
                 build time (next build → out/)
┌──────────────────────────────────────────────────────────────┐
│ src/data/portfolio.ts   ← single source of truth for content │
│          │                                                   │
│          ▼                                                   │
│ src/app/page.tsx  (Server Component)                         │
│   • renders all sections to static HTML                      │
│   • existsSync() checks public/profile.jpg & music file      │
│     → shows photo / music toggle only if the files exist     │
└──────────────────────────────────────────────────────────────┘
                 runtime (browser)
┌──────────────────────────────────────────────────────────────┐
│ layout.tsx inline script → html[data-intro]=playing|seen      │
│                                                              │
│ IntroLoader ──launch()──► html[data-intro]=done ─► #site      │
│     │                         (CSS transition: zoom/blur in)  │
│     └─ "launch with music" ─► music.ts (shared player) ◄──┐   │
│                                                           │   │
│ MusicToggle (header) ─────────────────────────────────────┘   │
│ Terminal waits for data-intro≠playing (MutationObserver)     │
│ RippleField  ─ canvas, rAF loop only while active            │
│ ScrollRail / TimelineProgress / Dock ─ scroll & observers    │
└──────────────────────────────────────────────────────────────┘
```

---

## Project structure

```
portfolio/
├── public/
│   ├── Arjun-Mageswaran-Resume.pdf   # served by the "Download resume" buttons
│   ├── music/ambient.mp3             # background track (optional)
│   └── profile.jpg                   # optional photo; initials shown if missing
├── src/
│   ├── app/
│   │   ├── layout.tsx                # fonts, metadata, pre-paint intro script
│   │   ├── page.tsx                  # the whole page (Server Component)
│   │   └── globals.css               # theme tokens, keyframes, intro/3D CSS
│   ├── components/
│   │   ├── intro-loader.tsx          # 3D monogram intro + launch
│   │   ├── music.ts                  # shared audio player (play/pause/fade/subscribe)
│   │   ├── music-toggle.tsx          # header music on/off
│   │   ├── ripple-field.tsx          # cursor ripple canvas
│   │   ├── terminal.tsx              # typing shell
│   │   ├── typewriter.tsx            # rotating phrases
│   │   ├── timeline-progress.tsx     # experience scroll pointer
│   │   ├── scroll-rail.tsx           # page-wide section tracker
│   │   ├── dock.tsx                  # floating bottom nav
│   │   ├── live-clock.tsx            # Sydney clock
│   │   └── icons.tsx                 # inline SVG icons
│   └── data/
│       └── portfolio.ts              # profile, experience, projects, skills, education
├── next.config.ts                    # output: "export"
└── package.json
```

---

## Editing content

All text lives in [`src/data/portfolio.ts`](src/data/portfolio.ts):

- `profile` — name, role, intro paragraphs, typewriter phrases, links
- `experience` — roles, bullet points, tech tags
- `projects` — `featured: true` shows a full card; `repo` adds a GitHub link
- `skills`, `education`

Assets:

- **Photo:** save as `public/profile.jpg` → replaces the “AMG” initials
- **Music:** save as `public/music/ambient.mp3` → enables the music toggle and the intro’s “launch with music” button
- **Resume:** replace `public/Arjun-Mageswaran-Resume.pdf`

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # static site → out/
npx serve out      # preview the production build
```

> The intro plays once per browser session. To see it again, open a new tab/private window or run `sessionStorage.clear()` in the console.

---

## Deployment

The site is a static export, so any static host works.

**Vercel (recommended)** — import the GitHub repo at vercel.com → *Add New → Project*; framework is auto-detected. Every push to `main` redeploys.

Alternatives: Netlify / Cloudflare Pages (build `npm run build`, output `out`), or GitHub Pages.

---

## Credits

- Background music: “Cybernetic Pulse” by luminewave, used under the Pixabay Content License.
- Fonts: Geist & Geist Mono (via `next/font`).
