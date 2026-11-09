"use client";

import { useActionState } from "react";
import { login, setupOwner, type AuthState } from "./actions";
import { Icon } from "@/components/Icon";

const input = "w-full rounded-xl border-0 bg-white/5 px-4 py-3.5 text-white ring-1 ring-white/15 placeholder:text-white/30 focus:ring-2 focus:ring-gold-400 focus:outline-none";

export function LoginForm({ setup, next }: { setup: boolean; next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(setup ? setupOwner : login, {});
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {setup && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-white/70">Your name</label>
          <input id="name" name="name" required autoComplete="name" className={input} placeholder="Jane Appraiser" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-white/70">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={input} placeholder="you@homeappraisaltoronto.ca" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-white/70">Password</label>
        <input id="password" name="password" type="password" required minLength={setup ? 10 : 1} autoComplete={setup ? "new-password" : "current-password"} className={input} placeholder="••••••••••" />
      </div>
      {state.error && <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 ring-1 ring-rose-500/30">{state.error}</p>}
      <button disabled={pending} className="btn-gold w-full text-base disabled:opacity-70">
        {pending ? "Please wait…" : setup ? "Create owner account" : "Sign in"} <Icon name="arrow" className="h-5 w-5" />
      </button>
    </form>
  );
}
