import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} (${site.brand})`,
    short_name: "Value Trust",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#161616",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
