import type { StationTemplate } from "./types";

// NBC 6 / WTVJ (NBC Miami).
//
// Design (from the station comps): full-bleed photo, a vertical scrim that is
// clear at the top and ramps to near-black across the bottom, the NBC 6 lockup
// anchored bottom-left, and a bottom-aligned headline in Arthouse Owned Bold
// (white, uppercase, thin dark outline) set to the right of the logo. A faint
// top vignette adds depth.
//
// Logo asset: the official station-supplied NBC 6 lockup (white "6" + colored
// peacock) as a transparent PNG (902x750). The white "6" only reads over the
// dark scrim, which is exactly where it sits.
const HEADLINE_FONT = '"Arthouse Owned Bold"';
const STROKE = "rgba(0,0,0,0.5)";

export const wtvj: StationTemplate = {
  id: "wtvj",
  name: "NBC 6 South Florida (WTVJ)",
  network: "NBC",
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
      logo: { src: "/logos/wtvj-logo.png", x: 44, y: 548, width: 180 },
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
      logo: { src: "/logos/wtvj-logo.png", x: 56, y: 1570, width: 253 },
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
