// Core data model for the thumbnail generator.
//
// A `StationTemplate` is the code-based reimplementation of a station's PSD
// design. Each station defines one `Layout` per orientation (horizontal and
// vertical), because the PSD compositions differ between the two formats and
// are not simply scaled versions of each other.

export type Orientation = "horizontal" | "vertical";

export const ORIENTATIONS: Orientation[] = ["horizontal", "vertical"];

// Output sizes (YouTube standards).
export const CANVAS_SIZE: Record<Orientation, { width: number; height: number }> =
  {
    horizontal: { width: 1280, height: 720 }, // 16:9
    vertical: { width: 1080, height: 1920 }, // 9:16 (Shorts)
  };

// Aspect ratio (width / height) used to lock the crop box per orientation.
export const ASPECT: Record<Orientation, number> = {
  horizontal: 16 / 9,
  vertical: 9 / 16,
};

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LogoSpec {
  src: string; // /public path to a transparent PNG/SVG
  x: number;
  y: number;
  width: number;
  height?: number; // optional; preserves aspect ratio if omitted
}

export interface PhotoSpec extends Box {
  // How the cropped photo fills its box. "cover" fills and crops overflow,
  // "contain" fits entirely (may letterbox). Crops are already aspect-correct,
  // so "cover" is the normal choice.
  fit: "cover" | "contain";
}

export interface GradientStop {
  offset: number; // 0..1
  color: string; // any CSS color, e.g. "rgba(0,0,0,0.7)"
}

export interface OverlaySpec {
  type: "linear";
  // direction of the gradient within its box, in degrees (0 = left→right,
  // 90 = top→bottom).
  angle: number;
  stops: GradientStop[];
  box: Box;
}

export interface HeadlineSpec {
  box: Box; // text area
  font: string; // CSS font-family
  weight?: number | string;
  sizePx: number; // starting size; auto-shrinks to fit the box
  minSizePx?: number; // lower bound when shrinking (default 24)
  color: string;
  // optional outline drawn behind the fill (for legibility over busy photos)
  strokeColor?: string;
  strokeWidthPx?: number;
  align: "left" | "center" | "right";
  // vertical anchoring of the text block within the box
  verticalAlign?: "top" | "middle" | "bottom";
  lineHeight: number; // multiple of font size, e.g. 1.1
  transform?: "uppercase" | "none";
  maxLines: number;
}

// Simple decorative shapes drawn from the PSD (brand color bars, accents).
export type Decoration =
  | { type: "rect"; box: Box; color: string }
  | {
      type: "gradientRect";
      box: Box;
      angle: number;
      stops: GradientStop[];
    };

export interface Layout {
  canvas: { width: number; height: number };
  // Decorations drawn *below* the photo (e.g. a full-bleed background color).
  background?: Decoration[];
  photo: PhotoSpec;
  // Decorations and scrim drawn *above* the photo but below the logo/text.
  overlay?: OverlaySpec;
  decorations?: Decoration[];
  logo: LogoSpec;
  headline: HeadlineSpec;
}

export interface StationTemplate {
  id: string; // e.g. "nbc-bayarea", "telemundo-48"
  name: string; // display name in the station picker
  network: "NBC" | "Telemundo";
  layouts: Record<Orientation, Layout>;
}
