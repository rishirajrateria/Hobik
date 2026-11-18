import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: Certified Home Appraisals in Toronto & the GTA`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ffffff", color: "#15181d", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, borderBottom: "2px solid #15181d", paddingBottom: 24 }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none" stroke="#15181d" strokeWidth="1.8"><path d="M5 15 16 5l11 10" /><path d="M8 13v14h16V13" /><path d="M13 27v-7h6v7" /><path d="M3 29h26" stroke="#205c44" strokeWidth="2.4" /></svg>
          <div style={{ fontSize: 34 }}>Home Value</div>
          <div style={{ fontSize: 18, letterSpacing: 4, color: "#4a505b", fontFamily: "sans-serif", marginLeft: 8 }}>APPRAISERS · TORONTO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, lineHeight: 1.05 }}>Certified home appraisals</div>
          <div style={{ fontSize: 80, lineHeight: 1.05, color: "#205c44" }}>in Toronto and the GTA</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontFamily: "sans-serif", color: "#4a505b" }}>
          <span>Mortgage · Estate · Divorce · CRA · MPAC</span>
          <span style={{ color: "#15181d", fontWeight: 700 }}>{site.phone}</span>
        </div>
      </div>
    ),
    size,
  );
}
