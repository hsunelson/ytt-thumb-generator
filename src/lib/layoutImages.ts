import type { Layout } from "@/templates/types";

// Returns every image URL a layout needs loaded: the logo plus any headline
// accent patterns. The app loads these so the renderer can look them up.
export function collectImageSrcs(layout: Layout): string[] {
  const srcs = [layout.logo.src];
  for (const a of layout.headline.accents ?? []) {
    srcs.push(a.src);
  }
  return Array.from(new Set(srcs));
}
