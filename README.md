# ytt-thumb-generator

A browser-based tool for NBC Local & Telemundo stations to create on-brand
YouTube thumbnails. A staff member picks their station, uploads & crops a
background photo, types a headline, previews, and downloads finished PNGs — no
Photoshop required.

- **Two output formats:** Horizontal (1280×720, 16:9) and Vertical Shorts
  (1080×1920, 9:16). One photo upload, an independent crop per orientation.
- **Per-station designs:** each station's PSD is reimplemented once as a
  code-based template; the rendered preview is pixel-identical to the download.
- **Static & serverless:** fully client-side, deployed to an S3 bucket.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

## Tech

- **Next.js (App Router) + TypeScript**, static export (`output: "export"`).
- **Tailwind CSS** for UI.
- **HTML5 Canvas 2D** — a single `renderThumbnail` powers both the live preview
  and the PNG export (WYSIWYG). See `src/lib/renderThumbnail.ts`.
- **react-easy-crop** for the aspect-locked crop step.

Key files:

| Path | Purpose |
| --- | --- |
| `src/templates/types.ts` | `StationTemplate` / `Layout` data model |
| `src/templates/index.ts` | registry of all stations |
| `src/templates/<id>.ts` | one config per station |
| `src/lib/renderThumbnail.ts` | core Canvas renderer (photo, scrim, logo, headline) |
| `src/lib/exportPng.ts` | render-to-canvas + PNG download |
| `src/lib/images.ts` | image load + crop helpers |
| `src/app/page.tsx` | UI orchestration |

## Add or modify a station

Every station is one config file in `src/templates/<id>.ts` + a logo in
`public/logos/`, registered in `src/templates/index.ts`. The renderer does
**not** need to change for a typical new station — you're filling in coordinates
and colors. Two formats live in one file: `layouts.horizontal` (1280×720) and
`layouts.vertical` (1080×1920).

### Clone a design family (the fast path)

Most stations match one of three existing "families." Copy the closest one:

| Family | Clone from | Look |
| --- | --- | --- |
| **Miami** | `wtvj.ts` / `wscv.ts` / `knbc.ts` / `kvea.ts` | full-bleed photo, bottom scrim, **bottom-left logo**, white outlined headline |
| **Stripes** | `knsd.ts` | **top-right logo**, black text on per-line white `highlight` blocks + corner `accents` |
| **Pill** | `wnbc.ts` / `wnju.ts` | **top-left logo**, centered white text in a rounded `highlight` (`mode: "block"`) pill |

Steps:

1. **Logo** → save the transparent PNG to `public/logos/<id>.png` (used as-is).
   - If the logo looks empty on a white preview, it may have **white elements on
     transparency** — composite it over a dark color to inspect.
   - If the artwork floats in a mostly-empty canvas, **trim** the transparent
     margins so it positions predictably.
2. **Copy the closest template** to `src/templates/<id>.ts`; change
   `id` / `name` / `network` / `logo.src`.
3. **Tune to the comps:** `logo` `{ x, y, width }` (adjust width for the new
   logo's aspect ratio) and `headline.box` `{ x, y, width, height }`.
4. **Register:** import it in `src/templates/index.ts` and add it to `STATIONS`.
5. **Preview:** `npm run dev`, pick the station, and nudge values until it
   matches the comp.

### Headline capabilities (what the config can express)

`headline` supports, beyond the basics (`box`, `font`, `sizePx` with auto-shrink,
`minSizePx`, `color`, `align`, `verticalAlign`, `lineHeight`, `transform`,
`maxLines`):

- **`strokeColor` / `strokeWidthPx`** — text outline (Miami family).
- **`highlight`** `{ color, padX, padY, lineGap, mode?, radius? }` — a background
  behind the text. `mode: "per-line"` (default) draws one block per line (KNSD);
  `mode: "block"` draws a single box around the whole headline, with `radius` for
  a rounded pill (WNBC).
- **`accents`** `[{ src, corner: "tl"|"br", width, height, stickX, stickY }]` —
  image patches tucked behind the text-block corners (KNSD stripes). Referenced
  images are loaded automatically (see `src/lib/layoutImages.ts`).

### Fonts

Brand fonts are loaded at runtime (so URLs work under the GitHub Pages subpath):

1. Drop the `.woff` in `public/fonts/`.
2. Add it to the `FONTS` list in `src/components/FontLoader.tsx` with a stable
   family name.
3. Reference that family in the template's `headline.font`.

### A brand-new design (not cloning a family)

Start a blank `StationTemplate` — only `canvas`, `photo`, `logo`, and `headline`
are required per layout; omit `overlay` / `decorations` / `background` /
`highlight` / `accents` when unused. Mix the building blocks (photo box,
gradient `overlay` scrim, `decorations` rects/gradient rects, logo, headline) to
match the comp.

If the design needs a **visual primitive the renderer doesn't have yet** (a
circular/cropped logo, a non-rectangular shape, a text drop shadow, a second text
field, a bordered box, …), add it as an **optional** field in
`src/templates/types.ts` and handle it in `src/lib/renderThumbnail.ts` — keeping
it optional so existing stations are unaffected. This is the same pattern used
for KNSD's `accents` and WNBC's pill, and it makes the primitive reusable by any
future station. Rule of thumb: **new layout → config only; new visual element →
small renderer add + config.**

### Modifying an existing station

Edit its `src/templates/<id>.ts` (logo `x/y/width`, `headline.box`, colors, pill
`radius`/padding, etc.). Note that each file currently **duplicates** its
family's style, so a change affects only that one station — not its siblings.

### Delivering assets

Zip the PNGs (and any font) and attach the **`.zip`**. Inline-pasted images don't
come through as files; the only formats that reliably attach are file uploads
(a `.zip` of PNGs works well).

> The repo ships generic NBC and Telemundo placeholder templates so the app runs
> immediately even before real station designs are added.

## Deploy to GitHub Pages

The app deploys to a GitHub **project page** at
`https://hsunelson.github.io/ytt-thumb-generator/` via GitHub Actions
(`.github/workflows/deploy-pages.yml`).

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment**
and set **Source = "GitHub Actions"**. (This can't be scripted.)

After that, the workflow builds and publishes on every push to `main` (or run it
manually from the **Actions** tab via "Run workflow"). To deploy from a different
branch, edit the `branches:` list in the workflow or dispatch it from that branch.

How the subpath is handled: a project page is served under `/ytt-thumb-generator/`,
so the workflow builds with `NEXT_PUBLIC_BASE_PATH=/ytt-thumb-generator`. That
sets Next's `basePath`/`assetPrefix`, and our runtime asset loading (fonts via
`src/components/FontLoader.tsx`, logos/patterns via `withBasePath` in
`src/lib/basePath.ts`) prefixes the same path. Local dev and the S3 build leave
the env var empty, so they serve from the root. A `public/.nojekyll` file keeps
GitHub Pages from stripping the `_next` folder.

> Using a **custom domain** instead? It serves from the root, so set
> `NEXT_PUBLIC_BASE_PATH` empty in the workflow and add your `CNAME`.

## Deploy to S3

The app is a static site, so deploy is "build → sync to bucket":

```bash
S3_BUCKET=your-bucket-name AWS_REGION=us-east-1 npm run deploy
# optional: AWS_PROFILE=your-profile
```

`npm run deploy` runs `npm run build` then `scripts/deploy-s3.sh`, which
`aws s3 sync`s `./out` to the bucket (long cache for hashed assets, no-cache for
HTML).

**One-time bucket setup:**

- Enable **Static website hosting** with index document `index.html`.
- Make objects publicly readable (bucket policy), **or** — recommended — keep the
  bucket private and put **CloudFront + HTTPS** in front of it.
- Requires the AWS CLI configured with credentials that can write to the bucket.

CloudFront/HTTPS hardening and auth are intentionally out of scope for v1.
