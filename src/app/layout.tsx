import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAUL — Heavy Asset Utilization & Logistics",
  description: "Internal equipment catalog and request management for Sundt Equipment Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
