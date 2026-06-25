import type { StationTemplate } from "./types";

// Telemundo 51 / WSCV (Telemundo Miami).
//
// Same visual style as NBC 6 / WTVJ (full-bleed photo, vertical scrim ramping to
// near-black at the bottom, faint top vignette, bottom-aligned headline in
// Arthouse Owned Bold) — only the logo differs.
//
// Logo asset: the official Telemundo 51 lockup (red "T" + white "51" +
// "TELEMUNDO" wordmark) as a transparent PNG (1002x750). The white elements read
// over the dark scrim, where the logo sits.
const HEADLINE_FONT = '"Arthouse Owned Bold"';
const STROKE = "rgba(0,0,0,0.5)";

export const wscv: StationTemplate = {
  id: "wscv",
  name: "Telemundo 51 (WSCV)",
  network: "Telemundo",
  layouts: {
    horizontal: {
      canvas: { width: 1280, height: 720 },
      photo: { x: 0, y: 0, width: 1280, height: 720, fit: "cover" },
      overlay: {
        type: "linear",
        angle: 90, // top -> bottom
        stops: [
          { offset: 0, color: "rgba(0,0,0,0)" },
          { offset: 0.5, color: "rgba(0,0,0,0)" },
          { offset: 0.72, color: "rgba(0,0,0,0.35)" },
          { offset: 1, color: "rgba(0,0,0,0.95)" },
        ],
        box: { x: 0, y: 0, width: 1280, height: 720 },
      },
      // Faint top vignette.
      decorations: [
        {
          type: "gradientRect",
          box: { x: 0, y: 0, width: 1280, height: 120 },
          angle: 90,
          stops: [
            { offset: 0, color: "rgba(0,0,0,0.22)" },
            { offset: 1, color: "rgba(0,0,0,0)" },
          ],
        },
      ],
      logo: { src: "/logos/wscv-logo.png", x: 44, y: 552, width: 195 },
      headline: {
        box: { x: 256, y: 470, width: 984, height: 230 },
        font: HEADLINE_FONT,
        weight: "normal",
        sizePx: 92,
        minSizePx: 40,
        color: "#ffffff",
        strokeColor: STROKE,
        strokeWidthPx: 3,
        align: "left",
        verticalAlign: "bottom",
        lineHeight: 1.0,
        transform: "uppercase",
        maxLines: 3,
      },
    },
    vertical: {
      canvas: { width: 1080, height: 1920 },
      photo: { x: 0, y: 0, width: 1080, height: 1920, fit: "cover" },
      overlay: {
        type: "linear",
        angle: 90,
        stops: [
          { offset: 0, color: "rgba(0,0,0,0)" },
          { offset: 0.5, color: "rgba(0,0,0,0)" },
          { offset: 0.72, color: "rgba(0,0,0,0.4)" },
          { offset: 1, color: "rgba(0,0,0,0.97)" },
        ],
        box: { x: 0, y: 0, width: 1080, height: 1920 },
      },
      decorations: [
        {
          type: "gradientRect",
          box: { x: 0, y: 0, width: 1080, height: 160 },
          angle: 90,
          stops: [
            { offset: 0, color: "rgba(0,0,0,0.2)" },
            { offset: 1, color: "rgba(0,0,0,0)" },
          ],
        },
      ],
      logo: { src: "/logos/wscv-logo.png", x: 56, y: 1585, width: 260 },
      headline: {
        box: { x: 336, y: 1430, width: 694, height: 350 },
        font: HEADLINE_FONT,
        weight: "normal",
        sizePx: 96,
        minSizePx: 42,
        color: "#ffffff",
        strokeColor: STROKE,
        strokeWidthPx: 4,
        align: "left",
        verticalAlign: "bottom",
        lineHeight: 1.0,
        transform: "uppercase",
        maxLines: 3,
      },
    },
  },
};
