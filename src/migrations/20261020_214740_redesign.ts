import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_markets_event_type" AS ENUM('market', 'pop-up', 'festival', 'exhibition', 'workshop', 'stockist');
  CREATE TYPE "public"."enum_promotions_target_pages" AS ENUM('all', 'home', 'shop', 'gallery', 'events', 'about', 'connect');
  CREATE TYPE "public"."enum_promotions_campaign_type" AS ENUM('sale', 'launch', 'event', 'newsletter');
  CREATE TYPE "public"."enum_promotions_display" AS ENUM('modal', 'banner');
  CREATE TYPE "public"."enum_promotions_dismiss_frequency" AS ENUM('never', 'session', '1', '7', '30');
  ALTER TYPE "public"."enum_subscribers_source" ADD VALUE 'events' BEFORE 'footer';
  ALTER TYPE "public"."enum_subscribers_source" ADD VALUE 'contact' BEFORE 'footer';
  ALTER TYPE "public"."enum_subscribers_source" ADD VALUE 'promo' BEFORE 'footer';
  ALTER TYPE "public"."enum_markets_status" ADD VALUE 'past';
  ALTER TYPE "public"."enum_inquiries_type" ADD VALUE 'event' BEFORE 'general';
  CREATE TABLE "promotions_target_pages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_promotions_target_pages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "promotions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"campaign_type" "enum_promotions_campaign_type" DEFAULT 'sale',
  	"display" "enum_promotions_display" DEFAULT 'modal',
  	"headline" varchar NOT NULL,
  	"body" varchar,
  	"image_id" integer,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"enabled" boolean DEFAULT false,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"trigger_delay" numeric DEFAULT 6,
  	"dismiss_frequency" "enum_promotions_dismiss_frequency" DEFAULT '7',
  	"priority" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "press_mentions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"outlet" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"quote" varchar,
  	"url" varchar,
  	"logo_id" integer,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "site_settings_alert_pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_alert_pages" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_featured_artwork_id_artworks_id_fk";
  
  ALTER TABLE "home_page_rels" DROP CONSTRAINT "home_page_rels_journal_posts_fk";
  
  DROP INDEX "site_settings_logo_idx";
  DROP INDEX "home_page_featured_artwork_idx";
  DROP INDEX "home_page_rels_journal_posts_id_idx";
  ALTER TABLE "markets" ALTER COLUMN "status" SET DEFAULT 'upcoming';
  ALTER TABLE "site_settings" ALTER COLUMN "footer_text" SET DEFAULT 'Original paintings, fine art prints, and wearable art, made by hand.';
  ALTER TABLE "site_settings" ALTER COLUMN "email_signup_body" SET DEFAULT 'New work, print drops, and event dates.';
  ALTER TABLE "home_page" ALTER COLUMN "hero_date_label" SET DEFAULT 'Art, prints & events · 2026';
  ALTER TABLE "markets" ADD COLUMN "event_type" "enum_markets_event_type" DEFAULT 'market';
  ALTER TABLE "markets" ADD COLUMN "start_date" timestamp(3) with time zone;
  ALTER TABLE "markets" ADD COLUMN "end_date" timestamp(3) with time zone;
  ALTER TABLE "markets" ADD COLUMN "image_id" integer;
  ALTER TABLE "markets" ADD COLUMN "url" varchar;
  ALTER TABLE "inquiries" ADD COLUMN "newsletter_opt_in" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "promotions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "press_mentions_id" integer;
  ALTER TABLE "connect_page" ADD COLUMN "newsletter_consent_text" varchar DEFAULT 'Yes, add me to Belu''s email list for new work, print drops, and event dates. Unsubscribe anytime.';
  ALTER TABLE "promotions_target_pages" ADD CONSTRAINT "promotions_target_pages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotions" ADD CONSTRAINT "promotions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "press_mentions" ADD CONSTRAINT "press_mentions_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "promotions_target_pages_order_idx" ON "promotions_target_pages" USING btree ("order");
  CREATE INDEX "promotions_target_pages_parent_idx" ON "promotions_target_pages" USING btree ("parent_id");
  CREATE INDEX "promotions_image_idx" ON "promotions" USING btree ("image_id");
  CREATE INDEX "promotions_updated_at_idx" ON "promotions" USING btree ("updated_at");
  CREATE INDEX "promotions_created_at_idx" ON "promotions" USING btree ("created_at");
  CREATE INDEX "press_mentions_logo_idx" ON "press_mentions" USING btree ("logo_id");
  CREATE INDEX "press_mentions_updated_at_idx" ON "press_mentions" USING btree ("updated_at");
  CREATE INDEX "press_mentions_created_at_idx" ON "press_mentions" USING btree ("created_at");
  ALTER TABLE "markets" ADD CONSTRAINT "markets_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotions_fk" FOREIGN KEY ("promotions_id") REFERENCES "public"."promotions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_mentions_fk" FOREIGN KEY ("press_mentions_id") REFERENCES "public"."press_mentions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "markets_image_idx" ON "markets" USING btree ("image_id");
  CREATE INDEX "payload_locked_documents_rels_promotions_id_idx" ON "payload_locked_documents_rels" USING btree ("promotions_id");
  CREATE INDEX "payload_locked_documents_rels_press_mentions_id_idx" ON "payload_locked_documents_rels" USING btree ("press_mentions_id");
  ALTER TABLE "site_settings" DROP COLUMN "site_name";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "alert_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "alert_heading";
  ALTER TABLE "site_settings" DROP COLUMN "alert_body";
  ALTER TABLE "site_settings" DROP COLUMN "alert_signature";
  ALTER TABLE "home_page" DROP COLUMN "featured_artwork_id";
  ALTER TABLE "home_page" DROP COLUMN "featured_description";
  ALTER TABLE "home_page" DROP COLUMN "shop_body";
  ALTER TABLE "home_page_rels" DROP COLUMN "journal_posts_id";
  DROP TYPE "public"."enum_site_settings_alert_pages";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_alert_pages" AS ENUM('home', 'shop', 'gallery', 'journal', 'about');
  CREATE TABLE "site_settings_alert_pages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_alert_pages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "promotions_target_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "promotions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "press_mentions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "promotions_target_pages" CASCADE;
  DROP TABLE "promotions" CASCADE;
  DROP TABLE "press_mentions" CASCADE;
  ALTER TABLE "markets" DROP CONSTRAINT "markets_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_promotions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_press_mentions_fk";
  
  ALTER TABLE "subscribers" ALTER COLUMN "source" SET DATA TYPE text;
  DROP TYPE "public"."enum_subscribers_source";
  CREATE TYPE "public"."enum_subscribers_source" AS ENUM('home', 'shop', 'journal', 'footer', 'cart');
  ALTER TABLE "subscribers" ALTER COLUMN "source" SET DATA TYPE "public"."enum_subscribers_source" USING "source"::"public"."enum_subscribers_source";
  ALTER TABLE "markets" ALTER COLUMN "status" SET DATA TYPE text;
  DROP TYPE "public"."enum_markets_status";
  CREATE TYPE "public"."enum_markets_status" AS ENUM('live', 'upcoming', 'tba');
  ALTER TABLE "markets" ALTER COLUMN "status" SET DATA TYPE "public"."enum_markets_status" USING "status"::"public"."enum_markets_status";
  ALTER TABLE "inquiries" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_inquiries_type";
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('commission', 'original', 'wholesale', 'general');
  ALTER TABLE "inquiries" ALTER COLUMN "type" SET DATA TYPE "public"."enum_inquiries_type" USING "type"::"public"."enum_inquiries_type";
  DROP INDEX "markets_image_idx";
  DROP INDEX "payload_locked_documents_rels_promotions_id_idx";
  DROP INDEX "payload_locked_documents_rels_press_mentions_id_idx";
  ALTER TABLE "markets" ALTER COLUMN "status" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "footer_text" SET DEFAULT 'Made and shared for the joy of it. Thank you for supporting the dream.';
  ALTER TABLE "site_settings" ALTER COLUMN "email_signup_body" SET DEFAULT 'New work, stories, and market dates.';
  ALTER TABLE "home_page" ALTER COLUMN "hero_date_label" SET DEFAULT 'Studio journal, 2026';
  ALTER TABLE "site_settings" ADD COLUMN "site_name" varchar DEFAULT 'Belu Malu';
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar DEFAULT 'Chilean artist, based in the U.S.';
  ALTER TABLE "site_settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "alert_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "alert_heading" varchar DEFAULT 'A new collection is on the way.';
  ALTER TABLE "site_settings" ADD COLUMN "alert_body" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "alert_signature" varchar;
  ALTER TABLE "home_page" ADD COLUMN "featured_artwork_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "featured_description" varchar DEFAULT 'A spinning bloom of colour built from one cat, endless patience, and a little obsession with symmetry.';
  ALTER TABLE "home_page" ADD COLUMN "shop_body" varchar DEFAULT 'Support the dream, take something home from an ever-evolving collection. I''m deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access.';
  ALTER TABLE "home_page_rels" ADD COLUMN "journal_posts_id" integer;
  ALTER TABLE "site_settings_alert_pages" ADD CONSTRAINT "site_settings_alert_pages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_alert_pages_order_idx" ON "site_settings_alert_pages" USING btree ("order");
  CREATE INDEX "site_settings_alert_pages_parent_idx" ON "site_settings_alert_pages" USING btree ("parent_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_featured_artwork_id_artworks_id_fk" FOREIGN KEY ("featured_artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "home_page_featured_artwork_idx" ON "home_page" USING btree ("featured_artwork_id");
  CREATE INDEX "home_page_rels_journal_posts_id_idx" ON "home_page_rels" USING btree ("journal_posts_id");
  ALTER TABLE "markets" DROP COLUMN "event_type";
  ALTER TABLE "markets" DROP COLUMN "start_date";
  ALTER TABLE "markets" DROP COLUMN "end_date";
  ALTER TABLE "markets" DROP COLUMN "image_id";
  ALTER TABLE "markets" DROP COLUMN "url";
  ALTER TABLE "inquiries" DROP COLUMN "newsletter_opt_in";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "promotions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "press_mentions_id";
  ALTER TABLE "connect_page" DROP COLUMN "newsletter_consent_text";
  DROP TYPE "public"."enum_markets_event_type";
  DROP TYPE "public"."enum_promotions_target_pages";
  DROP TYPE "public"."enum_promotions_campaign_type";
  DROP TYPE "public"."enum_promotions_display";
  DROP TYPE "public"."enum_promotions_dismiss_frequency";`)
}
