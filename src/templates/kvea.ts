import type { StationTemplate } from "./types";

// Telemundo 52 Los Angeles (KVEA).
//
// Same style as Telemundo 51 / WSCV (and the WTVJ "Miami" family) — only the
// logo differs (the Telemundo 52 lockup). The KVEA logo has the same dimensions
// as WSCV's, so it reuses the same sizing/position.
const HEADLINE_FONT = '"Arthouse Owned Bold"';
const STROKE = "rgba(0,0,0,0.5)";

export const kvea: StationTemplate = {
  id: "kvea",
  name: "Telemundo 52 (KVEA)",
  network: "Telemundo",
  layouts: {
    horizontal: {
      canvas: { width: 1280, height: 720 },
      photo: { x: 0, y: 0, width: 1280, height: 720, fit: "cover" },
      overlay: {
        type: "linear",
        angle: 90,
        stops: [
          { offset: 0, color: "rgba(0,0,0,0)" },
          { offset: 0.5, color: "rgba(0,0,0,0)" },
          { offset: 0.72, color: "rgba(0,0,0,0.35)" },
          { offset: 1, color: "rgba(0,0,0,0.95)" },
        ],
        box: { x: 0, y: 0, width: 1280, height: 720 },
      },
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
      logo: { src: "/logos/kvea-logo.png", x: 44, y: 552, width: 195 },
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
      logo: { src: "/logos/kvea-logo.png", x: 56, y: 1585, width: 260 },
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
