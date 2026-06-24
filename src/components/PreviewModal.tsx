"use client";

import type { Orientation, StationTemplate } from "@/templates/types";
import { ORIENTATIONS } from "@/templates/types";
import type { RenderInputs } from "@/lib/renderThumbnail";
import ThumbnailCanvas from "./ThumbnailCanvas";

interface PreviewModalProps {
  station: StationTemplate;
  inputsFor: (o: Orientation) => RenderInputs;
  onBack: () => void;
  onDownload: (o: Orientation) => void;
  onDownloadBoth: () => void;
}

// Review step shown before download. Renders both orientations at full fidelity
// using the same render path as export, so the user confirms exactly what they
// will get and can go back to adjust.
export default function PreviewModal({
  station,
  inputsFor,
  onBack,
  onDownload,
  onDownloadBoth,
}: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/95 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Preview &amp; download</h2>
          <button
            onClick={onBack}
            className="rounded border border-neutral-600 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            ← Back to edit
          </button>
        </div>

        <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
          {ORIENTATIONS.map((o) => (
            <div key={o} className="flex flex-col gap-3">
              <div className="text-sm font-medium capitalize text-neutral-300">
                {o}{" "}
                <span className="text-neutral-500">
                  ({station.layouts[o].canvas.width}×{station.layouts[o].canvas.height})
                </span>
              </div>
              <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-900">
                <ThumbnailCanvas layout={station.layouts[o]} inputs={inputsFor(o)} />
              </div>
              <button
                onClick={() => onDownload(o)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Download {o}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onDownloadBoth}
            className="rounded bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-500"
          >
            Download both
          </button>
        </div>
      </div>
    </div>
  );
}
