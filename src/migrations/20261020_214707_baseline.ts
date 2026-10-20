import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_artworks_categories" AS ENUM('originals', 'prints', 'mandalas', 'cats', 'murals');
  CREATE TYPE "public"."enum_artworks_availability" AS ENUM('available', 'sold', 'prints-only', 'inquiry');
  CREATE TYPE "public"."enum_artworks_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__artworks_v_version_categories" AS ENUM('originals', 'prints', 'mandalas', 'cats', 'murals');
  CREATE TYPE "public"."enum__artworks_v_version_availability" AS ENUM('available', 'sold', 'prints-only', 'inquiry');
  CREATE TYPE "public"."enum__artworks_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_category" AS ENUM('originals', 'prints', 'wearable', 'small-joys');
  CREATE TYPE "public"."enum_products_product_status" AS ENUM('available', 'coming-soon', 'sold-out');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_category" AS ENUM('originals', 'prints', 'wearable', 'small-joys');
  CREATE TYPE "public"."enum__products_v_version_product_status" AS ENUM('available', 'coming-soon', 'sold-out');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_journal_posts_categories" AS ENUM('adventure', 'travel', 'creativity', 'essays');
  CREATE TYPE "public"."enum_journal_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_posts_v_version_categories" AS ENUM('adventure', 'travel', 'creativity', 'essays');
  CREATE TYPE "public"."enum__journal_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_subscribers_source" AS ENUM('home', 'shop', 'journal', 'footer', 'cart');
  CREATE TYPE "public"."enum_markets_status" AS ENUM('live', 'upcoming', 'tba');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('commission', 'original', 'wholesale', 'general');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'replied', 'closed');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('instagram', 'ebay', 'reddit', 'discord', 'facebook', 'tiktok', 'youtube');
  CREATE TYPE "public"."enum_site_settings_alert_pages" AS ENUM('home', 'shop', 'gallery', 'journal', 'about');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_gallery_url" varchar,
  	"sizes_gallery_width" numeric,
  	"sizes_gallery_height" numeric,
  	"sizes_gallery_mime_type" varchar,
  	"sizes_gallery_filesize" numeric,
  	"sizes_gallery_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "artworks_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_artworks_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "artworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"catalog_number" numeric,
  	"image_id" integer,
  	"medium" varchar,
  	"dimensions" varchar,
  	"year" numeric,
  	"availability" "enum_artworks_availability",
  	"price_display" varchar,
  	"description" jsonb,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_artworks_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_artworks_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__artworks_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_artworks_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_catalog_number" numeric,
  	"version_image_id" integer,
  	"version_medium" varchar,
  	"version_dimensions" varchar,
  	"version_year" numeric,
  	"version_availability" "enum__artworks_v_version_availability",
  	"version_price_display" varchar,
  	"version_description" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__artworks_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"image_id" integer,
  	"category" "enum_products_category",
  	"price" numeric,
  	"price_display" varchar,
  	"product_status" "enum_products_product_status" DEFAULT 'coming-soon',
  	"description" jsonb,
  	"related_artwork_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_category" "enum__products_v_version_category",
  	"version_price" numeric,
  	"version_price_display" varchar,
  	"version_product_status" "enum__products_v_version_product_status" DEFAULT 'coming-soon',
  	"version_description" jsonb,
  	"version_related_artwork_id" integer,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "journal_posts_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_journal_posts_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "journal_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"cover_image_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"content" jsonb,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_journal_posts_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__journal_posts_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_journal_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_cover_image_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"source" "enum_subscribers_source",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "markets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"location" varchar,
  	"status" "enum_markets_status",
  	"date_info" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"type" "enum_inquiries_type",
  	"artwork_id" integer,
  	"message" varchar NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"artworks_id" integer,
  	"products_id" integer,
  	"journal_posts_id" integer,
  	"subscribers_id" integer,
  	"markets_id" integer,
  	"inquiries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"handle" varchar
  );
  
  CREATE TABLE "site_settings_alert_pages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_alert_pages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Belu Malu',
  	"tagline" varchar DEFAULT 'Chilean artist, based in the U.S.',
  	"logo_id" integer,
  	"contact_email" varchar DEFAULT 'hello@belumalu.com',
  	"copyright_text" varchar DEFAULT '© 2026 Belu Malu · Art by Belu Maluenda',
  	"alert_enabled" boolean DEFAULT false,
  	"alert_heading" varchar DEFAULT 'A new collection is on the way.',
  	"alert_body" varchar,
  	"alert_signature" varchar,
  	"footer_text" varchar DEFAULT 'Made and shared for the joy of it. Thank you for supporting the dream.',
  	"email_signup_heading" varchar DEFAULT 'Join the journey',
  	"email_signup_body" varchar DEFAULT 'New work, stories, and market dates.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Chilean artist, based in the U.S.',
  	"hero_date_label" varchar DEFAULT 'Studio journal, 2026',
  	"hero_headline" varchar DEFAULT 'Art rooted in
  movement, memory,
  and joy.',
  	"hero_highlight_word" varchar DEFAULT 'joy',
  	"hero_subtext" varchar DEFAULT 'I''m Belu, a Chilean artist based in the U.S. I create playful, meaningful artwork inspired by memory, travel, heritage, and the wild beauty of everyday life.',
  	"hero_featured_artwork_id" integer,
  	"hero_portrait_id" integer,
  	"featured_artwork_id" integer,
  	"featured_description" varchar DEFAULT 'A spinning bloom of colour built from one cat, endless patience, and a little obsession with symmetry.',
  	"statement_portrait_id" integer,
  	"statement_quote" varchar DEFAULT 'Born in Santiago and raised in the U.S., I''ve always had one foot in each world. My art is where they finally meet.',
  	"statement_attribution" varchar DEFAULT 'Belu Maluenda, artist',
  	"shop_heading" varchar DEFAULT 'A new collection is on the way.',
  	"shop_body" varchar DEFAULT 'Support the dream, take something home from an ever-evolving collection. I''m deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"journal_posts_id" integer
  );
  
  CREATE TABLE "about_page_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "about_page_journey_stops" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"place" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro" varchar DEFAULT 'Born in Santiago, Chile but raised in the U.S., I always felt like I had one foot in either country, and that there was always a part of my identity I couldn''t fully express.',
  	"pull_quote" varchar DEFAULT 'Who I am is not rooted in where I come from, but in the things I love to do.',
  	"pull_quote_attribution" varchar DEFAULT 'Belu Maluenda',
  	"studio_portrait_id" integer,
  	"studio_heading" varchar DEFAULT 'Made by hand, shared with heart',
  	"studio_text" varchar DEFAULT 'Most days you''ll find me with a brush in one hand and a coffee in the other, chasing colour and trying to make something that feels alive. Everything here is made by me, in small batches, for the love of it.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "connect_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_text" varchar DEFAULT 'For commission inquiries, originals, stockist or wholesale questions, or just to say hi, I''d love to hear from you. I read every message myself.',
  	"in_person_text" varchar DEFAULT 'In person, find Belu Malu tees, prints, and stickers at every Abstract Denver location.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "shop_page_product_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"price_range" varchar
  );
  
  CREATE TABLE "shop_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'A new collection is on the way.',
  	"body_text" varchar DEFAULT 'Hey there, thanks for stopping by my lil'' shop. I''m deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access, or reach out if you''re looking for an original, commission, or retired favourite.',
  	"signature" varchar DEFAULT 'Thank you for the support. love, Belu',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks_categories" ADD CONSTRAINT "artworks_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "artworks" ADD CONSTRAINT "artworks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v_version_categories" ADD CONSTRAINT "_artworks_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_artworks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_parent_id_artworks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_artworks_v" ADD CONSTRAINT "_artworks_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_related_artwork_id_artworks_id_fk" FOREIGN KEY ("related_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_related_artwork_id_artworks_id_fk" FOREIGN KEY ("version_related_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts_categories" ADD CONSTRAINT "journal_posts_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_version_categories" ADD CONSTRAINT "_journal_posts_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_parent_id_journal_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_artworks_fk" FOREIGN KEY ("artworks_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_alert_pages" ADD CONSTRAINT "site_settings_alert_pages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_featured_artwork_id_artworks_id_fk" FOREIGN KEY ("hero_featured_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_featured_artwork_id_artworks_id_fk" FOREIGN KEY ("featured_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_statement_portrait_id_media_id_fk" FOREIGN KEY ("statement_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_chapters" ADD CONSTRAINT "about_page_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_journey_stops" ADD CONSTRAINT "about_page_journey_stops_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_studio_portrait_id_media_id_fk" FOREIGN KEY ("studio_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shop_page_product_categories" ADD CONSTRAINT "shop_page_product_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shop_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_gallery_sizes_gallery_filename_idx" ON "media" USING btree ("sizes_gallery_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "artworks_categories_order_idx" ON "artworks_categories" USING btree ("order");
  CREATE INDEX "artworks_categories_parent_idx" ON "artworks_categories" USING btree ("parent_id");
  CREATE UNIQUE INDEX "artworks_slug_idx" ON "artworks" USING btree ("slug");
  CREATE INDEX "artworks_image_idx" ON "artworks" USING btree ("image_id");
  CREATE INDEX "artworks_updated_at_idx" ON "artworks" USING btree ("updated_at");
  CREATE INDEX "artworks_created_at_idx" ON "artworks" USING btree ("created_at");
  CREATE INDEX "artworks__status_idx" ON "artworks" USING btree ("_status");
  CREATE INDEX "_artworks_v_version_categories_order_idx" ON "_artworks_v_version_categories" USING btree ("order");
  CREATE INDEX "_artworks_v_version_categories_parent_idx" ON "_artworks_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_artworks_v_parent_idx" ON "_artworks_v" USING btree ("parent_id");
  CREATE INDEX "_artworks_v_version_version_slug_idx" ON "_artworks_v" USING btree ("version_slug");
  CREATE INDEX "_artworks_v_version_version_image_idx" ON "_artworks_v" USING btree ("version_image_id");
  CREATE INDEX "_artworks_v_version_version_updated_at_idx" ON "_artworks_v" USING btree ("version_updated_at");
  CREATE INDEX "_artworks_v_version_version_created_at_idx" ON "_artworks_v" USING btree ("version_created_at");
  CREATE INDEX "_artworks_v_version_version__status_idx" ON "_artworks_v" USING btree ("version__status");
  CREATE INDEX "_artworks_v_created_at_idx" ON "_artworks_v" USING btree ("created_at");
  CREATE INDEX "_artworks_v_updated_at_idx" ON "_artworks_v" USING btree ("updated_at");
  CREATE INDEX "_artworks_v_latest_idx" ON "_artworks_v" USING btree ("latest");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_related_artwork_idx" ON "products" USING btree ("related_artwork_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_image_idx" ON "_products_v" USING btree ("version_image_id");
  CREATE INDEX "_products_v_version_version_related_artwork_idx" ON "_products_v" USING btree ("version_related_artwork_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "journal_posts_categories_order_idx" ON "journal_posts_categories" USING btree ("order");
  CREATE INDEX "journal_posts_categories_parent_idx" ON "journal_posts_categories" USING btree ("parent_id");
  CREATE UNIQUE INDEX "journal_posts_slug_idx" ON "journal_posts" USING btree ("slug");
  CREATE INDEX "journal_posts_cover_image_idx" ON "journal_posts" USING btree ("cover_image_id");
  CREATE INDEX "journal_posts_updated_at_idx" ON "journal_posts" USING btree ("updated_at");
  CREATE INDEX "journal_posts_created_at_idx" ON "journal_posts" USING btree ("created_at");
  CREATE INDEX "journal_posts__status_idx" ON "journal_posts" USING btree ("_status");
  CREATE INDEX "_journal_posts_v_version_categories_order_idx" ON "_journal_posts_v_version_categories" USING btree ("order");
  CREATE INDEX "_journal_posts_v_version_categories_parent_idx" ON "_journal_posts_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_journal_posts_v_parent_idx" ON "_journal_posts_v" USING btree ("parent_id");
  CREATE INDEX "_journal_posts_v_version_version_slug_idx" ON "_journal_posts_v" USING btree ("version_slug");
  CREATE INDEX "_journal_posts_v_version_version_cover_image_idx" ON "_journal_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_journal_posts_v_version_version_updated_at_idx" ON "_journal_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_posts_v_version_version_created_at_idx" ON "_journal_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_posts_v_version_version__status_idx" ON "_journal_posts_v" USING btree ("version__status");
  CREATE INDEX "_journal_posts_v_created_at_idx" ON "_journal_posts_v" USING btree ("created_at");
  CREATE INDEX "_journal_posts_v_updated_at_idx" ON "_journal_posts_v" USING btree ("updated_at");
  CREATE INDEX "_journal_posts_v_latest_idx" ON "_journal_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "markets_updated_at_idx" ON "markets" USING btree ("updated_at");
  CREATE INDEX "markets_created_at_idx" ON "markets" USING btree ("created_at");
  CREATE INDEX "inquiries_artwork_idx" ON "inquiries" USING btree ("artwork_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_artworks_id_idx" ON "payload_locked_documents_rels" USING btree ("artworks_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_journal_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_posts_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_markets_id_idx" ON "payload_locked_documents_rels" USING btree ("markets_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_alert_pages_order_idx" ON "site_settings_alert_pages" USING btree ("order");
  CREATE INDEX "site_settings_alert_pages_parent_idx" ON "site_settings_alert_pages" USING btree ("parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "home_page_hero_featured_artwork_idx" ON "home_page" USING btree ("hero_featured_artwork_id");
  CREATE INDEX "home_page_hero_portrait_idx" ON "home_page" USING btree ("hero_portrait_id");
  CREATE INDEX "home_page_featured_artwork_idx" ON "home_page" USING btree ("featured_artwork_id");
  CREATE INDEX "home_page_statement_portrait_idx" ON "home_page" USING btree ("statement_portrait_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_products_id_idx" ON "home_page_rels" USING btree ("products_id");
  CREATE INDEX "home_page_rels_journal_posts_id_idx" ON "home_page_rels" USING btree ("journal_posts_id");
  CREATE INDEX "about_page_chapters_order_idx" ON "about_page_chapters" USING btree ("_order");
  CREATE INDEX "about_page_chapters_parent_id_idx" ON "about_page_chapters" USING btree ("_parent_id");
  CREATE INDEX "about_page_journey_stops_order_idx" ON "about_page_journey_stops" USING btree ("_order");
  CREATE INDEX "about_page_journey_stops_parent_id_idx" ON "about_page_journey_stops" USING btree ("_parent_id");
  CREATE INDEX "about_page_studio_portrait_idx" ON "about_page" USING btree ("studio_portrait_id");
  CREATE INDEX "shop_page_product_categories_order_idx" ON "shop_page_product_categories" USING btree ("_order");
  CREATE INDEX "shop_page_product_categories_parent_id_idx" ON "shop_page_product_categories" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "artworks_categories" CASCADE;
  DROP TABLE "artworks" CASCADE;
  DROP TABLE "_artworks_v_version_categories" CASCADE;
  DROP TABLE "_artworks_v" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "journal_posts_categories" CASCADE;
  DROP TABLE "journal_posts" CASCADE;
  DROP TABLE "_journal_posts_v_version_categories" CASCADE;
  DROP TABLE "_journal_posts_v" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "markets" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_alert_pages" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "about_page_chapters" CASCADE;
  DROP TABLE "about_page_journey_stops" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "connect_page" CASCADE;
  DROP TABLE "shop_page_product_categories" CASCADE;
  DROP TABLE "shop_page" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_artworks_categories";
  DROP TYPE "public"."enum_artworks_availability";
  DROP TYPE "public"."enum_artworks_status";
  DROP TYPE "public"."enum__artworks_v_version_categories";
  DROP TYPE "public"."enum__artworks_v_version_availability";
  DROP TYPE "public"."enum__artworks_v_version_status";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_products_product_status";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_category";
  DROP TYPE "public"."enum__products_v_version_product_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_journal_posts_categories";
  DROP TYPE "public"."enum_journal_posts_status";
  DROP TYPE "public"."enum__journal_posts_v_version_categories";
  DROP TYPE "public"."enum__journal_posts_v_version_status";
  DROP TYPE "public"."enum_subscribers_source";
  DROP TYPE "public"."enum_markets_status";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_site_settings_alert_pages";`)
}
