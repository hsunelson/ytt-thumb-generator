/** @type {import('next').NextConfig} */

// Base path for hosting under a subpath (GitHub Pages project site lives at
// /ytt-thumb-generator/). Empty for local dev and root-served hosts (S3,
// custom domain). The GitHub Pages workflow sets NEXT_PUBLIC_BASE_PATH.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  // Static export so the whole app is a folder of static files (S3 or Pages).
  output: "export",
  // next/image optimization needs a server; disable it for static hosting.
  images: { unoptimized: true },
  // Emit URLs as /path/ so static hosts resolve them to index.html.
  trailingSlash: true,
  // Prefix routes + built assets when served under a subpath.
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Expose the base path to client code (for raw asset URLs we load ourselves).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

module.exports = nextConfig;
