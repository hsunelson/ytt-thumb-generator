import type { Layout } from "@/templates/types";
import { renderThumbnail, type RenderInputs } from "./renderThumbnail";

// Renders a layout to a fresh, full-resolution offscreen canvas. Used both for
// the export download and the high-fidelity preview modal.
export function renderToCanvas(
  layout: Layout,
  inputs: RenderInputs,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = layout.canvas.width;
  canvas.height = layout.canvas.height;
  const ctx = canvas.getContext("2d");
  if (ctx) renderThumbnail(ctx, layout, inputs);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export canvas to PNG"));
    }, "image/png");
  });
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Renders the layout and downloads it as a PNG.
export async function downloadThumbnail(
  layout: Layout,
  inputs: RenderInputs,
  filename: string,
): Promise<void> {
  const canvas = renderToCanvas(layout, inputs);
  const blob = await canvasToBlob(canvas);
  triggerDownload(blob, filename);
}
