import type { Role } from "@/db/constants";

export const PERMISSIONS = {
  "analytics:view": "View traffic & click analytics",
  "leads:view": "View leads",
  "leads:write": "Update lead status, notes & assignee",
  "leads:delete": "Delete & export leads",
  "forms:write": "Edit website forms",
  "blog:write": "Write & publish blog posts",
  "testimonials:write": "Manage testimonials",
  "team:manage": "Invite users & assign roles",
} as const;
export type Permission = keyof typeof PERMISSIONS;

const ALL = Object.keys(PERMISSIONS) as Permission[];

export const ROLE_INFO: Record<Role, { label: string; description: string; perms: Permission[] }> = {
  owner: { label: "Owner", description: "Full access, including managing other owners.", perms: ALL },
  admin: { label: "Admin", description: "Full access except managing owners.", perms: ALL },
  editor: { label: "Editor", description: "Blog, testimonials, forms and analytics.", perms: ["analytics:view", "forms:write", "blog:write", "testimonials:write"] },
  sales: { label: "Sales", description: "Works leads and sees analytics.", perms: ["analytics:view", "leads:view", "leads:write"] },
  viewer: { label: "Viewer", description: "Read-only analytics and leads.", perms: ["analytics:view", "leads:view"] },
};

export const can = (role: Role | undefined, p: Permission) => !!role && ROLE_INFO[role].perms.includes(p);
