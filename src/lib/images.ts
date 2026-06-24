// Image loading + cropping helpers shared by the preview and export paths.

const cache = new Map<string, Promise<HTMLImageElement>>();

// Loads an image by URL, caching the promise so repeated renders don't reload.
export function loadImage(src: string): Promise<HTMLImageElement> {
  const existing = cache.get(src);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // Allow cross-origin assets to be drawn without tainting the canvas (so
    // toBlob/toDataURL keep working). Same-origin assets are unaffected.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
  cache.set(src, promise);
  return promise;
}

// Loads a user-selected File into an HTMLImageElement, returning the object URL
// alongside it. The URL is kept alive (the cropper reuses it); the caller is
// responsible for revoking it when the image is replaced.
export function loadImageFromFile(
  file: File,
): Promise<{ image: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ image: img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load uploaded image"));
    };
    img.src = url;
  });
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Crops the given source image to `area` (pixel coordinates in the source) and
// returns a canvas containing exactly that region. The canvas can be drawn by
// the renderer like any other image source.
export function cropToCanvas(
  image: HTMLImageElement,
  area: CropArea,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width));
  canvas.height = Math.max(1, Math.round(area.height));
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(
      image,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }
  return canvas;
}
