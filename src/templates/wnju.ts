import type { StationTemplate } from "./types";

// Telemundo 47 New York (WNJU).
//
// Same design as NBC 4 New York / WNBC (full-bleed photo, no scrim, top-left
// lockup, centered headline in a single rounded blue pill) — only the logo
// differs (the Telemundo 47 lockup). Logo widths are tuned for its squarer
// aspect so it reads the same height as WNBC's.
const HEADLINE_FONT = '"Arthouse Owned Bold"';
const PILL_BLUE = "#2c4090";

export const wnju: StationTemplate = {
  id: "wnju",
  name: "Telemundo 47 (WNJU)",
  network: "Telemundo",
  layouts: {
    horizontal: {
      canvas: { width: 1280, height: 720 },
      photo: { x: 0, y: 0, width: 1280, height: 720, fit: "cover" },
      logo: { src: "/logos/wnju-logo.png", x: 44, y: 36, width: 196 },
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
      logo: { src: "/logos/wnju-logo.png", x: 44, y: 48, width: 224 },
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
