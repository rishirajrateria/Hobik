"use server";

import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";

export type AuthState = { error?: string };

const MAX_FAILS = 5;
const LOCK_MIN = 15;

export async function login(_: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };

  const [u] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (u?.lockedUntil && u.lockedUntil > new Date()) return { error: `Too many attempts. Try again in ${LOCK_MIN} minutes.` };
  const ok = u ? await verifyPassword(password, u.passwordHash) : await verifyPassword(password, "scrypt$00$00"); // equalise timing
  if (!u || !ok) {
    if (u) {
      const fails = u.failedLogins + 1;
      await db.update(users).set({ failedLogins: fails, lockedUntil: fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MIN * 60000) : null }).where(eq(users.id, u.id));
    }
    return { error: "Incorrect email or password." };
  }
  if (!u.active) return { error: "This account has been deactivated. Ask an admin." };

  await db.update(users).set({ failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() }).where(eq(users.id, u.id));
  await createSession(u.id);
  const next = String(fd.get("next") || "");
  redirect(next.startsWith("/dashboard") ? next : "/dashboard");
}

const setupSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email").transform((s) => s.toLowerCase()),
  password: z.string().min(10, "Use at least 10 characters"),
});

/** First-run only: creates the owner account when no users exist. */
export async function setupOwner(_: AuthState, fd: FormData): Promise<AuthState> {
  const [{ n }] = await db.select({ n: count() }).from(users);
  if (n > 0) return { error: "Setup is already complete. Please sign in." };
  const parsed = setupSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const [u] = await db
    .insert(users)
    .values({ ...parsed.data, passwordHash: await hashPassword(parsed.data.password), role: "owner", lastLoginAt: new Date() })
    .returning({ id: users.id });
  await createSession(u.id);
  redirect("/dashboard");
}
