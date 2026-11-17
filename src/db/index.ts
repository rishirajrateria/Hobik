import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const configured = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
/** True when a real database is configured (or we're running locally with the default file). */
export const dbConnected = !!configured || !process.env.VERCEL;
// On Vercel with no database yet, use a throw-away in-memory DB so the site still builds and
// serves (public pages fall back to built-in content; the dashboard shows "not connected").
export const dbUrl = configured || (process.env.VERCEL ? "file::memory:" : "file:./data/app.db");
const dbToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined;

const g = globalThis as unknown as { __db?: ReturnType<typeof make> };
function make() {
  const client = createClient({ url: dbUrl, authToken: dbToken });
  return drizzle(client, { schema });
}

/** Shared Drizzle client (libSQL: local file in dev, Turso in production). */
export const db = g.__db ?? (g.__db = make());
export { schema };
