import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";
import { can, type Permission } from "./permissions";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
export const SESSION_COOKIE = "hv_session";
const SESSION_DAYS = 30;

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64);
  return ["scrypt", salt.toString("hex"), key.toString("hex")].join("$");
}

export async function verifyPassword(pw: string, stored: string) {
  const [alg, saltHex, keyHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await scrypt(pw, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  return key.length === expected.length && timingSafeEqual(key, expected);
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  const ua = (await headers()).get("user-agent")?.slice(0, 200) ?? null;
  await db.insert(sessions).values({ id: sha(token), userId, expiresAt, userAgent: ua });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, sha(token)));
  jar.delete(SESSION_COOKIE);
}

export type SessionUser = Pick<User, "id" | "email" | "name" | "role">;

/** The signed-in user for this request, or null. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role, active: users.active })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, sha(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const u = rows[0];
  if (!u || !u.active) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role };
});

/** For pages: redirect to login (or the dashboard home) if not allowed. */
export async function requireUser(perm?: Permission) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (perm && !can(user.role, perm)) redirect("/dashboard?denied=1");
  return user;
}

/** For server actions: throw instead of redirecting. */
export async function assertCan(perm: Permission) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, perm)) throw new Error("You don't have permission to do that.");
  return user;
}
