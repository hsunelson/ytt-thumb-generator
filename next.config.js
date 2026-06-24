/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the whole app is a folder of static files we can sync to S3.
  output: "export",
  // next/image optimization needs a server; disable it for static hosting.
  images: { unoptimized: true },
  // Emit URLs as /path/ so S3 static website hosting resolves them to index.html.
  trailingSlash: true,
};

module.exports = nextConfig;
