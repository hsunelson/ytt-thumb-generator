import type { StationTemplate } from "./types";

// NBC 7 San Diego (KNSD) — "7 San Diego News Daily" style.
//
// Distinct from the WTVJ "Miami" family: full-bleed photo with NO dark scrim,
// the lockup in the top-right, and a bottom-left headline set as BLACK text on
// per-line WHITE blocks, with blue diagonal-stripe accents peeking out behind
// the first block's top-left and the last block's bottom-right corners.
//
// Headline font reuses Arthouse Owned Bold (the face we already ship); swap if
// KNSD provides a different typeface.
const HEADLINE_FONT = '"Arthouse Owned Condensed Medium"';
const STRIPES = "/patterns/knsd-stripes.png";

export const knsd: StationTemplate = {
  id: "knsd",
  name: "NBC 7 San Diego (KNSD)",
  network: "NBC",
  layouts: {
    horizontal: {
      canvas: { width: 1280, height: 720 },
      photo: { x: 0, y: 0, width: 1280, height: 720, fit: "cover" },
      // No overlay — the white headline blocks carry legibility.
      logo: { src: "/logos/knsd-logo.png", x: 974, y: 36, width: 270 },
      headline: {
        box: { x: 64, y: 430, width: 1000, height: 250 },
        font: HEADLINE_FONT,
        weight: "normal",
        sizePx: 88,
        minSizePx: 40,
        color: "#000000",
        align: "left",
        verticalAlign: "bottom",
        lineHeight: 1.0,
        transform: "uppercase",
        maxLines: 3,
        highlight: { color: "#ffffff", padX: 18, padY: 12, lineGap: 5 },
        accents: [
          { src: STRIPES, corner: "tl", width: 150, height: 100, stickX: 12, stickY: 14 },
          { src: STRIPES, corner: "br", width: 150, height: 100, stickX: 12, stickY: 14 },
        ],
      },
    },
    vertical: {
      canvas: { width: 1080, height: 1920 },
      photo: { x: 0, y: 0, width: 1080, height: 1920, fit: "cover" },
      logo: { src: "/logos/knsd-logo.png", x: 730, y: 60, width: 320 },
      headline: {
        box: { x: 72, y: 1420, width: 950, height: 330 },
        font: HEADLINE_FONT,
        weight: "normal",
        sizePx: 96,
        minSizePx: 44,
        color: "#000000",
        align: "left",
        verticalAlign: "bottom",
        lineHeight: 1.0,
        transform: "uppercase",
        maxLines: 3,
        highlight: { color: "#ffffff", padX: 20, padY: 14, lineGap: 5 },
        accents: [
          { src: STRIPES, corner: "tl", width: 170, height: 110, stickX: 14, stickY: 16 },
          { src: STRIPES, corner: "br", width: 170, height: 110, stickX: 14, stickY: 16 },
        ],
      },
    },
  },
};
