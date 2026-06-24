"use client";

import { useRef } from "react";
import type { Orientation } from "@/templates/types";
import { ORIENTATIONS } from "@/templates/types";

interface PhotoUploaderProps {
  hasImage: boolean;
  cropDone: Record<Orientation, boolean>;
  onFile: (file: File) => void;
  onEditCrop: (o: Orientation) => void;
}

// Handles uploading a single background photo, then exposes a per-orientation
// crop button so the user sets an independent 16:9 and 9:16 crop of that image.
export default function PhotoUploader({
  hasImage,
  cropDone,
  onFile,
  onEditCrop,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-neutral-300">
        Background photo
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full rounded border border-dashed border-neutral-600 bg-neutral-900 px-3 py-3 text-sm text-neutral-300 hover:border-blue-500"
      >
        {hasImage ? "Replace photo…" : "Upload photo…"}
      </button>

      {hasImage && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ORIENTATIONS.map((o) => (
            <button
              key={o}
              onClick={() => onEditCrop(o)}
              className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs hover:border-blue-500"
            >
              <span className="capitalize">{o}</span> crop
              <span className={cropDone[o] ? "text-green-400" : "text-amber-400"}>
                {cropDone[o] ? " ✓" : " • set"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
