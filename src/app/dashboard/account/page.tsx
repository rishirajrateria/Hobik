import { requireUser } from "@/lib/auth";
import { ROLE_INFO, PERMISSIONS } from "@/lib/permissions";
import { Icon } from "@/components/Icon";
import { PageHeader, Panel } from "@/components/dash/ui";
import { PasswordForm, ProfileForm } from "@/components/dash/AccountForms";

export default async function Account() {
  const me = await requireUser();
  const info = ROLE_INFO[me.role];
  return (
    <div className="space-y-6">
      <PageHeader title="My account" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Profile"><ProfileForm name={me.name} email={me.email} /></Panel>
        <Panel title="Password"><PasswordForm /></Panel>
        <Panel title={`Your role: ${info.label}`} sub={info.description}>
          <ul className="space-y-2">
            {info.perms.map((p) => <li key={p} className="flex items-center gap-2 text-sm text-slate-700"><Icon name="check" className="h-4 w-4 text-emerald-600" /> {PERMISSIONS[p]}</li>)}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
