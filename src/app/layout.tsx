import type { Metadata } from "next";
import "./globals.css";
import FontLoader from "@/components/FontLoader";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Generator",
  description:
    "Create on-brand YouTube thumbnails for NBC Local and Telemundo stations.",
  // Internal tool — keep it out of search engine indexes.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <FontLoader />
        {children}
      </body>
    </html>
  );
}
