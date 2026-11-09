"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";

export type NavItem = { href: string; label: string; icon: string; badge?: number };

export function Sidebar({ items, user, signOut }: { items: NavItem[]; user: { name: string; email: string; role: string }; signOut: () => Promise<void> }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/dashboard" ? path === href : path.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-950">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg>
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-extrabold text-white">Home Value</span>
          <span className="block text-[10px] font-bold tracking-[0.2em] text-gold-300 uppercase">Workspace</span>
        </span>
      </Link>
      <ul className="mt-2 flex-1 space-y-0.5 px-3">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active(it.href) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              aria-current={active(it.href) ? "page" : undefined}
            >
              <Icon name={it.icon} className="h-[18px] w-[18px]" />
              <span className="flex-1">{it.label}</span>
              {!!it.badge && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[11px] font-extrabold text-navy-950">{it.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white">
          <Icon name="external" className="h-[18px] w-[18px]" /> View website
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-400 text-sm font-extrabold text-navy-950">
            {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
          </span>
          <Link href="/dashboard/account" className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-white">{user.name}</span>
            <span className="block truncate text-xs text-white/50 capitalize">{user.role}</span>
          </Link>
          <form action={signOut}>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
              <Icon name="logout" className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-slate-200" aria-label="Open navigation">
          <Icon name="menu" className="h-5 w-5" />
        </button>
        <span className="font-display font-extrabold text-navy-950">Home Value</span>
        <span className="w-10" />
      </div>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-950 lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} aria-label="Close navigation" />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-950 shadow-2xl">{nav}</aside>
        </div>
      )}
    </>
  );
}
