"use client";

import { useActionState } from "react";
import { changePassword, updateProfile, type AccState } from "@/app/dashboard/account/actions";
import { btnPrimary, inputCls, labelCls } from "./ui";

function Msg({ s }: { s: AccState }) {
  if (s.error) return <p className="text-sm font-semibold text-rose-700" role="alert">{s.error}</p>;
  if (s.ok) return <p className="text-sm font-semibold text-emerald-700" role="status">{s.ok}</p>;
  return null;
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [s, a, p] = useActionState<AccState, FormData>(updateProfile, {});
  return (
    <form action={a} className="space-y-4">
      <div><label className={labelCls} htmlFor="a-name">Name</label><input id="a-name" name="name" defaultValue={name} className={inputCls} /></div>
      <div><label className={labelCls} htmlFor="a-email">Email (login ID)</label><input id="a-email" value={email} disabled className={`${inputCls} bg-slate-50 text-slate-500`} /></div>
      <Msg s={s} />
      <button className={btnPrimary} disabled={p}>Save</button>
    </form>
  );
}

export function PasswordForm() {
  const [s, a, p] = useActionState<AccState, FormData>(changePassword, {});
  return (
    <form action={a} className="space-y-4">
      <div><label className={labelCls} htmlFor="p-cur">Current password</label><input id="p-cur" name="current" type="password" required autoComplete="current-password" className={inputCls} /></div>
      <div><label className={labelCls} htmlFor="p-new">New password</label><input id="p-new" name="next" type="password" required minLength={10} autoComplete="new-password" className={inputCls} /></div>
      <div><label className={labelCls} htmlFor="p-con">Confirm new password</label><input id="p-con" name="confirm" type="password" required minLength={10} autoComplete="new-password" className={inputCls} /></div>
      <Msg s={s} />
      <button className={btnPrimary} disabled={p}>Change password</button>
    </form>
  );
}
