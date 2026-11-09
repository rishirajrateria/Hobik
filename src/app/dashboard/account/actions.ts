"use server";

import { and, eq, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { getCurrentUser, hashPassword, SESSION_COOKIE, verifyPassword } from "@/lib/auth";

export type AccState = { error?: string; ok?: string };

export async function updateProfile(_: AccState, fd: FormData): Promise<AccState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Signed out" };
  const name = String(fd.get("name") || "").trim();
  if (name.length < 2) return { error: "Enter your name" };
  await db.update(users).set({ name }).where(eq(users.id, me.id));
  return { ok: "Profile updated." };
}

export async function changePassword(_: AccState, fd: FormData): Promise<AccState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Signed out" };
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  if (next.length < 10) return { error: "New password needs at least 10 characters." };
  if (next !== String(fd.get("confirm") || "")) return { error: "New passwords don't match." };
  const [u] = await db.select().from(users).where(eq(users.id, me.id));
  if (!u || !(await verifyPassword(current, u.passwordHash))) return { error: "Current password is incorrect." };
  await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, me.id));
  // Sign out every other device.
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  await db.delete(sessions).where(and(eq(sessions.userId, me.id), ne(sessions.id, createHash("sha256").update(token).digest("hex"))));
  return { ok: "Password changed. Other devices were signed out." };
}
