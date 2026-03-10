/**
 * Local font configuration for China-safe deployment
 * No external CDN requests - all fonts self-hosted
 */

import localFont from "next/font/local";

/**
 * Geist Sans - Primary UI font
 * Fallback: China-optimized system font stack
 */
export const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  // China-specific system font fallback stack
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "sans-serif",
  ],
  display: "swap",
  preload: true,
});

/**
 * Geist Mono - Monospace font for code
 * Fallback: China-optimized monospace font stack
 */
export const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GeistMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GeistMono-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/GeistMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  // China-specific monospace fallback
  fallback: ["Menlo", "Monaco", "Courier New", "monospace"],
  display: "swap",
  preload: true,
});
