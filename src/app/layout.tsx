import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "healthydates.in | Premium Dry Fruits Store",
  description: "Shop premium quality dates, nuts, and dry fruits online at healthydates.in. High-quality, hand-picked goodness delivered to your doorstep.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

import { BfcacheHandler } from "@/components/shared/BfcacheHandler";
import ScrollToTop from "@/components/shared/ScrollToTop";

import { CategoryProvider } from "@/context/CategoryContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${outfit.variable} font-sans antialiased`}>
        <CategoryProvider>
          <BfcacheHandler />
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          {children}
          <Toaster position="top-center" richColors />
        </CategoryProvider>
      </body>
    </html>
  );
}
