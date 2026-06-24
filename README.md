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

## Add a new station

Each PSD becomes one template config. There are **no renderer changes** — adding
a station is config + a logo asset.

1. **Logo:** export the station's logo layer as a transparent PNG/SVG to
   `public/logos/<station-id>.png`.
2. **Read coordinates from the PSD** for both the landscape (1280×720) and
   vertical (1080×1920) comps: the photo area, logo position/size, headline text
   box, and any brand color bars. Scale the PSD to those canvas sizes if needed.
3. **Create `src/templates/<station-id>.ts`** exporting a `StationTemplate` with
   a `layouts.horizontal` and `layouts.vertical`. Copy
   `src/templates/nbc-generic.ts` as a starting point. Fill in:
   - `photo` box (usually full-bleed `cover`),
   - `overlay` gradient/scrim for text legibility,
   - `decorations` for brand bars/accents,
   - `logo` `{ src, x, y, width }`,
   - `headline` `{ box, font, sizePx, color, align, transform, maxLines, … }`.
4. **Fonts:** to match the PSD typography, add the brand font and set
   `headline.font`. Local fonts go in `public/fonts/` and are wired via
   `next/font/local` in `src/app/layout.tsx`; reference the resulting font
   family in the template.
5. **Register it:** import the template in `src/templates/index.ts` and add it to
   `STATIONS`.
6. **Verify:** `npm run dev`, select the station, and eyeball the preview against
   the PSD; nudge coordinates until it matches.

> The repo ships generic NBC and Telemundo placeholder templates so the app runs
> immediately. Replace them with real station designs as PSDs + logos arrive.

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
