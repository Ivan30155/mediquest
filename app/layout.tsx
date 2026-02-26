import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MediQuest - Emergency Response & Medical Training",
  description:
    "Professional emergency response guidance with AI-guided CPR instructions and medical simulation training.",

  manifest: "/manifest.json",

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },

  icons: {
    icon: [
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/icon-192.png",
  },

  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: "smooth" }}>
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] text-[#F5F5F5] min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}