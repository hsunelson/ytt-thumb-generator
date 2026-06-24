"use client";

import { useEffect, useMemo, useState } from "react";
import StationPicker from "@/components/StationPicker";
import PhotoUploader from "@/components/PhotoUploader";
import ThumbnailCanvas from "@/components/ThumbnailCanvas";
import CropModal from "@/components/CropModal";
import PreviewModal from "@/components/PreviewModal";
import { STATIONS, getStation } from "@/templates";
import type { Orientation } from "@/templates/types";
import { ASPECT, ORIENTATIONS } from "@/templates/types";
import {
  cropToCanvas,
  loadImage,
  loadImageFromFile,
  type CropArea,
} from "@/lib/images";
import type { RenderInputs } from "@/lib/renderThumbnail";
import { downloadThumbnail } from "@/lib/exportPng";

type CropView = { crop: { x: number; y: number }; zoom: number };
type PerOrientation<T> = Record<Orientation, T>;

const emptyByOrientation = <T,>(value: T): PerOrientation<T> => ({
  horizontal: value,
  vertical: value,
});

// Largest centered crop of `image` matching the target aspect (width / height).
function defaultCropArea(
  image: HTMLImageElement,
  aspect: number,
): CropArea {
  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  let width = iw;
  let height = iw / aspect;
  if (height > ih) {
    height = ih;
    width = ih * aspect;
  }
  return { x: (iw - width) / 2, y: (ih - height) / 2, width, height };
}

export default function Home() {
  const [stationId, setStationId] = useState(STATIONS[0].id);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [headline, setHeadline] = useState("Breaking news headline goes here");

  const [source, setSource] = useState<{ url: string; image: HTMLImageElement } | null>(
    null,
  );
  const [crops, setCrops] = useState<PerOrientation<HTMLCanvasElement | null>>(
    emptyByOrientation<HTMLCanvasElement | null>(null),
  );
  const [cropViews, setCropViews] = useState<PerOrientation<CropView | undefined>>(
    emptyByOrientation<CropView | undefined>(undefined),
  );
  const [cropping, setCropping] = useState<Orientation | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [logos, setLogos] = useState<Record<string, HTMLImageElement>>({});

  const station = getStation(stationId)!;

  // Load the logo(s) referenced by the current station's layouts.
  useEffect(() => {
    const srcs = Array.from(
      new Set(ORIENTATIONS.map((o) => station.layouts[o].logo.src)),
    );
    srcs.forEach((src) => {
      if (logos[src]) return;
      loadImage(src)
        .then((img) => setLogos((prev) => ({ ...prev, [src]: img })))
        .catch(() => {});
    });
  }, [station, logos]);

  function handleFile(file: File) {
    loadImageFromFile(file).then(({ image, url }) => {
      // Release the previous photo's object URL, if any.
      if (source) URL.revokeObjectURL(source.url);
      setSource({ url, image });
      // Seed a default centered crop for each orientation so previews are
      // populated immediately; the user can refine each.
      setCrops({
        horizontal: cropToCanvas(image, defaultCropArea(image, ASPECT.horizontal)),
        vertical: cropToCanvas(image, defaultCropArea(image, ASPECT.vertical)),
      });
      setCropViews(emptyByOrientation<CropView | undefined>(undefined));
      setCropping(orientation);
    });
  }

  function applyCrop(o: Orientation, area: CropArea, view: CropView) {
    if (!source) return;
    setCrops((prev) => ({ ...prev, [o]: cropToCanvas(source.image, area) }));
    setCropViews((prev) => ({ ...prev, [o]: view }));
    setCropping(null);
  }

  const inputsFor = useMemo(() => {
    return (o: Orientation): RenderInputs => ({
      photo: crops[o],
      logo: logos[station.layouts[o].logo.src] ?? null,
      headline,
    });
  }, [crops, logos, station, headline]);

  async function download(o: Orientation) {
    const layout = station.layouts[o];
    await downloadThumbnail(
      layout,
      inputsFor(o),
      `${station.id}-${o}-${layout.canvas.width}x${layout.canvas.height}.png`,
    );
  }

  async function downloadBoth() {
    for (const o of ORIENTATIONS) {
      await download(o);
    }
  }

  const cropDone: PerOrientation<boolean> = {
    horizontal: !!cropViews.horizontal,
    vertical: !!cropViews.vertical,
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">YouTube Thumbnail Generator</h1>
        <p className="text-sm text-neutral-400">
          NBC Local &amp; Telemundo stations — build on-brand thumbnails in seconds.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Controls */}
        <div className="flex flex-col gap-5">
          <StationPicker value={stationId} onChange={setStationId} />

          <div>
            <span className="mb-1 block text-sm font-medium text-neutral-300">
              Orientation
            </span>
            <div className="flex overflow-hidden rounded border border-neutral-700">
              {ORIENTATIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  className={`flex-1 px-3 py-2 text-sm capitalize ${
                    orientation === o
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <PhotoUploader
            hasImage={!!source}
            cropDone={cropDone}
            onFile={handleFile}
            onEditCrop={(o) => {
              setOrientation(o);
              setCropping(o);
            }}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-neutral-300">
              Headline
            </span>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              rows={3}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Type the headline…"
            />
          </label>

          <button
            onClick={() => setShowPreview(true)}
            className="rounded bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Preview &amp; download
          </button>
        </div>

        {/* Live preview */}
        <div>
          <div className="mb-2 text-sm text-neutral-400">
            Live preview — <span className="capitalize">{orientation}</span>
          </div>
          <div
            className="mx-auto overflow-hidden rounded border border-neutral-800 bg-neutral-900"
            style={{ maxWidth: orientation === "horizontal" ? 720 : 360 }}
          >
            <ThumbnailCanvas
              layout={station.layouts[orientation]}
              inputs={inputsFor(orientation)}
            />
          </div>
        </div>
      </div>

      {cropping && source && (
        <CropModal
          imageUrl={source.url}
          orientation={cropping}
          initialCrop={cropViews[cropping]}
          onCancel={() => setCropping(null)}
          onApply={(area, view) => applyCrop(cropping, area, view)}
        />
      )}

      {showPreview && (
        <PreviewModal
          station={station}
          inputsFor={inputsFor}
          onBack={() => setShowPreview(false)}
          onDownload={download}
          onDownloadBoth={downloadBoth}
        />
      )}
    </main>
  );
}
