import { FIELD_TYPES, LEAD_STATUSES, ROLES, type FormField } from "./constants";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export * from "./constants";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const now = () => integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date());


export const users = sqliteTable(
  "users",
  {
    id: id(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ROLES }).notNull().default("viewer"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    failedLogins: integer("failed_logins").notNull().default(0),
    lockedUntil: integer("locked_until", { mode: "timestamp_ms" }),
    lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }),
    createdAt: now(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(), // sha256 of the cookie token
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    userAgent: text("user_agent"),
    createdAt: now(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);


export const leads = sqliteTable(
  "leads",
  {
    id: id(),
    formId: text("form_id"),
    formName: text("form_name"),
    status: text("status", { enum: LEAD_STATUSES }).notNull().default("new"),
    assigneeId: text("assignee_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    service: text("service"),
    /** Every answer as [{ key, label, value }] — survives later form edits. */
    answers: text("answers", { mode: "json" }).$type<{ key: string; label: string; value: string }[]>().notNull(),
    page: text("page"),
    landingPage: text("landing_page"),
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    gclid: text("gclid"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    sessionId: text("session_id"),
    visitorId: text("visitor_id"),
    value: integer("value"), // optional quoted fee in dollars
    createdAt: now(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (t) => [index("leads_created_idx").on(t.createdAt), index("leads_status_idx").on(t.status)],
);

export const leadActivity = sqliteTable(
  "lead_activity",
  {
    id: id(),
    leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    type: text("type", { enum: ["note", "status", "assign", "created"] }).notNull(),
    body: text("body").notNull(),
    createdAt: now(),
  },
  (t) => [index("activity_lead_idx").on(t.leadId)],
);

export const forms = sqliteTable(
  "forms",
  {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    submitLabel: text("submit_label").notNull().default("Submit"),
    successTitle: text("success_title").notNull().default("Thank you!"),
    successMessage: text("success_message").notNull().default("We'll be in touch shortly."),
    style: text("style", { enum: ["card", "steps"] }).notNull().default("card"),
    fields: text("fields", { mode: "json" }).$type<FormField[]>().notNull(),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: now(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("forms_slug_idx").on(t.slug)],
);

export const posts = sqliteTable(
  "posts",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    coverImage: text("cover_image"),
    accent: text("accent").notNull().default("navy"),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().$defaultFn(() => []),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: now(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug), index("posts_status_idx").on(t.status)],
);

export const testimonials = sqliteTable("testimonials", {
  id: id(),
  name: text("name").notNull(),
  location: text("location"),
  role: text("role"),
  service: text("service"),
  rating: integer("rating").notNull().default(5),
  body: text("body").notNull(),
  source: text("source"), // e.g. "Google"
  status: text("status", { enum: ["published", "hidden"] }).notNull().default("published"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: now(),
});

export const events = sqliteTable(
  "events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", { enum: ["pageview", "click"] }).notNull(),
    path: text("path").notNull(),
    label: text("label"),
    location: text("location"),
    href: text("href"),
    visitorId: text("visitor_id"),
    sessionId: text("session_id"),
    referrer: text("referrer"),
    source: text("source"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    device: text("device"),
    browser: text("browser"),
    createdAt: integer("created_at").notNull(), // epoch ms
  },
  (t) => [index("events_created_idx").on(t.createdAt), index("events_type_created_idx").on(t.type, t.createdAt), index("events_path_idx").on(t.path)],
);

export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Form = typeof forms.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
