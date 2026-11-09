import { NextResponse } from "next/server";
import { site } from "@/lib/site";

const FIELDS = ["name", "phone", "email", "address", "service", "message", "page", "landing_page", "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // Honeypot: pretend success for bots.
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const lead: Record<string, string> = {};
  for (const f of FIELDS) lead[f] = clean(body[f]);
  if (!lead.name || !lead.phone || lead.phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Name and a valid phone are required." }, { status: 422 });
  }

  const tasks: Promise<unknown>[] = [];
  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, LEAD_WEBHOOK_URL } = process.env;

  if (RESEND_API_KEY && LEAD_TO_EMAIL) {
    const rows = Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join("");
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: LEAD_FROM_EMAIL || `Website Leads <leads@${new URL(site.url).hostname.replace(/^www\./, "")}>`,
          to: LEAD_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: lead.email || undefined,
          subject: `New appraisal lead: ${lead.service || "General"} — ${lead.name}`,
          html: `<h2>New quote request</h2><table>${rows}</table>`,
        }),
      }).then((r) => { if (!r.ok) throw new Error(`resend ${r.status}`); }),
    );
  }
  if (LEAD_WEBHOOK_URL) {
    tasks.push(
      fetch(LEAD_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, received_at: new Date().toISOString() }) }).then((r) => {
        if (!r.ok) throw new Error(`webhook ${r.status}`);
      }),
    );
  }

  if (!tasks.length) {
    console.warn("[lead] No delivery configured (set RESEND_API_KEY/LEAD_TO_EMAIL or LEAD_WEBHOOK_URL). Lead:", lead);
    return NextResponse.json({ ok: true, delivered: false });
  }
  const results = await Promise.allSettled(tasks);
  if (results.every((r) => r.status === "rejected")) {
    console.error("[lead] delivery failed", results);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
