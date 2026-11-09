/** Plain constants/types shared by server and client code (no drizzle imports). */
export const ROLES = ["owner", "admin", "editor", "sales", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const LEAD_STATUSES = ["new", "contacted", "quoted", "booked", "completed", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const FIELD_TYPES = ["text", "email", "tel", "textarea", "select", "radio", "checkbox", "date", "number"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];
export type FormField = {
  id: string;
  key: string; // machine name; "name" | "email" | "phone" | "service" map to lead columns
  type: FieldType;
  label: string;
  placeholder?: string;
  help?: string;
  required: boolean;
  options?: string[];
  width: "full" | "half";
};
