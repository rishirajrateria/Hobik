import type { NextConfig } from "next";

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Preserve equity from the legacy PHP site's URLs.
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/rates-and-services.php", destination: "/pricing", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      { source: "/contact-us.php", destination: "/contact", permanent: true },
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/about-us.php", destination: "/about", permanent: true },
      { source: "/services.php", destination: "/services", permanent: true },
      { source: "/faq.php", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
