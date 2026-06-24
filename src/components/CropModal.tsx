"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import type { Orientation } from "@/templates/types";
import { ASPECT } from "@/templates/types";
import type { CropArea } from "@/lib/images";

interface CropModalProps {
  imageUrl: string;
  orientation: Orientation;
  // Existing crop to resume editing, if any.
  initialCrop?: { crop: { x: number; y: number }; zoom: number };
  onCancel: () => void;
  onApply: (area: CropArea, view: { crop: { x: number; y: number }; zoom: number }) => void;
}

// Aspect-ratio-locked crop step (one per orientation) built on react-easy-crop.
export default function CropModal({
  imageUrl,
  orientation,
  initialCrop,
  onCancel,
  onApply,
}: CropModalProps) {
  const [crop, setCrop] = useState(initialCrop?.crop ?? { x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialCrop?.zoom ?? 1);
  const [areaPixels, setAreaPixels] = useState<CropArea | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setAreaPixels(areaPx);
  }, []);

  const aspectLabel = orientation === "horizontal" ? "16:9" : "9:16";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold">
          Crop for {orientation} <span className="text-neutral-400">({aspectLabel})</span>
        </h2>
        <button
          onClick={onCancel}
          className="rounded px-3 py-1 text-sm text-neutral-300 hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>

      <div className="relative flex-1">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={ASPECT[orientation]}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="contain"
        />
      </div>

      <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-3 text-sm">
          <span className="text-neutral-400">Zoom</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <button
          onClick={() => areaPixels && onApply(areaPixels, { crop, zoom })}
          disabled={!areaPixels}
          className="rounded bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Apply crop
        </button>
      </div>
    </div>
  );
}
