import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT 'admin',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_gallery_url\` text,
  	\`sizes_gallery_width\` numeric,
  	\`sizes_gallery_height\` numeric,
  	\`sizes_gallery_mime_type\` text,
  	\`sizes_gallery_filesize\` numeric,
  	\`sizes_gallery_filename\` text,
  	\`sizes_full_url\` text,
  	\`sizes_full_width\` numeric,
  	\`sizes_full_height\` numeric,
  	\`sizes_full_mime_type\` text,
  	\`sizes_full_filesize\` numeric,
  	\`sizes_full_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_gallery_sizes_gallery_filename_idx\` ON \`media\` (\`sizes_gallery_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_full_sizes_full_filename_idx\` ON \`media\` (\`sizes_full_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`CREATE TABLE \`artworks_categories\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`artworks_categories_order_idx\` ON \`artworks_categories\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`artworks_categories_parent_idx\` ON \`artworks_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`artworks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`catalog_number\` numeric,
  	\`image_id\` integer,
  	\`medium\` text,
  	\`dimensions\` text,
  	\`year\` numeric,
  	\`availability\` text,
  	\`price_display\` text,
  	\`description\` text,
  	\`featured\` integer DEFAULT false,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`artworks_slug_idx\` ON \`artworks\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`artworks_image_idx\` ON \`artworks\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`artworks_updated_at_idx\` ON \`artworks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`artworks_created_at_idx\` ON \`artworks\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`artworks__status_idx\` ON \`artworks\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_artworks_v_version_categories\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_artworks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_categories_order_idx\` ON \`_artworks_v_version_categories\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_categories_parent_idx\` ON \`_artworks_v_version_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_artworks_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_catalog_number\` numeric,
  	\`version_image_id\` integer,
  	\`version_medium\` text,
  	\`version_dimensions\` text,
  	\`version_year\` numeric,
  	\`version_availability\` text,
  	\`version_price_display\` text,
  	\`version_description\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_sort_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_artworks_v_parent_idx\` ON \`_artworks_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_version_slug_idx\` ON \`_artworks_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_version_image_idx\` ON \`_artworks_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_version_updated_at_idx\` ON \`_artworks_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_version_created_at_idx\` ON \`_artworks_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_version_version__status_idx\` ON \`_artworks_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_created_at_idx\` ON \`_artworks_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_updated_at_idx\` ON \`_artworks_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_artworks_v_latest_idx\` ON \`_artworks_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`image_id\` integer,
  	\`category\` text,
  	\`price\` numeric,
  	\`price_display\` text,
  	\`product_status\` text DEFAULT 'coming-soon',
  	\`description\` text,
  	\`related_artwork_id\` integer,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`related_artwork_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_image_idx\` ON \`products\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_related_artwork_idx\` ON \`products\` (\`related_artwork_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_image_id\` integer,
  	\`version_category\` text,
  	\`version_price\` numeric,
  	\`version_price_display\` text,
  	\`version_product_status\` text DEFAULT 'coming-soon',
  	\`version_description\` text,
  	\`version_related_artwork_id\` integer,
  	\`version_sort_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_related_artwork_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_image_idx\` ON \`_products_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_related_artwork_idx\` ON \`_products_v\` (\`version_related_artwork_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`journal_posts_categories\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`journal_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`journal_posts_categories_order_idx\` ON \`journal_posts_categories\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_categories_parent_idx\` ON \`journal_posts_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`journal_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`cover_image_id\` integer,
  	\`published_date\` text,
  	\`excerpt\` text,
  	\`content\` text,
  	\`featured\` integer DEFAULT false,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`journal_posts_slug_idx\` ON \`journal_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_cover_image_idx\` ON \`journal_posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_updated_at_idx\` ON \`journal_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_created_at_idx\` ON \`journal_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts__status_idx\` ON \`journal_posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_journal_posts_v_version_categories\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_journal_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_categories_order_idx\` ON \`_journal_posts_v_version_categories\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_categories_parent_idx\` ON \`_journal_posts_v_version_categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_journal_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_cover_image_id\` integer,
  	\`version_published_date\` text,
  	\`version_excerpt\` text,
  	\`version_content\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_sort_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`journal_posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_parent_idx\` ON \`_journal_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_slug_idx\` ON \`_journal_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_cover_image_idx\` ON \`_journal_posts_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_updated_at_idx\` ON \`_journal_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_created_at_idx\` ON \`_journal_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version__status_idx\` ON \`_journal_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_created_at_idx\` ON \`_journal_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_updated_at_idx\` ON \`_journal_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_latest_idx\` ON \`_journal_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`subscribers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`source\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`subscribers_email_idx\` ON \`subscribers\` (\`email\`);`)
  await db.run(sql`CREATE INDEX \`subscribers_updated_at_idx\` ON \`subscribers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`subscribers_created_at_idx\` ON \`subscribers\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`markets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`location\` text,
  	\`status\` text,
  	\`date_info\` text,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`markets_updated_at_idx\` ON \`markets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`markets_created_at_idx\` ON \`markets\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`type\` text,
  	\`artwork_id\` integer,
  	\`message\` text NOT NULL,
  	\`status\` text DEFAULT 'new',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`artwork_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_artwork_idx\` ON \`inquiries\` (\`artwork_id\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`artworks_id\` integer,
  	\`products_id\` integer,
  	\`journal_posts_id\` integer,
  	\`subscribers_id\` integer,
  	\`markets_id\` integer,
  	\`inquiries_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`artworks_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`journal_posts_id\`) REFERENCES \`journal_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`subscribers_id\`) REFERENCES \`subscribers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`markets_id\`) REFERENCES \`markets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_artworks_id_idx\` ON \`payload_locked_documents_rels\` (\`artworks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_journal_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`journal_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_subscribers_id_idx\` ON \`payload_locked_documents_rels\` (\`subscribers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_markets_id_idx\` ON \`payload_locked_documents_rels\` (\`markets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`handle\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_order_idx\` ON \`site_settings_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_parent_id_idx\` ON \`site_settings_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'Belu Malu',
  	\`tagline\` text DEFAULT 'Chilean artist, based in the U.S.',
  	\`logo_id\` integer,
  	\`contact_email\` text DEFAULT 'hello@belumalu.com',
  	\`copyright_text\` text DEFAULT '© 2026 Belu Malu · Art by Belu Maluenda',
  	\`footer_text\` text DEFAULT 'Made and shared for the joy of it. Thank you for supporting the dream.',
  	\`email_signup_heading\` text DEFAULT 'Join the journey',
  	\`email_signup_body\` text DEFAULT 'New work, stories, and market dates.',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text DEFAULT 'Chilean artist, based in the U.S.',
  	\`hero_date_label\` text DEFAULT 'Studio journal, 2026',
  	\`hero_headline\` text DEFAULT 'Art rooted in
  movement, memory,
  and joy.',
  	\`hero_highlight_word\` text DEFAULT 'joy',
  	\`hero_subtext\` text DEFAULT 'I''m Belu, a Chilean artist based in the U.S. I create playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life.',
  	\`hero_featured_artwork_id\` integer,
  	\`hero_portrait_id\` integer,
  	\`featured_artwork_id\` integer,
  	\`featured_description\` text DEFAULT 'A spinning bloom of colour built from one cat, endless patience, and a little obsession with symmetry.',
  	\`statement_portrait_id\` integer,
  	\`statement_quote\` text DEFAULT 'Born in Santiago and raised in the U.S., I''ve always had one foot in each world. My art is where they finally meet.',
  	\`statement_attribution\` text DEFAULT 'Belu Maluenda, artist',
  	\`shop_heading\` text DEFAULT 'A new collection is on the way.',
  	\`shop_body\` text DEFAULT 'Support the dream, take something home from an ever-evolving collection. I''m deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access.',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_featured_artwork_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_artwork_id\`) REFERENCES \`artworks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`statement_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_hero_featured_artwork_idx\` ON \`home_page\` (\`hero_featured_artwork_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_hero_portrait_idx\` ON \`home_page\` (\`hero_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_featured_artwork_idx\` ON \`home_page\` (\`featured_artwork_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_statement_portrait_idx\` ON \`home_page\` (\`statement_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	\`journal_posts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`journal_posts_id\`) REFERENCES \`journal_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_rels_order_idx\` ON \`home_page_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_parent_idx\` ON \`home_page_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_path_idx\` ON \`home_page_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_products_id_idx\` ON \`home_page_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_rels_journal_posts_id_idx\` ON \`home_page_rels\` (\`journal_posts_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_chapters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_chapters_order_idx\` ON \`about_page_chapters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_chapters_parent_id_idx\` ON \`about_page_chapters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_journey_stops\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`place\` text NOT NULL,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_journey_stops_order_idx\` ON \`about_page_journey_stops\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_journey_stops_parent_id_idx\` ON \`about_page_journey_stops\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`intro\` text DEFAULT 'Born in Santiago, Chile but raised in the U.S., I always felt like I had one foot in either country, and that there was always a part of my identity I couldn''t fully express.',
  	\`pull_quote\` text DEFAULT 'Who I am is not rooted in where I come from, but in the things I love to do.',
  	\`pull_quote_attribution\` text DEFAULT 'Belu Maluenda',
  	\`studio_portrait_id\` integer,
  	\`studio_heading\` text DEFAULT 'Made by hand, shared with heart',
  	\`studio_text\` text DEFAULT 'Most days you''ll find me with a brush in one hand and a coffee in the other, chasing colour and trying to make something that feels alive. Everything here is made by me, in small batches, for the love of it.',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`studio_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_studio_portrait_idx\` ON \`about_page\` (\`studio_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`connect_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`lead_text\` text DEFAULT 'For commission inquiries, originals, stockist or wholesale questions, or just to say hi, I''d love to hear from you. I read every message myself.',
  	\`in_person_text\` text DEFAULT 'In person, find Belu Malu tees, prints, and stickers at every Abstract Denver location.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`shop_page_product_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`price_range\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`shop_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`shop_page_product_categories_order_idx\` ON \`shop_page_product_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`shop_page_product_categories_parent_id_idx\` ON \`shop_page_product_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`shop_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text DEFAULT 'A new collection is on the way.',
  	\`body_text\` text DEFAULT 'Hey there, thanks for stopping by my lil'' shop. I''m deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access, or reach out if you''re looking for an original, commission, or retired favourite.',
  	\`signature\` text DEFAULT 'Thank you for the support. love, Belu',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`artworks_categories\`;`)
  await db.run(sql`DROP TABLE \`artworks\`;`)
  await db.run(sql`DROP TABLE \`_artworks_v_version_categories\`;`)
  await db.run(sql`DROP TABLE \`_artworks_v\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`journal_posts_categories\`;`)
  await db.run(sql`DROP TABLE \`journal_posts\`;`)
  await db.run(sql`DROP TABLE \`_journal_posts_v_version_categories\`;`)
  await db.run(sql`DROP TABLE \`_journal_posts_v\`;`)
  await db.run(sql`DROP TABLE \`subscribers\`;`)
  await db.run(sql`DROP TABLE \`markets\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_settings_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page_rels\`;`)
  await db.run(sql`DROP TABLE \`about_page_chapters\`;`)
  await db.run(sql`DROP TABLE \`about_page_journey_stops\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`connect_page\`;`)
  await db.run(sql`DROP TABLE \`shop_page_product_categories\`;`)
  await db.run(sql`DROP TABLE \`shop_page\`;`)
}
