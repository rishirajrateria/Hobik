import type { Metadata, Viewport } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { indexable, site } from "@/lib/site";

const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans-src", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif-src", style: ["normal", "italic"], axes: ["opsz"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Home Appraisal Toronto | Certified Appraisers | Home Value Inc.",
    template: "%s | Home Value Inc.",
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Real Estate Appraisal",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: { type: "website", locale: "en_CA", siteName: site.brand, url: "/" },
  twitter: { card: "summary_large_image" },
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Toronto",
    "geo.position": `${site.geo.lat};${site.geo.lng}`,
    ICBM: `${site.geo.lat}, ${site.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary" />
        {/* Enable scroll-reveal before first paint; auto-disable if JS never boots. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},3500)})(document.documentElement)`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
