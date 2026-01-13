import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const openRunde = localFont({
  src: [
    {
      path: "../public/fonts/OpenRunde-Regular-BF64ee9c627e5b6.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Medium-BF64ee9c62ad3ad.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Semibold-BF64ee9c629e0a5.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Bold-BF64ee9c62a2035.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
});

export const metadata: Metadata = {
  title: "Ponderdome",
  description: "The arena for your deepest distractions.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openRunde.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: { boxShadow: "none" },
          }}
        />
      </body>
    </html>
  );
}
