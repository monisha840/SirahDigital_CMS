import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_posts_feed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_posts_feed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_blocks_posts_feed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_blocks_posts_feed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_blocks_posts_feed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_blocks_posts_feed" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_posts_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_posts_feed" CASCADE;
  DROP TABLE "products_blocks_posts_feed" CASCADE;
  DROP TABLE "_products_v_blocks_posts_feed" CASCADE;
  DROP TABLE "posts_tags" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_tags" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "authors_socials" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "_authors_v_version_socials" CASCADE;
  DROP TABLE "_authors_v" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "homepage_blocks_posts_feed" CASCADE;
  DROP TABLE "_homepage_v_blocks_posts_feed" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_posts_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_posts_fk";
  
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_posts_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_authors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "homepage_rels" DROP CONSTRAINT "homepage_rels_posts_fk";
  
  ALTER TABLE "_homepage_v_rels" DROP CONSTRAINT "_homepage_v_rels_posts_fk";
  
  DROP INDEX "pages_rels_posts_id_idx";
  DROP INDEX "_pages_v_rels_posts_id_idx";
  DROP INDEX "products_rels_posts_id_idx";
  DROP INDEX "_products_v_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_authors_id_idx";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX "homepage_rels_posts_id_idx";
  DROP INDEX "_homepage_v_rels_posts_id_idx";
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "pages_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "products_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_products_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "homepage_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_homepage_v_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_pages_blocks_posts_feed_mode";
  DROP TYPE "public"."enum__pages_v_blocks_posts_feed_mode";
  DROP TYPE "public"."enum_products_blocks_posts_feed_mode";
  DROP TYPE "public"."enum__products_v_blocks_posts_feed_mode";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_authors_socials_label";
  DROP TYPE "public"."enum_authors_status";
  DROP TYPE "public"."enum__authors_v_version_socials_label";
  DROP TYPE "public"."enum__authors_v_version_status";
  DROP TYPE "public"."enum_homepage_blocks_posts_feed_mode";
  DROP TYPE "public"."enum__homepage_v_blocks_posts_feed_mode";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum_products_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__products_v_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_authors_socials_label" AS ENUM('LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub');
  CREATE TYPE "public"."enum_authors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__authors_v_version_socials_label" AS ENUM('LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub');
  CREATE TYPE "public"."enum__authors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_homepage_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__homepage_v_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TABLE "pages_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mode" "enum_pages_blocks_posts_feed_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"category_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mode" "enum__pages_v_blocks_posts_feed_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"category_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mode" "enum_products_blocks_posts_feed_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"category_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mode" "enum__products_v_blocks_posts_feed_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"category_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"reading_time" numeric,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"author_id" integer,
  	"category_id" integer,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_reading_time" numeric,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_author_id" integer,
  	"version_category_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "authors_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" "enum_authors_socials_label",
  	"href" varchar
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"team_member_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_authors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_authors_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" "enum__authors_v_version_socials_label",
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_authors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_bio" varchar,
  	"version_photo_id" integer,
  	"version_team_member_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__authors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"color" varchar,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mode" "enum_homepage_blocks_posts_feed_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"category_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_posts_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mode" "enum__homepage_v_blocks_posts_feed_mode" DEFAULT 'latest',
  	"limit" numeric DEFAULT 3,
  	"category_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "products_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_products_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "authors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "homepage_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_homepage_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "pages_blocks_posts_feed" ADD CONSTRAINT "pages_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_posts_feed" ADD CONSTRAINT "pages_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_feed" ADD CONSTRAINT "_pages_v_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_feed" ADD CONSTRAINT "_pages_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_posts_feed" ADD CONSTRAINT "products_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_posts_feed" ADD CONSTRAINT "products_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_posts_feed" ADD CONSTRAINT "_products_v_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_posts_feed" ADD CONSTRAINT "_products_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors_socials" ADD CONSTRAINT "authors_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_team_member_id_team_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v_version_socials" ADD CONSTRAINT "_authors_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_parent_id_authors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_team_member_id_team_id_fk" FOREIGN KEY ("version_team_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_posts_feed" ADD CONSTRAINT "homepage_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_posts_feed" ADD CONSTRAINT "homepage_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_posts_feed" ADD CONSTRAINT "_homepage_v_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_posts_feed" ADD CONSTRAINT "_homepage_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_posts_feed_order_idx" ON "pages_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_posts_feed_parent_id_idx" ON "pages_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_posts_feed_path_idx" ON "pages_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "pages_blocks_posts_feed_category_idx" ON "pages_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_posts_feed_order_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_posts_feed_parent_id_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_posts_feed_path_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_posts_feed_category_idx" ON "_pages_v_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "products_blocks_posts_feed_order_idx" ON "products_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "products_blocks_posts_feed_parent_id_idx" ON "products_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_posts_feed_path_idx" ON "products_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "products_blocks_posts_feed_category_idx" ON "products_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "_products_v_blocks_posts_feed_order_idx" ON "_products_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_posts_feed_parent_id_idx" ON "_products_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_posts_feed_path_idx" ON "_products_v_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_posts_feed_category_idx" ON "_products_v_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "authors_socials_order_idx" ON "authors_socials" USING btree ("_order");
  CREATE INDEX "authors_socials_parent_id_idx" ON "authors_socials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX "authors_team_member_idx" ON "authors" USING btree ("team_member_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE INDEX "authors__status_idx" ON "authors" USING btree ("_status");
  CREATE INDEX "_authors_v_version_socials_order_idx" ON "_authors_v_version_socials" USING btree ("_order");
  CREATE INDEX "_authors_v_version_socials_parent_id_idx" ON "_authors_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_authors_v_parent_idx" ON "_authors_v" USING btree ("parent_id");
  CREATE INDEX "_authors_v_version_version_slug_idx" ON "_authors_v" USING btree ("version_slug");
  CREATE INDEX "_authors_v_version_version_photo_idx" ON "_authors_v" USING btree ("version_photo_id");
  CREATE INDEX "_authors_v_version_version_team_member_idx" ON "_authors_v" USING btree ("version_team_member_id");
  CREATE INDEX "_authors_v_version_version_updated_at_idx" ON "_authors_v" USING btree ("version_updated_at");
  CREATE INDEX "_authors_v_version_version_created_at_idx" ON "_authors_v" USING btree ("version_created_at");
  CREATE INDEX "_authors_v_version_version__status_idx" ON "_authors_v" USING btree ("version__status");
  CREATE INDEX "_authors_v_created_at_idx" ON "_authors_v" USING btree ("created_at");
  CREATE INDEX "_authors_v_updated_at_idx" ON "_authors_v" USING btree ("updated_at");
  CREATE INDEX "_authors_v_latest_idx" ON "_authors_v" USING btree ("latest");
  CREATE INDEX "_authors_v_autosave_idx" ON "_authors_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_seo_seo_og_image_idx" ON "categories" USING btree ("seo_og_image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "homepage_blocks_posts_feed_order_idx" ON "homepage_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "homepage_blocks_posts_feed_parent_id_idx" ON "homepage_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_posts_feed_path_idx" ON "homepage_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "homepage_blocks_posts_feed_category_idx" ON "homepage_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "_homepage_v_blocks_posts_feed_order_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_posts_feed_parent_id_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_posts_feed_path_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_posts_feed_category_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("category_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "products_rels_posts_id_idx" ON "products_rels" USING btree ("posts_id");
  CREATE INDEX "_products_v_rels_posts_id_idx" ON "_products_v_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "homepage_rels" USING btree ("posts_id");
  CREATE INDEX "_homepage_v_rels_posts_id_idx" ON "_homepage_v_rels" USING btree ("posts_id");
  ALTER TABLE "media" DROP COLUMN "prefix";`)
}
