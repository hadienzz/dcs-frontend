import type React from "react";
import { Agentation } from "agentation";
import type { Metadata } from "next";
import { Inter, Poppins, Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SDG's  Telkom University",
  description: "Sustainable Development Goals at Telkom University",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${GeistSans.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        <Agentation />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
