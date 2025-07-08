import type { Metadata } from "next";
import { Funnel_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promance - AI Prompt Enhancer",
  icons: {
    icon: "/promanc.png",
    shortcut: "/promanc.png",
    apple: "/promanc.png",
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
        className={`${funnelSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}
      >
        {children}
      </body>
    </html>
  );
}
