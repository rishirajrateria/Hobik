import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { forms, leadActivity, leads } from "@/db/schema";
import { defaultBookingForm, defaultQuoteForm } from "@/lib/defaultForms";
import { geoFromHeaders, sourceOf } from "@/lib/geo";
import { site } from "@/lib/site";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (str(body.company)) return NextResponse.json({ ok: true }); // honeypot

  const slug = str(body.form, 80) || "quote";
  let form: { id: string | null; name: string; fields: typeof defaultQuoteForm.fields } | undefined;
  try {
    const [f] = await db.select().from(forms).where(and(eq(forms.slug, slug), eq(forms.published, true))).limit(1);
    if (f) form = { id: f.id, name: f.name, fields: f.fields };
  } catch {
    /* db down — fall back to code defaults below */
  }
  if (!form) {
    const d = slug === "book-appraisal" ? defaultBookingForm : defaultQuoteForm;
    form = { id: null, name: d.name, fields: d.fields };
  }

  const raw = (body.values && typeof body.values === "object" ? body.values : {}) as Record<string, unknown>;
  const answers: { key: string; label: string; value: string }[] = [];
  for (const f of form.fields) {
    const v = raw[f.key];
    const value = Array.isArray(v) ? v.map((x) => str(x, 200)).filter(Boolean).join(", ") : str(v, f.type === "textarea" ? 3000 : 300);
    if (f.required && !value) return NextResponse.json({ error: `Please complete: ${f.label}` }, { status: 422 });
    if (value && f.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 422 });
    if (value && f.type === "tel" && value.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 422 });
    if (value) answers.push({ key: f.key, label: f.label, value });
  }
  if (!answers.length) return NextResponse.json({ error: "Empty submission" }, { status: 422 });
  const get = (k: string) => answers.find((a) => a.key === k)?.value || null;

  const a = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
  const lead = {
    formId: form.id,
    formName: form.name,
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    service: get("service"),
    answers,
    page: str(body.page, 300) || null,
    landingPage: str(a.landing_page, 300) || null,
    referrer: str(a.referrer, 300) || null,
    utmSource: str(a.utm_source, 100) || sourceOf(str(a.referrer), null, str(a.gclid)),
    utmMedium: str(a.utm_medium, 100) || null,
    utmCampaign: str(a.utm_campaign, 150) || null,
    utmTerm: str(a.utm_term, 150) || null,
    utmContent: str(a.utm_content, 150) || null,
    gclid: str(a.gclid, 200) || str(a.gbraid, 200) || str(a.wbraid, 200) || null,
    sessionId: str(body.sid, 64) || null,
    visitorId: str(body.vid, 64) || null,
    ...geoFromHeaders(req.headers),
  };

  let saved = false;
  try {
    const [row] = await db.insert(leads).values(lead).returning({ id: leads.id });
    await db.insert(leadActivity).values({ leadId: row.id, type: "created", body: `Submitted "${form.name}" from ${lead.page ?? "website"}` });
    saved = true;
  } catch (e) {
    console.error("[leads] db insert failed", e);
  }

  // Notifications (best effort)
  const { RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, LEAD_WEBHOOK_URL } = process.env;
  const jobs: Promise<unknown>[] = [];
  if (RESEND_API_KEY && LEAD_TO_EMAIL) {
    const rows = answers.map((x) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${esc(x.label)}</td><td><b>${esc(x.value)}</b></td></tr>`).join("");
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: LEAD_FROM_EMAIL || `Website Leads <leads@${new URL(site.url).hostname.replace(/^www\./, "")}>`,
          to: LEAD_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: lead.email || undefined,
          subject: `New lead: ${lead.service || form.name} — ${lead.name || "website"}`,
          html: `<h2>New lead</h2><table>${rows}</table><p style="color:#64748b">Page: ${esc(lead.page ?? "")} · Source: ${esc(lead.utmSource ?? "")}</p><p><a href="${site.url}/dashboard/leads">Open in dashboard →</a></p>`,
        }),
      }),
    );
  }
  if (LEAD_WEBHOOK_URL) {
    jobs.push(fetch(LEAD_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, received_at: new Date().toISOString() }) }));
  }
  const sent = (await Promise.allSettled(jobs)).some((r) => r.status === "fulfilled" && (r.value as Response).ok);

  if (!saved && !sent) return NextResponse.json({ error: "" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
