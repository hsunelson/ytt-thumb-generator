"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/basePath";

// Brand fonts, loaded at runtime via the FontFace API (instead of a static
// @font-face) so the woff URLs respect the base path when the app is served
// under a subpath (GitHub Pages). The family names are stable and match the
// strings used by the Canvas renderer in the station templates.
const FONTS: { family: string; file: string }[] = [
  { family: "Arthouse Owned Bold", file: "ArthouseOwnedBold.woff" },
  { family: "Arthouse Owned Condensed Medium", file: "ArthouseOwnedCondensedMedium.woff" },
];

export default function FontLoader() {
  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) return;
    for (const { family, file } of FONTS) {
      const url = withBasePath(`/fonts/${file}`);
      const face = new FontFace(family, `url(${url}) format("woff")`);
      face
        .load()
        .then((loaded) => document.fonts.add(loaded))
        .catch(() => {
          /* leave canvas to fall back to a system font */
        });
    }
  }, []);

  return null;
}
