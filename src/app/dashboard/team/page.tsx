import { asc } from "drizzle-orm";
import { db } from "@/db";
import { ROLES, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { PERMISSIONS, ROLE_INFO, type Permission } from "@/lib/permissions";
import { Icon } from "@/components/Icon";
import { Badge, PageHeader, Panel, fmtDate, timeAgo } from "@/components/dash/ui";
import { InviteForm, RoleSelect, UserActions } from "@/components/dash/TeamControls";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const me = await requireUser("team:manage");
  const list = await db.select().from(users).orderBy(asc(users.createdAt));
  const isOwner = me.role === "owner";

  return (
    <div className="space-y-6">
      <PageHeader title="Team & roles" sub="Give each person exactly the access they need. Everyone signs in with their email and password." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title={`Members (${list.length})`} className="xl:col-span-2" pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
                <tr><th className="px-5 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Last sign-in</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {list.map((u) => {
                  const locked = u.id === me.id || (u.role === "owner" && !isOwner);
                  return (
                    <tr key={u.id} className={`border-t border-slate-100 ${u.active ? "" : "opacity-60"}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-extrabold text-gold-300">{u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}</span>
                          <span>
                            <span className="block font-bold text-navy-950">{u.name} {u.id === me.id && <span className="text-xs font-normal text-slate-400">(you)</span>}</span>
                            <span className="block text-xs text-slate-500">{u.email}</span>
                          </span>
                          {!u.active && <Badge tone="rose">Deactivated</Badge>}
                        </div>
                      </td>
                      <td className="px-3 py-3"><RoleSelect id={u.id} role={u.role} allowOwner={isOwner} disabled={locked} /></td>
                      <td className="px-3 py-3 text-xs text-slate-500" title={fmtDate(u.lastLoginAt, true)}>{u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never"}</td>
                      <td className="px-5 py-3 text-right"><UserActions id={u.id} active={u.active} disabled={locked} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Add a team member" className="xl:self-start"><InviteForm allowOwner={isOwner} /></Panel>
      </div>

      <Panel title="What each role can do" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
              <tr><th className="px-5 py-3">Permission</th>{ROLES.map((r) => <th key={r} className="px-3 py-3 text-center">{ROLE_INFO[r].label}</th>)}</tr>
            </thead>
            <tbody>
              {(Object.keys(PERMISSIONS) as Permission[]).map((p) => (
                <tr key={p} className="border-t border-slate-100">
                  <td className="px-5 py-2.5 font-semibold text-slate-700">{PERMISSIONS[p]}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="px-3 py-2.5 text-center">
                      {ROLE_INFO[r].perms.includes(p) ? <Icon name="check" className="mx-auto h-5 w-5 text-emerald-600" aria-label="Allowed" /> : <span className="text-slate-300" aria-label="Not allowed">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
