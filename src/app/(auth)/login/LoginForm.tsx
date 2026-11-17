"use client";

import { useActionState } from "react";
import { login, setupOwner, type AuthState } from "./actions";
import { Icon } from "@/components/Icon";

const input = "input";

export function LoginForm({ setup, next }: { setup: boolean; next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(setup ? setupOwner : login, {});
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {setup && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[13px] font-semibold text-ink-800">Your name</label>
          <input id="name" name="name" required autoComplete="name" defaultValue={state.name} className={input} placeholder="Jane Appraiser" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-ink-800">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={state.email} className={input} placeholder="you@homeappraisaltoronto.ca" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-ink-800">Password</label>
        <input id="password" name="password" type="password" required minLength={setup ? 10 : 1} autoComplete={setup ? "new-password" : "current-password"} className={input} placeholder="••••••••••" />
      </div>
      {state.error && <p role="alert" className="border-l-2 border-brick-500 bg-white px-4 py-3 text-sm font-semibold text-brick-600">{state.error}</p>}
      <button disabled={pending} className="btn-primary w-full disabled:opacity-70">
        {pending ? "Please wait…" : setup ? "Create owner account" : "Sign in"}
      </button>
    </form>
  );
}
