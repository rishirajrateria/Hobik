import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/Layout";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  let n = 0;
  try {
    [{ n }] = await db.select({ n: count() }).from(users);
  } catch {
    return (
      <main id="main" className="grid min-h-screen place-items-center bg-paper px-6 text-center">
        <div className="max-w-md">
          <span className="eyebrow">Dashboard</span>
          <h1 className="mt-5 text-[34px] font-medium text-ink-950">Database not connected yet</h1>
          <p className="mt-3 text-ink-700">The website is live, but the dashboard needs a database. Connect one in your hosting settings and redeploy, then reload this page.</p>
        </div>
      </main>
    );
  }
  const setup = n === 0;
  const { next } = await searchParams;

  return (
    <main id="main" className="min-h-screen bg-paper">
      <div className="border-b border-ink-100">
        <div className="container-x flex h-[72px] items-center"><Logo /></div>
      </div>
      <div className="container-x grid gap-16 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <span className="eyebrow">{setup ? "First-time setup" : "Team sign-in"}</span>
          <h1 className="mt-5 text-[40px] leading-[1.08] font-medium text-ink-950">{setup ? "Set up your workspace" : "Welcome back"}</h1>
          <p className="mt-3 text-[17px] text-ink-700">{setup ? "Create the owner account. You can invite your team afterwards." : "Sign in to the Value Trust dashboard."}</p>
          <div className="mt-10 border border-ink-950 bg-paper-50 p-6 sm:p-8"><LoginForm setup={setup} next={next} /></div>
          {!setup && <p className="mt-5 text-[14px] text-ink-700">Forgot your password? Ask a workspace owner or admin to reset it.</p>}
        </div>
        <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-accent-600 uppercase">Inside the dashboard</p>
          <dl className="mt-5 border-t border-ink-950">
            {[
              ["Traffic", "Visitors by country, province, city, page and source."],
              ["Clicks", "Which buttons people press, across the site and on each page."],
              ["Leads", "Every enquiry, from new to booked, with notes and owners."],
              ["Content", "Forms, blog posts and testimonials, edited without a developer."],
            ].map(([t, d]) => (
              <div key={t} className="grid grid-cols-[8rem_1fr] gap-6 border-b border-ink-100 py-5">
                <dt className="font-display text-[22px] text-ink-950">{t}</dt>
                <dd className="text-[16px] leading-relaxed text-ink-700">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
