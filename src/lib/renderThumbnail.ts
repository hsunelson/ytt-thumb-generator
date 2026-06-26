import type {
  Box,
  Decoration,
  GradientStop,
  HeadlineSpec,
  Layout,
  OverlaySpec,
} from "@/templates/types";

export interface RenderInputs {
  // The background photo, already cropped to the orientation's aspect ratio.
  photo: CanvasImageSource | null;
  // The station logo image (loaded).
  logo: CanvasImageSource | null;
  headline: string;
  // Other loaded images referenced by the layout (e.g. headline accent
  // patterns), keyed by their src URL.
  images?: Record<string, CanvasImageSource>;
}

// Paints a complete thumbnail for one orientation onto `ctx`. This is the
// single source of truth for both the on-screen preview and the exported PNG,
// guaranteeing WYSIWYG. The caller sizes the canvas to layout.canvas first.
export function renderThumbnail(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  inputs: RenderInputs,
): void {
  const { width, height } = layout.canvas;

  ctx.clearRect(0, 0, width, height);
  // Neutral base so transparent areas aren't left blank.
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // 1. Background decorations (below the photo).
  layout.background?.forEach((d) => drawDecoration(ctx, d));

  // 2. Photo.
  if (inputs.photo) {
    drawImageInBox(ctx, inputs.photo, layout.photo, layout.photo.fit);
  }

  // 3. Overlay scrim (gradient for text legibility).
  if (layout.overlay) {
    drawOverlay(ctx, layout.overlay);
  }

  // 4. Foreground decorations (brand bars/accents).
  layout.decorations?.forEach((d) => drawDecoration(ctx, d));

  // 5. Logo.
  if (inputs.logo) {
    drawLogo(ctx, inputs.logo, layout.logo);
  }

  // 6. Headline.
  const text = (inputs.headline ?? "").trim();
  if (text) {
    drawHeadline(ctx, layout.headline, text, inputs.images);
  }
}

function drawImageInBox(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  box: Box,
  fit: "cover" | "contain",
): void {
  const iw = imgWidth(img);
  const ih = imgHeight(img);
  if (!iw || !ih) return;

  const scale =
    fit === "cover"
      ? Math.max(box.width / iw, box.height / ih)
      : Math.min(box.width / iw, box.height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = box.x + (box.width - dw) / 2;
  const dy = box.y + (box.height - dh) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  spec: { x: number; y: number; width: number; height?: number },
): void {
  const iw = imgWidth(img);
  const ih = imgHeight(img);
  const w = spec.width;
  const h = spec.height ?? (ih && iw ? (ih / iw) * w : w);
  ctx.drawImage(img, spec.x, spec.y, w, h);
}

function drawOverlay(ctx: CanvasRenderingContext2D, overlay: OverlaySpec): void {
  const grad = makeGradient(ctx, overlay.box, overlay.angle, overlay.stops);
  ctx.fillStyle = grad;
  ctx.fillRect(overlay.box.x, overlay.box.y, overlay.box.width, overlay.box.height);
}

function drawDecoration(ctx: CanvasRenderingContext2D, d: Decoration): void {
  if (d.type === "rect") {
    ctx.fillStyle = d.color;
    ctx.fillRect(d.box.x, d.box.y, d.box.width, d.box.height);
  } else {
    const grad = makeGradient(ctx, d.box, d.angle, d.stops);
    ctx.fillStyle = grad;
    ctx.fillRect(d.box.x, d.box.y, d.box.width, d.box.height);
  }
}

function makeGradient(
  ctx: CanvasRenderingContext2D,
  box: Box,
  angleDeg: number,
  stops: GradientStop[],
): CanvasGradient {
  // angle 0 = left→right, 90 = top→bottom.
  const rad = (angleDeg * Math.PI) / 180;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const hx = (Math.cos(rad) * box.width) / 2;
  const hy = (Math.sin(rad) * box.height) / 2;
  const grad = ctx.createLinearGradient(cx - hx, cy - hy, cx + hx, cy + hy);
  stops.forEach((s) => grad.addColorStop(clamp01(s.offset), s.color));
  return grad;
}

// Draws the headline: applies transform, finds the largest font size at which
// the wrapped text fits within the box and maxLines, then paints it. Optionally
// draws a solid block behind each line (`spec.highlight`) and image patches
// anchored to the text-block corners (`spec.accents`).
function drawHeadline(
  ctx: CanvasRenderingContext2D,
  spec: HeadlineSpec,
  raw: string,
  images?: Record<string, CanvasImageSource>,
): void {
  const text = spec.transform === "uppercase" ? raw.toUpperCase() : raw;
  const minSize = spec.minSizePx ?? 24;
  const weight = spec.weight ?? "normal";

  // Highlight padding and inter-line gap (all 0 when no highlight, which makes
  // the geometry below reduce to plain line stacking).
  const hl = spec.highlight;
  const padX = hl?.padX ?? 0;
  const padY = hl?.padY ?? 0;
  const gap = hl?.lineGap ?? 0;
  // "block" mode wraps the whole text block in one (rounded) box, so padding is
  // applied once around the outside; "per-line" pads each line's block.
  const blockMode = hl?.mode === "block";

  // Total height of the highlighted text stack at a given line height.
  const stackHeight = (lineHeightPx: number, n: number) =>
    blockMode
      ? n * lineHeightPx + Math.max(0, n - 1) * gap + 2 * padY
      : n * (lineHeightPx + 2 * padY) + Math.max(0, n - 1) * gap;

  let size = spec.sizePx;
  let lines: string[] = [];

  for (; size >= minSize; size -= 2) {
    ctx.font = `${weight} ${size}px ${spec.font}`;
    const wrapped = wrapText(ctx, text, spec.box.width);
    const fits =
      wrapped.length <= spec.maxLines &&
      stackHeight(size * spec.lineHeight, wrapped.length) <= spec.box.height &&
      wrapped.every((l) => ctx.measureText(l).width <= spec.box.width);
    if (fits) {
      lines = wrapped;
      break;
    }
    lines = wrapped; // keep last attempt as fallback
  }

  ctx.font = `${weight} ${Math.max(size, minSize)}px ${spec.font}`;
  // If even minSize overflows maxLines, truncate with an ellipsis on the last line.
  if (lines.length > spec.maxLines) {
    lines = truncateToLines(ctx, lines, spec.maxLines, spec.box.width);
  }

  const lineHeightPx = Math.max(size, minSize) * spec.lineHeight;
  const blockH = lineHeightPx + 2 * padY; // height of one line's block
  const stackH = stackHeight(lineHeightPx, lines.length);

  let startY: number; // top of the first block
  switch (spec.verticalAlign ?? "top") {
    case "middle":
      startY = spec.box.y + (spec.box.height - stackH) / 2;
      break;
    case "bottom":
      startY = spec.box.y + spec.box.height - stackH;
      break;
    default:
      startY = spec.box.y;
  }

  ctx.textBaseline = "top";
  ctx.textAlign = spec.align;

  const anchorX =
    spec.align === "left"
      ? spec.box.x
      : spec.align === "right"
        ? spec.box.x + spec.box.width
        : spec.box.x + spec.box.width / 2;

  // Per-line geometry. In per-line mode each line advances by its own padded
  // block height; in block mode (single outer box) lines are spaced tightly.
  // `blockTop` is this line's block top (per-line mode); text sits inset by padY.
  const lineAdvance = (blockMode ? lineHeightPx : blockH) + gap;
  const lineInfos = lines.map((line, i) => {
    const textWidth = ctx.measureText(line).width;
    const left =
      spec.align === "right"
        ? spec.box.x + spec.box.width - textWidth
        : spec.align === "center"
          ? spec.box.x + (spec.box.width - textWidth) / 2
          : spec.box.x;
    const blockTop = startY + i * lineAdvance;
    return { line, textWidth, left, blockTop, top: blockTop + padY };
  });

  // Corner accents (drawn first, behind everything). Anchored to the first
  // line block's top-left and the last line block's bottom-right corner.
  if (spec.accents && lineInfos.length > 0 && images) {
    const first = lineInfos[0];
    const last = lineInfos[lineInfos.length - 1];
    for (const a of spec.accents) {
      const img = images[a.src];
      if (!img) continue;
      if (a.corner === "tl") {
        const cornerX = first.left - padX;
        const cornerY = first.blockTop;
        drawImageInBox(
          ctx,
          img,
          {
            x: cornerX - a.stickX,
            y: cornerY - a.stickY,
            width: a.width,
            height: a.height,
          },
          "cover",
        );
      } else {
        const cornerX = last.left + last.textWidth + padX;
        const cornerY = last.blockTop + blockH;
        drawImageInBox(
          ctx,
          img,
          {
            x: cornerX + a.stickX - a.width,
            y: cornerY + a.stickY - a.height,
            width: a.width,
            height: a.height,
          },
          "cover",
        );
      }
    }
  }

  // Highlight (drawn over the accents, behind the text).
  if (hl && lineInfos.length > 0) {
    ctx.fillStyle = hl.color;
    if (blockMode) {
      // One (optionally rounded) box around the whole text block.
      const left = Math.min(...lineInfos.map((i) => i.left)) - padX;
      const right = Math.max(...lineInfos.map((i) => i.left + i.textWidth)) + padX;
      fillRect(ctx, left, startY, right - left, stackH, hl.radius ?? 0);
    } else {
      for (const info of lineInfos) {
        fillRect(ctx, info.left - padX, info.blockTop, info.textWidth + padX * 2, blockH, 0);
      }
    }
  }

  // Text.
  ctx.fillStyle = spec.color;
  const hasStroke = spec.strokeColor && (spec.strokeWidthPx ?? 0) > 0;
  if (hasStroke) {
    ctx.strokeStyle = spec.strokeColor as string;
    ctx.lineWidth = spec.strokeWidthPx as number;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
  }

  lineInfos.forEach((info) => {
    if (hasStroke) ctx.strokeText(info.line, anchorX, info.top);
    ctx.fillText(info.line, anchorX, info.top);
  });
}

// Fills a rectangle, with rounded corners when radius > 0. Uses the current
// fillStyle.
function fillRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): void {
  if (radius <= 0) {
    ctx.fillRect(x, y, w, h);
    return;
  }
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

// Greedy word-wrap to a max pixel width. Words longer than the width are
// hard-broken by character so they never overflow.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
      current = "";
    }
    if (ctx.measureText(word).width <= maxWidth) {
      current = word;
    } else {
      // Hard-break an over-long single word.
      let chunk = "";
      for (const ch of word) {
        if (ctx.measureText(chunk + ch).width <= maxWidth) {
          chunk += ch;
        } else {
          if (chunk) lines.push(chunk);
          chunk = ch;
        }
      }
      current = chunk;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function truncateToLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxLines: number,
  maxWidth: number,
): string[] {
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1] ?? "";
  const ellipsis = "…";
  while (last && ctx.measureText(last + ellipsis).width > maxWidth) {
    last = last.slice(0, -1).trimEnd();
  }
  kept[maxLines - 1] = last + ellipsis;
  return kept;
}

function imgWidth(img: CanvasImageSource): number {
  if (img instanceof HTMLImageElement) return img.naturalWidth || img.width;
  if (typeof HTMLCanvasElement !== "undefined" && img instanceof HTMLCanvasElement)
    return img.width;
  if (typeof ImageBitmap !== "undefined" && img instanceof ImageBitmap)
    return img.width;
  // @ts-expect-error best-effort for other sources
  return img.width ?? 0;
}

function imgHeight(img: CanvasImageSource): number {
  if (img instanceof HTMLImageElement) return img.naturalHeight || img.height;
  if (typeof HTMLCanvasElement !== "undefined" && img instanceof HTMLCanvasElement)
    return img.height;
  if (typeof ImageBitmap !== "undefined" && img instanceof ImageBitmap)
    return img.height;
  // @ts-expect-error best-effort for other sources
  return img.height ?? 0;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
