import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Certified Home Appraisals in Toronto & the GTA`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#050d1f 0%,#102a52 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "#fcc75a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#050d1f", fontWeight: 800 }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#050d1f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 800 }}>Home Value Inc.</div>
            <div style={{ fontSize: 20, color: "#ffd98a", letterSpacing: 4 }}>APPRAISALS · TORONTO</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Certified Home Appraisals</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#fcc75a" }}>Toronto &amp; the GTA</div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 28, color: "#e6ecf6" }}>
          <span>Mortgage · Estate · Divorce · CRA · MPAC</span>
          <span style={{ color: "#3ee0b5", fontWeight: 700 }}>{site.phone}</span>
        </div>
      </div>
    ),
    size,
  );
}
