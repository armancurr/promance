import type { Metadata } from "next";
import { Funnel_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Promance - AI Prompt Enhancer",
  icons: {
    icon: "/promance.png",
    shortcut: "/promance.png",
  },
  description:
    "Promance is an AI prompt enhancer that helps you improve your prompts for AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${funnelSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-neutral-950`}
      >
        {children}
      </body>
    </html>
  );
}
