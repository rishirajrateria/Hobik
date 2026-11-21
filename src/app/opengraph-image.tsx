import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: real estate appraisal and advisory in Southern Ontario`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/value-trust-logo.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ffffff", color: "#161616", fontFamily: "sans-serif" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={442} height={170} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 66, lineHeight: 1.08 }}>Real estate appraisal &amp; advisory</div>
          <div style={{ fontSize: 66, lineHeight: 1.08, color: "#94661a" }}>GTHA + Southern Ontario</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "6px solid #e8a941", paddingTop: 22, fontSize: 25, fontFamily: "sans-serif", color: "#555555" }}>
          <span>Residential · Commercial · Industrial · Agricultural · Institutional</span>
          <span style={{ color: "#161616", fontWeight: 700 }}>{site.phone}</span>
        </div>
      </div>
    ),
    size,
  );
}
