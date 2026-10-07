# UX-UI — Learn UX. Master UI. Think Like a Designer.

A complete, offline-first UX/UI learning platform (PWA) in **Bangla and English**, built with
HTML5, CSS3 and vanilla JavaScript (ES modules). No frameworks, no build step, no dependencies.

## Run it

Service workers and ES modules need an HTTP origin (not `file://`):

```bash
cd ux-ui
python3 -m http.server 8080      # or: npx serve .
# open http://localhost:8080
```

Deploy by uploading the folder to any static host with HTTPS (Netlify, Vercel, GitHub Pages,
Firebase Hosting). After the first visit the whole app works offline and can be installed
(Android, Windows, macOS, ChromeOS via Chrome/Edge; iPhone/iPad via Safari → Add to Home Screen).

## What's inside (v3.0.0)

| Area | Content |
|---|---|
| Lessons | 205 lessons in 21 modules, **every one with a visual** (diagram, good/bad mock pair or Figma step pictures): Design Mindset (L0), UX Fundamentals (L1), Human Interaction (L2), Research, Personas, IA, User Flow, Wireframing, Prototyping, Usability Testing, Accessibility, Typography, Color, Layout, 24 UI components, Design Systems, Figma Beginner/Intermediate/Advanced, Career |
| UX Laws | 22 laws, each with the full card (Bangla, English, behavior, web/mobile examples, good/bad, before/after, checklist, when/when not, related, quiz) |
| UX Research | 8 fundamentals + 14 methods (steps, sample questions, pros/cons, output, practice) + 10 offline templates/checklists + Persona Builder |
| Figma library | 2,646 items = 64 hand-written base tutorials × style × size × theme × platform; every item has 9 variant-specific steps, **each with a picture of the Figma editor highlighting where to click** |
| Plugins | 59 real Figma Community plugins, searchable/filterable, each flagged **needs verification** |
| Good vs Bad Lab | 26 data-driven comparisons rendered from mock-UI specs (no image assets) |
| Critique Lab | 8 critiques with reasoning, principle, law and a better design |
| Case studies | 5 full 20-section teaching cases with a "What would you do?" gate (composite scenarios, not real company reports) |
| Questions | 238 exam questions (88 core + 150 in batch 1: MCQ, true/false, multi-select, matching, scenario, identify-the-law, critique) + every lesson/law/method quiz ≈ 285 in the bank; 10 exams |
| Challenges | 160 briefs (10 flagship + 150 composed from 15 domains × 10 templates), daily challenge |
| Projects | 10 guided projects × 12 stages |
| Glossary | 250 bilingual terms (72 + 178 in batch 2), each with a visual example |
| Tools | User Flow Lab (drag, connect, rename, keyboard, save, JSON export), spaced review, global search |

Bangla is the default lesson language (natural, beginner-friendly). Every lesson has a
**বাংলা / English** switch; the other language is one click away in the same page.

## Visual learning

- `js/ui/visuals.js` — ~110 theme-aware SVG diagrams (laws, research methods, accessibility, typography, color, layout, career…)
- `js/ui/figma-visual.js` — draws a simplified Figma editor and highlights the toolbar tool, panel or section a step refers to, with the result on the canvas. Steps are matched by keywords, so new Figma content gets pictures automatically.
- `data/lesson-visuals.js` — maps every lesson, law, method, challenge, project stage and glossary term to a visual. Add an entry here to change or add a picture.

## Releasing updates (installed apps update automatically)

```bash
# 1. make your changes, add a CHANGELOG entry in js/version.js
python3 tools/release.py 3.0.1     # bumps version + regenerates service-worker.js
# 2. deploy the folder
```

What users see: open apps check for a new version on launch, when the app comes back to the
foreground, when the network returns, and every 30 minutes. If the app was just opened, the
update applies silently; if the user is in the middle of something, a banner offers
"Update now / Later" (never during a running exam). After updating, a "What's new" dialog lists
the changes. Old caches are deleted; offline mode keeps working.

**Hosting:** `service-worker.js`, `index.html` and `js/version.js` must not be cached by the
host. `_headers` (Netlify / Cloudflare Pages) and `firebase.json` (Firebase Hosting) are included
and already set this. On other hosts, set `Cache-Control: no-cache` for those three files.

## Architecture

```
index.html, manifest.json, service-worker.js (generated) + service-worker.js.tmpl
tools/release.py   version bump + precache generation · _headers / firebase.json (no-cache rules)
css/   variables · themes (light/dark tokens) · reset · layout · components · responsive
js/
  app.js                 shell, routing table, global actions, search dropdown, PWA
  core/  state.js        central store (settings + learner doc), debounced persistence
         storage.js      LOCAL DATA: IndexedDB (fallback localStorage); settings in localStorage
         progress.js     XP, levels, streaks, completion, spaced revision (1/3/7/14/30), badges
         recommendations.js  daily plan engine (frozen per day)
         search.js       inverted index + prefix matching, built in idle time
         exam.js         question selection, shuffling, grading, scoring
         router.js, i18n.js, transfer.js (export/import), utils.js, icons.js
  ui/    components.js   toast, modal, quiz renderer, compare view, notes, bookmarks…
         mock.js         declarative mock-UI renderer (wireframes, good/bad, Figma visuals)
         visuals.js      SVG instructional diagrams (theme-aware)
  views/ one module per area, loaded lazily
  firebase/              REMOTE DATA (inactive): RemoteStore interface, Firebase adapter, SyncManager
data/  curriculum-ux · curriculum-process · ux-research · ux-laws · ui · figma · figma-plugins ·
       case-studies · questions · glossary · challenges · comparisons · career · content (registry)
```

**Content keys.** Everything is addressable as `type:id` (`lesson:usability`, `law:fitts`,
`figma:primary-button--filled-large-dark-mobile`). `data/content.js` normalizes all data
into one graph used by routing, search, progress, recommendations and bookmarks.

**Scaling.** Lists filter in memory and render one page (18–24 cards) at a time; search is an
inverted index; views are lazy modules; data modules load in parallel and are precached.
Adding content = adding records to the data files — no UI changes needed.

## Adding content

- Lesson: add an object to the relevant `LESSONS` array (see schema at top of `curriculum-ux.js`).
- Comparison: add an `X(...)` record in `comparisons.js` using mock nodes (`['btn', {t, v}]` …).
- Plugin: add a `P(...)` record; set `lastVerified` after checking the Figma Community listing.
- Question: add to `questions.js` or a new batch file (e.g. `questions-b2.js`, wired in `content.js`); tag it so exams pick it up.
- Glossary: add to `glossary.js` or a batch file (`glossary-b2.js`); duplicates are skipped automatically.
- After any change, run `python3 tools/release.py X.Y.Z` before deploying.

## Connecting Firebase later

The app separates LOCAL data (`core/storage.js`, `core/state.js`) from REMOTE data
(`firebase/`). To enable sync: fill `firebase/config.js`, construct `FirebaseRemoteStore`
in `firebase/sync.js`, add a sign-in button calling `sync.remote.signIn()` then
`sync.syncNow()`. `mergeLearner()` already merges completions, notes, exams and XP safely.
Until then, **Settings → Export/Import JSON** moves progress between devices.

## Accessibility

Semantic landmarks, skip link, visible focus, keyboard-operable everything (including the flow
lab and exams), ARIA for dialogs/tabs/radios/live regions, reduced-motion support, AA contrast
in both themes, 44 px+ touch targets, and Bangla `lang` attributes.

## Honest notes

- Case studies are composite teaching cases; their metrics are illustrative.
- Plugin records need periodic verification (marked in the UI).
- Google Fonts are optional; system fonts are used offline until fonts are cached.
