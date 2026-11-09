"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/db";
import { ROLES, sessions, users, type Role } from "@/db/schema";
import { assertCan, hashPassword, type SessionUser } from "@/lib/auth";

export type TeamState = { error?: string; ok?: string; tempPassword?: string };

const tempPw = () => randomBytes(9).toString("base64url");

async function target(me: SessionUser, id: string) {
  const [u] = await db.select().from(users).where(eq(users.id, id));
  if (!u) throw new Error("User not found");
  if (u.role === "owner" && me.role !== "owner") throw new Error("Only owners can change other owners.");
  return u;
}
async function ownersLeft(excludeId: string) {
  const [{ n }] = await db.select({ n: count() }).from(users).where(and(eq(users.role, "owner"), eq(users.active, true)));
  const [ex] = await db.select({ role: users.role, active: users.active }).from(users).where(eq(users.id, excludeId));
  return n - (ex?.role === "owner" && ex.active ? 1 : 0);
}

const invite = z.object({
  name: z.string().trim().min(2, "Enter a name").max(80),
  email: z.email("Enter a valid email").transform((s) => s.toLowerCase()),
  role: z.enum(ROLES),
  password: z.string().max(200).optional(),
});

export async function inviteUser(_: TeamState, fd: FormData): Promise<TeamState> {
  const me = await assertCan("team:manage");
  const p = invite.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  if (p.data.role === "owner" && me.role !== "owner") return { error: "Only owners can add owners." };
  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.email, p.data.email));
  if (exists) return { error: "A user with that email already exists." };
  const custom = p.data.password?.trim();
  if (custom && custom.length < 10) return { error: "Passwords need at least 10 characters (or leave blank to generate one)." };
  const pw = custom || tempPw();
  await db.insert(users).values({ name: p.data.name, email: p.data.email, role: p.data.role, passwordHash: await hashPassword(pw) });
  revalidatePath("/dashboard/team");
  return { ok: `${p.data.name} can now sign in at /login with ${p.data.email}.`, tempPassword: custom ? undefined : pw };
}

export async function changeRole(id: string, role: Role) {
  const me = await assertCan("team:manage");
  if (!ROLES.includes(role)) throw new Error("Bad role");
  if (id === me.id) throw new Error("You can't change your own role.");
  const u = await target(me, id);
  if (role === "owner" && me.role !== "owner") throw new Error("Only owners can promote to owner.");
  if (u.role === "owner" && role !== "owner" && (await ownersLeft(id)) < 1) throw new Error("Keep at least one owner.");
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/dashboard/team");
}

export async function setActive(id: string, active: boolean) {
  const me = await assertCan("team:manage");
  if (id === me.id) throw new Error("You can't deactivate yourself.");
  const u = await target(me, id);
  if (!active && u.role === "owner" && (await ownersLeft(id)) < 1) throw new Error("Keep at least one owner.");
  await db.update(users).set({ active, failedLogins: 0, lockedUntil: null }).where(eq(users.id, id));
  if (!active) await db.delete(sessions).where(eq(sessions.userId, id));
  revalidatePath("/dashboard/team");
}

export async function resetPassword(id: string, _: TeamState): Promise<TeamState> {
  const me = await assertCan("team:manage");
  try {
    await target(me, id);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const pw = tempPw();
  await db.update(users).set({ passwordHash: await hashPassword(pw), failedLogins: 0, lockedUntil: null }).where(eq(users.id, id));
  await db.delete(sessions).where(eq(sessions.userId, id));
  return { ok: "Password reset. Share this temporary password securely:", tempPassword: pw };
}

export async function deleteUser(id: string) {
  const me = await assertCan("team:manage");
  if (id === me.id) throw new Error("You can't delete yourself.");
  const u = await target(me, id);
  if (u.role === "owner" && (await ownersLeft(id)) < 1) throw new Error("Keep at least one owner.");
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/dashboard/team");
}
