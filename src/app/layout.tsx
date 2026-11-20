import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arjun Mageswaran · AI/LLM Engineer",
  description:
    "Portfolio of Arjun Mageswaran, an AI/LLM engineer in Sydney building RAG systems, multi-agent LLM pipelines and cloud-native ML infrastructure.",
};

// Runs before first paint: play the intro once per session, never under reduced motion.
const introScript = `try{var s=sessionStorage.getItem("intro-seen"),m=matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.dataset.intro=s||m?"seen":"playing"}catch(e){document.documentElement.dataset.intro="seen"}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-screen overflow-x-clip font-sans">{children}</body>
    </html>
  );
}
