import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { destroySession, requireUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { Sidebar, type NavItem } from "@/components/dash/Sidebar";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const r = user.role;
  let newLeads = 0;
  if (can(r, "leads:view")) [{ n: newLeads }] = await db.select({ n: count() }).from(leads).where(eq(leads.status, "new"));

  const items: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: "grid" },
    ...(can(r, "analytics:view") ? [{ href: "/dashboard/analytics", label: "Analytics", icon: "chart" }] : []),
    ...(can(r, "leads:view") ? [{ href: "/dashboard/leads", label: "Leads", icon: "inbox", badge: newLeads }] : []),
    ...(can(r, "forms:write") ? [{ href: "/dashboard/forms", label: "Forms", icon: "form" }] : []),
    ...(can(r, "blog:write") ? [{ href: "/dashboard/blog", label: "Blog", icon: "pencil" }] : []),
    ...(can(r, "testimonials:write") ? [{ href: "/dashboard/testimonials", label: "Testimonials", icon: "quote" }] : []),
    ...(can(r, "team:manage") ? [{ href: "/dashboard/team", label: "Team & roles", icon: "users" }] : []),
    { href: "/dashboard/account", label: "My account", icon: "user" },
  ];

  async function signOut() {
    "use server";
    await destroySession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar items={items} user={{ name: user.name, email: user.email, role: user.role }} signOut={signOut} />
      <main id="main" className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
