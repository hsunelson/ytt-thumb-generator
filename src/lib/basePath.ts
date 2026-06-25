// Base path the app is served under (e.g. "/ytt-thumb-generator" on a GitHub
// Pages project site, "" for local dev / root-served hosts). Set at build time
// via NEXT_PUBLIC_BASE_PATH and exposed through next.config.js `env`.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Prefix an absolute ("/…") asset URL with the base path. Non-absolute URLs
// (object URLs, data URLs) are returned unchanged.
export function withBasePath(p: string): string {
  return p.startsWith("/") ? BASE_PATH + p : p;
}
