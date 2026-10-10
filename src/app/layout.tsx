import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TimeAtmosphereProvider } from "@/components/sky/TimeAtmosphereContext";
import { LivingSkyBackground } from "@/components/sky/LivingSkyBackground";
import { ToastProvider } from "@/components/ui/Toast";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "The Living Sky — Personal Portfolio",
  description:
    "An award-level personal portfolio template that reacts dynamically to visitor local time.",
  keywords: [
    "Portfolio",
    "Creative Developer",
    "Product Designer",
    "WebGL",
    "Three.js",
    "Next.js",
  ],
  authors: [{ name: "The Living Sky" }],
  openGraph: {
    title: "The Living Sky — Personal Portfolio",
    description:
      "An award-level personal portfolio template reacting dynamically to visitor local time.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07090e] text-slate-100 antialiased selection:bg-teal-400 selection:text-slate-950 min-h-screen relative font-sans">
        <TimeAtmosphereProvider>
          <ToastProvider>
            <SmoothScrollProvider>
              <LivingSkyBackground />
              <CustomCursor />
              <div className="relative z-10 flex flex-col min-h-screen">
                {children}
              </div>
            </SmoothScrollProvider>
          </ToastProvider>
        </TimeAtmosphereProvider>
      </body>
    </html>
  );
}
