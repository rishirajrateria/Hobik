import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { Icon } from "@/components/Icon";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const [{ n }] = await db.select({ n: count() }).from(users);
  const setup = n === 0;
  const { next } = await searchParams;

  return (
    <main id="main" className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col justify-center overflow-hidden bg-navy-950 px-6 py-16 sm:px-16">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-sm">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950">
            <Icon name="lock" className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-white">{setup ? "Set up your workspace" : "Welcome back"}</h1>
          <p className="mt-2 text-white/60">{setup ? "Create the owner account. You can invite your team after." : "Sign in to the Home Value dashboard."}</p>
          <div className="mt-8"><LoginForm setup={setup} next={next} /></div>
          {!setup && <p className="mt-6 text-sm text-white/40">Forgot your password? Ask a workspace owner or admin to reset it.</p>}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 lg:block">
        <div className="bg-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-mint-400/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-center gap-4 p-16">
          {[
            ["chart", "Live traffic", "Visitors by country, province, page and source."],
            ["cursor", "Every click counted", "See which buttons convert — site-wide and per page."],
            ["inbox", "Lead pipeline", "New → contacted → quoted → booked, with notes."],
            ["form", "Form builder", "Choose the questions your website asks."],
          ].map(([icon, t, d], i) => (
            <div key={t} className="glass flex max-w-md items-center gap-4 p-5" style={{ marginLeft: `${i * 28}px` }}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400"><Icon name={icon} className="h-6 w-6" /></span>
              <span>
                <span className="block font-extrabold text-navy-950">{t}</span>
                <span className="block text-sm text-slate-600">{d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
