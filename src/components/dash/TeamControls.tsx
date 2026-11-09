"use client";

import { useActionState, useState, useTransition } from "react";
import { ROLES, type Role } from "@/db/constants";
import { ROLE_INFO } from "@/lib/permissions";
import { changeRole, deleteUser, inviteUser, resetPassword, setActive, type TeamState } from "@/app/dashboard/team/actions";
import { btnGold, inputCls, labelCls } from "./ui";

function useAct() {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  const run = (fn: () => Promise<unknown>) => start(async () => { setErr(""); try { await fn(); } catch (e) { setErr((e as Error).message); } });
  return { pending, err, run };
}

export function RoleSelect({ id, role, allowOwner, disabled }: { id: string; role: Role; allowOwner: boolean; disabled?: boolean }) {
  const { pending, err, run } = useAct();
  return (
    <span>
      <select aria-label="Role" defaultValue={role} disabled={disabled || pending} onChange={(e) => run(() => changeRole(id, e.target.value as Role))} className="rounded-lg border-0 py-1.5 pr-8 pl-2.5 text-sm font-semibold ring-1 ring-slate-200 disabled:opacity-60">
        {ROLES.filter((r) => allowOwner || r !== "owner" || role === "owner").map((r) => <option key={r} value={r}>{ROLE_INFO[r].label}</option>)}
      </select>
      {err && <span className="mt-1 block text-xs text-rose-600">{err}</span>}
    </span>
  );
}

export function UserActions({ id, active, disabled }: { id: string; active: boolean; disabled?: boolean }) {
  const { pending, err, run } = useAct();
  const [state, reset, resetting] = useActionState<TeamState, FormData>(resetPassword.bind(null, id), {});
  if (disabled) return <span className="text-xs text-slate-400">—</span>;
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1">
        <form action={reset}><button disabled={resetting} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Reset password</button></form>
        <button disabled={pending} onClick={() => run(() => setActive(id, !active))} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100">{active ? "Deactivate" : "Activate"}</button>
        <button disabled={pending} onClick={() => confirm("Remove this user permanently?") && run(() => deleteUser(id))} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">Remove</button>
      </div>
      {err && <span className="text-xs text-rose-600">{err}</span>}
      {state.error && <span className="text-xs text-rose-600">{state.error}</span>}
      {state.tempPassword && <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-900 ring-1 ring-amber-200">Temp password: <code className="font-bold select-all">{state.tempPassword}</code></span>}
    </div>
  );
}

export function InviteForm({ allowOwner }: { allowOwner: boolean }) {
  const [state, action, pending] = useActionState<TeamState, FormData>(inviteUser, {});
  return (
    <form action={action} className="space-y-4">
      <div><label className={labelCls} htmlFor="i-name">Name</label><input id="i-name" name="name" required className={inputCls} /></div>
      <div><label className={labelCls} htmlFor="i-email">Email (login ID)</label><input id="i-email" name="email" type="email" required className={inputCls} /></div>
      <div>
        <label className={labelCls} htmlFor="i-role">Role</label>
        <select id="i-role" name="role" defaultValue="sales" className={inputCls}>
          {ROLES.filter((r) => allowOwner || r !== "owner").map((r) => <option key={r} value={r}>{ROLE_INFO[r].label} — {ROLE_INFO[r].description}</option>)}
        </select>
      </div>
      <div><label className={labelCls} htmlFor="i-pw">Password <span className="font-normal normal-case">(blank = generate one)</span></label><input id="i-pw" name="password" type="text" minLength={10} autoComplete="off" className={inputCls} /></div>
      {state.error && <p className="text-sm font-semibold text-rose-700" role="alert">{state.error}</p>}
      {state.ok && (
        <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 ring-1 ring-emerald-200" role="status">
          {state.ok}
          {state.tempPassword && <p className="mt-1">Temporary password: <code className="rounded bg-white px-1.5 py-0.5 font-bold select-all">{state.tempPassword}</code> — shown once.</p>}
        </div>
      )}
      <button className={`${btnGold} w-full`} disabled={pending}>{pending ? "Adding…" : "Add team member"}</button>
    </form>
  );
}
