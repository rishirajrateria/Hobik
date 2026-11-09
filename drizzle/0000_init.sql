CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`path` text NOT NULL,
	`label` text,
	`location` text,
	`href` text,
	`visitor_id` text,
	`session_id` text,
	`referrer` text,
	`source` text,
	`country` text,
	`region` text,
	`city` text,
	`device` text,
	`browser` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_created_idx` ON `events` (`created_at`);--> statement-breakpoint
CREATE INDEX `events_type_created_idx` ON `events` (`type`,`created_at`);--> statement-breakpoint
CREATE INDEX `events_path_idx` ON `events` (`path`);--> statement-breakpoint
CREATE TABLE `forms` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`submit_label` text DEFAULT 'Submit' NOT NULL,
	`success_title` text DEFAULT 'Thank you!' NOT NULL,
	`success_message` text DEFAULT 'We''ll be in touch shortly.' NOT NULL,
	`style` text DEFAULT 'card' NOT NULL,
	`fields` text NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `forms_slug_idx` ON `forms` (`slug`);--> statement-breakpoint
CREATE TABLE `lead_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `activity_lead_idx` ON `lead_activity` (`lead_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text,
	`form_name` text,
	`status` text DEFAULT 'new' NOT NULL,
	`assignee_id` text,
	`name` text,
	`email` text,
	`phone` text,
	`service` text,
	`answers` text NOT NULL,
	`page` text,
	`landing_page` text,
	`referrer` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_term` text,
	`utm_content` text,
	`gclid` text,
	`country` text,
	`region` text,
	`city` text,
	`session_id` text,
	`visitor_id` text,
	`value` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`cover_image` text,
	`accent` text DEFAULT 'navy' NOT NULL,
	`tags` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`author_id` text,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`location` text,
	`role` text,
	`service` text,
	`rating` integer DEFAULT 5 NOT NULL,
	`body` text NOT NULL,
	`source` text,
	`status` text DEFAULT 'published' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`failed_logins` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`last_login_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);