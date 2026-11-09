"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { LEAD_STATUSES, leadActivity, leads, users, type LeadStatus } from "@/db/schema";
import { assertCan } from "@/lib/auth";

function touch(id: string) {
  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${id}`);
  revalidatePath("/dashboard", "layout");
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  const u = await assertCan("leads:write");
  if (!LEAD_STATUSES.includes(status)) throw new Error("Bad status");
  const [l] = await db.select({ status: leads.status }).from(leads).where(eq(leads.id, id));
  if (!l || l.status === status) return;
  await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id));
  await db.insert(leadActivity).values({ leadId: id, userId: u.id, type: "status", body: `Status changed from ${l.status} to ${status}` });
  touch(id);
}

export async function assignLead(id: string, assigneeId: string) {
  const u = await assertCan("leads:write");
  let name = "nobody";
  if (assigneeId) {
    const [a] = await db.select({ name: users.name }).from(users).where(eq(users.id, assigneeId));
    if (!a) throw new Error("Unknown user");
    name = a.name;
  }
  await db.update(leads).set({ assigneeId: assigneeId || null, updatedAt: new Date() }).where(eq(leads.id, id));
  await db.insert(leadActivity).values({ leadId: id, userId: u.id, type: "assign", body: `Assigned to ${name}` });
  touch(id);
}

export async function setLeadValue(id: string, fd: FormData) {
  await assertCan("leads:write");
  const v = Math.round(Number(String(fd.get("value") || "").replace(/[^\d.]/g, "")));
  await db.update(leads).set({ value: Number.isFinite(v) && v > 0 ? v : null, updatedAt: new Date() }).where(eq(leads.id, id));
  touch(id);
}

export async function addNote(id: string, fd: FormData) {
  const u = await assertCan("leads:write");
  const body = String(fd.get("body") || "").trim().slice(0, 4000);
  if (!body) return;
  await db.insert(leadActivity).values({ leadId: id, userId: u.id, type: "note", body });
  await db.update(leads).set({ updatedAt: new Date() }).where(eq(leads.id, id));
  touch(id);
}

export async function deleteLead(id: string) {
  await assertCan("leads:delete");
  await db.delete(leads).where(eq(leads.id, id));
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/leads");
}
