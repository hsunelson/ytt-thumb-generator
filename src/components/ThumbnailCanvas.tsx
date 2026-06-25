"use client";

import { useEffect, useRef } from "react";
import type { Layout } from "@/templates/types";
import { renderThumbnail, type RenderInputs } from "@/lib/renderThumbnail";

interface ThumbnailCanvasProps {
  layout: Layout;
  inputs: RenderInputs;
  className?: string;
}

// Live preview canvas. Renders at the layout's full resolution and is scaled
// down by CSS, so it shares the exact render path used for export (WYSIWYG).
export default function ThumbnailCanvas({
  layout,
  inputs,
  className,
}: ThumbnailCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;

    const paint = () => {
      if (cancelled) return;
      canvas.width = layout.canvas.width;
      canvas.height = layout.canvas.height;
      const ctx = canvas.getContext("2d");
      if (ctx) renderThumbnail(ctx, layout, inputs);
    };

    paint();
    // Web fonts (e.g. station brand fonts) may still be loading on first paint;
    // repaint once they're ready so the canvas uses the correct typeface.
    if (typeof document !== "undefined" && document.fonts) {
      const family = layout.headline.font;
      document.fonts.load(`1em ${family}`).catch(() => {});
      document.fonts.ready.then(paint).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [layout, inputs]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}
