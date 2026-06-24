import type { StationTemplate } from "./types";

// Generic NBC-style template. Placeholder design used until a real station PSD
// is translated. Demonstrates the full layer stack: photo, bottom scrim,
// brand color bar, logo, and headline.
const NBC_BLUE = "#0089d0";

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
          { offset: 0.45, color: "rgba(0,0,0,0)" },
          { offset: 1, color: "rgba(0,0,0,0.85)" },
        ],
        box: { x: 0, y: 0, width: 1280, height: 720 },
      },
      decorations: [
        { type: "rect", box: { x: 0, y: 612, width: 12, height: 108 }, color: NBC_BLUE },
      ],
      logo: { src: "/logos/nbc-generic.svg", x: 56, y: 48, width: 150 },
      headline: {
        box: { x: 56, y: 470, width: 1000, height: 200 },
        font: "Arial, Helvetica, sans-serif",
        weight: 800,
        sizePx: 84,
        minSizePx: 40,
        color: "#ffffff",
        align: "left",
        verticalAlign: "bottom",
        lineHeight: 1.05,
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
          { offset: 0.5, color: "rgba(0,0,0,0)" },
          { offset: 1, color: "rgba(0,0,0,0.88)" },
        ],
        box: { x: 0, y: 0, width: 1080, height: 1920 },
      },
      decorations: [
        { type: "rect", box: { x: 0, y: 1560, width: 16, height: 360 }, color: NBC_BLUE },
      ],
      logo: { src: "/logos/nbc-generic.svg", x: 72, y: 90, width: 200 },
      headline: {
        box: { x: 72, y: 1320, width: 940, height: 480 },
        font: "Arial, Helvetica, sans-serif",
        weight: 800,
        sizePx: 110,
        minSizePx: 56,
        color: "#ffffff",
        align: "left",
        verticalAlign: "bottom",
        lineHeight: 1.05,
        transform: "uppercase",
        maxLines: 4,
      },
    },
  },
};
