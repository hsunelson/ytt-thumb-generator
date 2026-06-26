import type { StationTemplate } from "./types";

// NBC 4 New York (WNBC).
//
// Design (from the comps): full-bleed photo with NO scrim, the "4 New York"
// lockup in the top-left, and a centered headline set in white inside a single
// rounded blue pill near the bottom.
const HEADLINE_FONT = '"Arthouse Owned Bold"';
const PILL_BLUE = "#2c4090";

export const wnbc: StationTemplate = {
  id: "wnbc",
  name: "NBC 4 New York (WNBC)",
  network: "NBC",
  layouts: {
    horizontal: {
      canvas: { width: 1280, height: 720 },
      photo: { x: 0, y: 0, width: 1280, height: 720, fit: "cover" },
      logo: { src: "/logos/wnbc-logo.png", x: 44, y: 36, width: 230 },
      headline: {
        box: { x: 100, y: 472, width: 1080, height: 200 },
        font: HEADLINE_FONT,
        weight: "normal",
        sizePx: 88,
        minSizePx: 40,
        color: "#ffffff",
        align: "center",
        verticalAlign: "bottom",
        lineHeight: 1.0,
        transform: "uppercase",
        maxLines: 3,
        highlight: {
          color: PILL_BLUE,
          padX: 44,
          padY: 24,
          lineGap: 6,
          mode: "block",
          radius: 40,
        },
      },
    },
    vertical: {
      canvas: { width: 1080, height: 1920 },
      photo: { x: 0, y: 0, width: 1080, height: 1920, fit: "cover" },
      logo: { src: "/logos/wnbc-logo.png", x: 44, y: 48, width: 260 },
      headline: {
        box: { x: 40, y: 1440, width: 1000, height: 340 },
        font: HEADLINE_FONT,
        weight: "normal",
        sizePx: 100,
        minSizePx: 48,
        color: "#ffffff",
        align: "center",
        verticalAlign: "bottom",
        lineHeight: 1.0,
        transform: "uppercase",
        maxLines: 3,
        highlight: {
          color: PILL_BLUE,
          padX: 52,
          padY: 30,
          lineGap: 8,
          mode: "block",
          radius: 52,
        },
      },
    },
  },
};
