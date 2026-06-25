import type { StationTemplate } from "./types";

// Generic NBC template — WTVJ "Miami" style (full-bleed photo, vertical scrim
// ramping to near-black at the bottom, faint top vignette, bottom-aligned
// headline in Arthouse Owned Bold) with the generic NBC peacock logo. Use as a
// starting point for any NBC station that doesn't yet have its own template.
const HEADLINE_FONT = '"Arthouse Owned Bold"';
const STROKE = "rgba(0,0,0,0.5)";

export const nbcGeneric: StationTemplate = {
  id: "nbc-generic",
  name: "NBC (Generic)",
  network: "NBC",
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
      logo: { src: "/logos/nbc-generic.png", x: 44, y: 586, width: 182 },
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
      logo: { src: "/logos/nbc-generic.png", x: 56, y: 1620, width: 249 },
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
