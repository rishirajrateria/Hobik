"use client";

import { useTransition } from "react";
import { LEAD_STATUSES, type LeadStatus } from "@/db/constants";
import { assignLead, setLeadStatus } from "@/app/dashboard/leads/actions";

const sel = "rounded-lg border-0 bg-white py-1.5 pr-8 pl-2.5 text-sm font-semibold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 disabled:opacity-60";

export function StatusSelect({ id, status, disabled }: { id: string; status: LeadStatus; disabled?: boolean }) {
  const [pending, start] = useTransition();
  return (
    <select aria-label="Lead status" className={`${sel} capitalize`} defaultValue={status} disabled={disabled || pending} onChange={(e) => start(() => setLeadStatus(id, e.target.value as LeadStatus))}>
      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

export function AssigneeSelect({ id, assigneeId, team, disabled }: { id: string; assigneeId: string | null; team: { id: string; name: string }[]; disabled?: boolean }) {
  const [pending, start] = useTransition();
  return (
    <select aria-label="Assignee" className={sel} defaultValue={assigneeId ?? ""} disabled={disabled || pending} onChange={(e) => start(() => assignLead(id, e.target.value))}>
      <option value="">Unassigned</option>
      {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
  );
}
