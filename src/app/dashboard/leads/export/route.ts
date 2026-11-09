import { and, desc, eq, like, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { LEAD_STATUSES, leads, type LeadStatus } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // block spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "leads:delete")) return new Response("Forbidden", { status: 403 });
  const sp = new URL(req.url).searchParams;
  const conds: SQL[] = [];
  const st = sp.get("status");
  if (st && LEAD_STATUSES.includes(st as LeadStatus)) conds.push(eq(leads.status, st as LeadStatus));
  const q = sp.get("q");
  if (q) conds.push(or(like(leads.name, `%${q}%`), like(leads.email, `%${q}%`), like(leads.phone, `%${q}%`))!);
  const rows = await db.select().from(leads).where(conds.length ? and(...conds) : undefined).orderBy(desc(leads.createdAt));

  const head = ["Received", "Status", "Name", "Phone", "Email", "Service", "Form", "Answers", "Value", "Page", "Landing page", "Source", "Medium", "Campaign", "Keyword", "GCLID", "Country", "Region", "City"];
  const lines = rows.map((l) =>
    [l.createdAt.toISOString(), l.status, l.name, l.phone, l.email, l.service, l.formName, l.answers.map((a) => `${a.label}: ${a.value}`).join(" | "), l.value, l.page, l.landingPage, l.utmSource, l.utmMedium, l.utmCampaign, l.utmTerm, l.gclid, l.country, l.region, l.city].map(cell).join(","),
  );
  return new Response([head.map(cell).join(","), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
