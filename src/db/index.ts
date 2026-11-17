import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type DB = NeonHttpDatabase<typeof schema>;

/** Neon's Vercel integration sets DATABASE_URL; POSTGRES_URL is its alias. */
export const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
export const dbConnected = /^postgres(ql)?:\/\//.test(dbUrl);

const g = globalThis as unknown as { __db?: DB };

function make(): DB {
  if (!dbConnected) {
    // No database configured: public pages fall back to built-in content (see lib/content.ts)
    // and the dashboard explains that a database must be connected.
    return new Proxy({} as DB, {
      get() {
        throw new Error("Database not connected: set DATABASE_URL.");
      },
    });
  }
  // Neon over HTTP: ideal for serverless (no connection pool to exhaust).
  if (/\.neon\.tech\b/.test(dbUrl)) return drizzleNeon(neon(dbUrl), { schema });
  // Any other Postgres (local dev, Supabase, RDS...) over a normal connection.
  const pool = new Pool({ connectionString: dbUrl, max: 5 });
  return drizzlePg(pool, { schema }) as unknown as DB;
}

/** Shared Drizzle client. */
export const db = g.__db ?? (g.__db = make());
export { schema };
