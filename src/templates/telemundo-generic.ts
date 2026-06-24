import type { StationTemplate } from "./types";

// Generic Telemundo-style template. Placeholder design until a real station PSD
// is translated. Uses a centered/lower headline and a brand-colored gradient
// scrim distinct from the NBC variant.
const TELEMUNDO_BLUE = "#0d3b8f";

export const telemundoGeneric: StationTemplate = {
  id: "telemundo-generic",
  name: "Telemundo (Generic)",
  network: "Telemundo",
  layouts: {
    horizontal: {
      canvas: { width: 1280, height: 720 },
      photo: { x: 0, y: 0, width: 1280, height: 720, fit: "cover" },
      overlay: {
        type: "linear",
        angle: 90,
        stops: [
          { offset: 0.4, color: "rgba(13,59,143,0)" },
          { offset: 1, color: "rgba(13,59,143,0.9)" },
        ],
        box: { x: 0, y: 0, width: 1280, height: 720 },
      },
      decorations: [
        {
          type: "gradientRect",
          box: { x: 0, y: 700, width: 1280, height: 20 },
          angle: 0,
          stops: [
            { offset: 0, color: "#ff7a00" },
            { offset: 1, color: TELEMUNDO_BLUE },
          ],
        },
      ],
      logo: { src: "/logos/telemundo-generic.svg", x: 56, y: 48, width: 220 },
      headline: {
        box: { x: 56, y: 470, width: 1168, height: 190 },
        font: "Arial, Helvetica, sans-serif",
        weight: 800,
        sizePx: 80,
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
          { offset: 0.45, color: "rgba(13,59,143,0)" },
          { offset: 1, color: "rgba(13,59,143,0.92)" },
        ],
        box: { x: 0, y: 0, width: 1080, height: 1920 },
      },
      decorations: [
        {
          type: "gradientRect",
          box: { x: 0, y: 1896, width: 1080, height: 24 },
          angle: 0,
          stops: [
            { offset: 0, color: "#ff7a00" },
            { offset: 1, color: TELEMUNDO_BLUE },
          ],
        },
      ],
      logo: { src: "/logos/telemundo-generic.svg", x: 72, y: 90, width: 300 },
      headline: {
        box: { x: 72, y: 1300, width: 936, height: 500 },
        font: "Arial, Helvetica, sans-serif",
        weight: 800,
        sizePx: 104,
        minSizePx: 52,
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
