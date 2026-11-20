import type { NextConfig } from "next";
import { legacyServiceRedirects } from "./src/lib/services";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: { formats: ["image/avif", "image/webp"] },
  serverExternalPackages: ["pg"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // URLs from the client's previous Squarespace site, and renamed service pages.
    return [
      { source: "/faqs-4", destination: "/faq", permanent: true },
      { source: "/coverage-area", destination: "/areas", permanent: true },
      { source: "/appointments", destination: "/book-appraisal", permanent: true },
      { source: "/our-team", destination: "/team", permanent: true },
      ...Object.entries(legacyServiceRedirects).map(([from, to]) => ({ source: `/services/${from}`, destination: `/services/${to}`, permanent: true })),
    ];
  },
};

export default nextConfig;
