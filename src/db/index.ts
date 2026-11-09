import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const dbUrl = process.env.DATABASE_URL || "file:./data/app.db";

const g = globalThis as unknown as { __db?: ReturnType<typeof make> };
function make() {
  const client = createClient({ url: dbUrl, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
  return drizzle(client, { schema });
}

/** Shared Drizzle client (libSQL: local file in dev, Turso in production). */
export const db = g.__db ?? (g.__db = make());
export { schema };
