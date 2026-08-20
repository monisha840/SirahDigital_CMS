import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('prose', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_wall_layout" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum_pages_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('prose', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_wall_layout" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum__pages_v_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_visual" AS ENUM('ai-core', 'communication-hub', 'workflow-engine', 'enterprise-dashboard', 'business-network', 'document-scanner', 'analytics-sphere');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_visual" AS ENUM('ai-core', 'communication-hub', 'workflow-engine', 'enterprise-dashboard', 'business-network', 'document-scanner', 'analytics-sphere');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_industries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__industries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_products_blocks_rich_text_width" AS ENUM('prose', 'wide', 'full');
  CREATE TYPE "public"."enum_products_blocks_testimonial_wall_layout" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum_products_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum_products_blocks_spacer_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_blocks_rich_text_width" AS ENUM('prose', 'wide', 'full');
  CREATE TYPE "public"."enum__products_v_blocks_testimonial_wall_layout" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum__products_v_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__products_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_stage" AS ENUM('production', 'development');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_stage" AS ENUM('production', 'development');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__clients_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_socials_label" AS ENUM('LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub');
  CREATE TYPE "public"."enum_team_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_v_version_socials_label" AS ENUM('LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub');
  CREATE TYPE "public"."enum__team_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_carousel_cards_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__carousel_cards_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_authors_socials_label" AS ENUM('LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub');
  CREATE TYPE "public"."enum_authors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__authors_v_version_socials_label" AS ENUM('LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub');
  CREATE TYPE "public"."enum__authors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'won', 'lost');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('confirmed', 'cancelled');
  CREATE TYPE "public"."enum_slots_status" AS ENUM('open', 'booked', 'cancelled');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'contributor', 'viewer');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'syncBookings', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'syncBookings', 'schedulePublish');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_seo_defaults_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__seo_defaults_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_homepage_blocks_rich_text_width" AS ENUM('prose', 'wide', 'full');
  CREATE TYPE "public"."enum_homepage_blocks_testimonial_wall_layout" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum_homepage_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum_homepage_blocks_spacer_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_blocks_rich_text_width" AS ENUM('prose', 'wide', 'full');
  CREATE TYPE "public"."enum__homepage_v_blocks_testimonial_wall_layout" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum__homepage_v_blocks_posts_feed_mode" AS ENUM('latest', 'featured', 'manual');
  CREATE TYPE "public"."enum__homepage_v_blocks_spacer_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_methodology_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__methodology_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_transformation_story_scenes_status_tone" AS ENUM('alert', 'bolt', 'rocket');
  CREATE TYPE "public"."enum_transformation_story_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__transformation_story_v_version_scenes_status_tone" AS ENUM('alert', 'bolt', 'rocket');
  CREATE TYPE "public"."enum__transformation_story_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_roi_config_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__roi_config_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_message_templates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__message_templates_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'prose',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_industry_orbit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_client_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum_pages_blocks_testimonial_wall_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"explore_more_href" varchar,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages_blocks_transformation_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"placement_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_roi_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_perspective_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_methodology_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"show_in_sitemap" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer,
  	"posts_id" integer,
  	"carousel_cards_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'prose',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_industry_orbit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_client_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum__pages_v_blocks_testimonial_wall_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"explore_more_href" varchar,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_pages_v_blocks_transformation_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"placement_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_roi_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_perspective_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_methodology_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_show_in_sitemap" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer,
  	"posts_id" integer,
  	"carousel_cards_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"slug" varchar,
  	"title" varchar,
  	"desc" varchar,
  	"nav_label" varchar,
  	"icon" varchar,
  	"problem" varchar,
  	"outcome" varchar,
  	"cta_label" varchar,
  	"visual" "enum_services_visual",
  	"system" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_desc" varchar,
  	"version_nav_label" varchar,
  	"version_icon" varchar,
  	"version_problem" varchar,
  	"version_outcome" varchar,
  	"version_cta_label" varchar,
  	"version_visual" "enum__services_v_version_visual",
  	"version_system" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "industries_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "industries_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "industries_workflow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "industries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"slug" varchar,
  	"title" varchar,
  	"desc" varchar,
  	"image_id" integer,
  	"tagline" varchar,
  	"icon" varchar,
  	"accent" varchar,
  	"summary" varchar,
  	"metric_value" varchar,
  	"metric_label" varchar,
  	"guarantee" varchar,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_industries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "industries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_industries_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_workflow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_desc" varchar,
  	"version_image_id" integer,
  	"version_tagline" varchar,
  	"version_icon" varchar,
  	"version_accent" varchar,
  	"version_summary" varchar,
  	"version_metric_value" varchar,
  	"version_metric_label" varchar,
  	"version_guarantee" varchar,
  	"version_seo_title" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__industries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_industries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "products_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "products_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb,
  	"width" "enum_products_blocks_rich_text_width" DEFAULT 'prose',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_service_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_industry_orbit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_client_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_testimonial_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum_products_blocks_testimonial_wall_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"explore_more_href" varchar,
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
  
  CREATE TABLE "products_blocks_transformation_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"placement_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_roi_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_perspective_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_methodology_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "products_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "products_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "products_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "products_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_products_blocks_spacer_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"slug" varchar,
  	"label" varchar DEFAULT 'Product',
  	"title" varchar,
  	"description" varchar,
  	"cta_label" varchar DEFAULT 'Explore',
  	"has_page" boolean DEFAULT false,
  	"hero_image_id" integer,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer,
  	"posts_id" integer,
  	"carousel_cards_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "_products_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb,
  	"width" "enum__products_v_blocks_rich_text_width" DEFAULT 'prose',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_service_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_industry_orbit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_client_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_testimonial_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum__products_v_blocks_testimonial_wall_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"explore_more_href" varchar,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_products_v_blocks_transformation_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"placement_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_roi_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_perspective_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_methodology_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__products_v_blocks_spacer_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_slug" varchar,
  	"version_label" varchar DEFAULT 'Product',
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_cta_label" varchar DEFAULT 'Explore',
  	"version_has_page" boolean DEFAULT false,
  	"version_hero_image_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer,
  	"posts_id" integer,
  	"carousel_cards_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "case_studies_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "case_studies_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"slug" varchar,
  	"stage" "enum_case_studies_stage" DEFAULT 'production',
  	"title" varchar,
  	"desc" varchar,
  	"client_id" integer,
  	"industry_id" integer,
  	"impact" varchar,
  	"phase" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_canonical" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_case_studies_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_slug" varchar,
  	"version_stage" "enum__case_studies_v_version_stage" DEFAULT 'production',
  	"version_title" varchar,
  	"version_desc" varchar,
  	"version_client_id" integer,
  	"version_industry_id" integer,
  	"version_impact" varchar,
  	"version_phase" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"featured" boolean DEFAULT false,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"author_company" varchar,
  	"rating" numeric,
  	"avatar_id" integer,
  	"client_id" integer,
  	"source_url" varchar,
  	"consent_on_file" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_featured" boolean DEFAULT false,
  	"version_quote" varchar,
  	"version_author_name" varchar,
  	"version_author_role" varchar,
  	"version_author_company" varchar,
  	"version_rating" numeric,
  	"version_avatar_id" integer,
  	"version_client_id" integer,
  	"version_source_url" varchar,
  	"version_consent_on_file" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"slug" varchar,
  	"name" varchar,
  	"logo_id" integer,
  	"url" varchar,
  	"industry_id" integer,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_clients_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_clients_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_url" varchar,
  	"version_industry_id" integer,
  	"version_featured" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__clients_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "team_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" "enum_team_socials_label",
  	"href" varchar
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"is_founder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" "enum__team_v_version_socials_label",
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_team_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_bio" varchar,
  	"version_photo_id" integer,
  	"version_is_founder" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"title" varchar,
  	"cover_id" integer,
  	"youtube_url" varchar,
  	"category" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"date" varchar,
  	"theme" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_insights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_title" varchar,
  	"version_cover_id" integer,
  	"version_youtube_url" varchar,
  	"version_category" varchar,
  	"version_description" varchar,
  	"version_duration" varchar,
  	"version_date" varchar,
  	"version_theme" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__insights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "carousel_cards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 100,
  	"image_id" integer,
  	"alt" varchar,
  	"title" varchar,
  	"desc" varchar,
  	"href" varchar,
  	"cta_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_carousel_cards_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_carousel_cards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_image_id" integer,
  	"version_alt" varchar,
  	"version_title" varchar,
  	"version_desc" varchar,
  	"version_href" varchar,
  	"version_cta_label" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__carousel_cards_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"blur_data_u_r_l" varchar,
  	"credit" varchar,
  	"source_path" varchar,
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
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"permanent" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL,
  	"at" timestamp(3) with time zone
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"owner_id" integer,
  	"source_path" varchar,
  	"consent_given_at" timestamp(3) with time zone,
  	"consent_text" varchar,
  	"ip_hash" varchar,
  	"purge_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"calendar_event_id" varchar NOT NULL,
  	"slot_id" integer,
  	"invitee_name" varchar,
  	"invitee_email" varchar NOT NULL,
  	"invitee_phone" varchar,
  	"lead_id" integer,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone,
  	"timezone" varchar DEFAULT 'Asia/Kolkata',
  	"meet_link" varchar,
  	"status" "enum_bookings_status" DEFAULT 'confirmed',
  	"notifications_booked_sent_at" timestamp(3) with time zone,
  	"notifications_team_email_sent_at" timestamp(3) with time zone,
  	"notifications_day_before_sent_at" timestamp(3) with time zone,
  	"notifications_hour_before_sent_at" timestamp(3) with time zone,
  	"notifications_last_error" varchar,
  	"purge_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "slots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"local_date" varchar NOT NULL,
  	"local_time" varchar NOT NULL,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone NOT NULL,
  	"duration_minutes" numeric DEFAULT 45 NOT NULL,
  	"time_zone" varchar DEFAULT 'Asia/Kolkata' NOT NULL,
  	"status" "enum_slots_status" DEFAULT 'open' NOT NULL,
  	"booked_name" varchar,
  	"booked_at" timestamp(3) with time zone,
  	"booking_id" integer,
  	"actor" varchar DEFAULT 'console',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"must_change_password" boolean DEFAULT false,
  	"last_login_at" timestamp(3) with time zone,
  	"totp_enabled" boolean DEFAULT false,
  	"totp_secret" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"pages_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"products_id" integer,
  	"case_studies_id" integer,
  	"testimonials_id" integer,
  	"clients_id" integer,
  	"team_id" integer,
  	"insights_id" integer,
  	"carousel_cards_id" integer,
  	"posts_id" integer,
  	"authors_id" integer,
  	"categories_id" integer,
  	"media_id" integer,
  	"redirects_id" integer,
  	"leads_id" integer,
  	"bookings_id" integer,
  	"slots_id" integer,
  	"users_id" integer
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
  
  CREATE TABLE "site_settings_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"icon_path" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'SIRAH DIGITAL',
  	"url" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"phone_href" varchar,
  	"whatsapp_number" varchar,
  	"booking_path" varchar,
  	"address_one_line" varchar,
  	"blurb" varchar,
  	"tagline" varchar,
  	"logo_id" integer,
  	"gtm_id" varchar,
  	"ga_id" varchar,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"icon_path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar DEFAULT 'SIRAH DIGITAL',
  	"version_url" varchar,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_phone_href" varchar,
  	"version_whatsapp_number" varchar,
  	"version_booking_path" varchar,
  	"version_address_one_line" varchar,
  	"version_blurb" varchar,
  	"version_tagline" varchar,
  	"version_logo_id" integer,
  	"version_gtm_id" varchar,
  	"version_ga_id" varchar,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "seo_defaults_robots_disallow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE "seo_defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_template" varchar DEFAULT '%s | Sirah Digital',
  	"default_title" varchar,
  	"default_description" varchar,
  	"default_og_image_id" integer,
  	"organization_json_ld" jsonb,
  	"_status" "enum_seo_defaults_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_seo_defaults_v_version_robots_disallow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_seo_defaults_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title_template" varchar DEFAULT '%s | Sirah Digital',
  	"version_default_title" varchar,
  	"version_default_description" varchar,
  	"version_default_og_image_id" integer,
  	"version_organization_json_ld" jsonb,
  	"version__status" "enum__seo_defaults_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "navigation_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "navigation_legacy_anchors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_label" varchar,
  	"header_cta_href" varchar,
  	"_status" "enum_navigation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_navigation_v_version_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_legacy_anchors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_header_cta_label" varchar,
  	"version_header_cta_href" varchar,
  	"version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blurb" varchar,
  	"copyright" varchar,
  	"show_socials" boolean DEFAULT true,
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_v_version_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_blurb" varchar,
  	"version_copyright" varchar,
  	"version_show_socials" boolean DEFAULT true,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "homepage_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb,
  	"width" "enum_homepage_blocks_rich_text_width" DEFAULT 'prose',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_service_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_industry_orbit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_client_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_testimonial_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum_homepage_blocks_testimonial_wall_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"explore_more_href" varchar,
  	"block_name" varchar
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
  
  CREATE TABLE "homepage_blocks_transformation_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"placement_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_roi_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_perspective_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_methodology_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "homepage_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "homepage_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "homepage_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_homepage_blocks_spacer_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer,
  	"posts_id" integer,
  	"carousel_cards_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "_homepage_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb,
  	"width" "enum__homepage_v_blocks_rich_text_width" DEFAULT 'prose',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_service_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_industry_orbit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_client_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_testimonial_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"layout" "enum__homepage_v_blocks_testimonial_wall_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"explore_more_href" varchar,
  	"_uuid" varchar,
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
  
  CREATE TABLE "_homepage_v_blocks_transformation_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"placement_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_roi_calculator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_perspective_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_methodology_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_stat_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_stat_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__homepage_v_blocks_spacer_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"services_id" integer,
  	"industries_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer,
  	"posts_id" integer,
  	"carousel_cards_id" integer,
  	"team_id" integer
  );
  
  CREATE TABLE "methodology_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"accent" varchar
  );
  
  CREATE TABLE "methodology" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_methodology_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_methodology_v_version_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"accent" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_methodology_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__methodology_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "transformation_story_scenes_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "transformation_story_scenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene_id" varchar,
  	"tab" varchar,
  	"tab_long" varchar,
  	"phase" varchar,
  	"accent" varchar,
  	"accent_soft" varchar,
  	"title" varchar,
  	"body" varchar,
  	"status" varchar,
  	"status_tone" "enum_transformation_story_scenes_status_tone" DEFAULT 'bolt'
  );
  
  CREATE TABLE "transformation_story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"scene_ms" numeric DEFAULT 3000,
  	"_status" "enum_transformation_story_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_transformation_story_v_version_scenes_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_transformation_story_v_version_scenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"scene_id" varchar,
  	"tab" varchar,
  	"tab_long" varchar,
  	"phase" varchar,
  	"accent" varchar,
  	"accent_soft" varchar,
  	"title" varchar,
  	"body" varchar,
  	"status" varchar,
  	"status_tone" "enum__transformation_story_v_version_scenes_status_tone" DEFAULT 'bolt',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_transformation_story_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_scene_ms" numeric DEFAULT 3000,
  	"version__status" "enum__transformation_story_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "roi_config_industries_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "roi_config_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"industry_id" varchar,
  	"label" varchar,
  	"automation_fit" numeric,
  	"deal_value" numeric,
  	"base_conversion" numeric
  );
  
  CREATE TABLE "roi_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"disclaimer" varchar,
  	"_status" "enum_roi_config_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_roi_config_v_version_industries_recommendations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_roi_config_v_version_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"industry_id" varchar,
  	"label" varchar,
  	"automation_fit" numeric,
  	"deal_value" numeric,
  	"base_conversion" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_roi_config_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_disclaimer" varchar,
  	"version__status" "enum__roi_config_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "message_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"booked_enabled" boolean DEFAULT true,
  	"booked_body" varchar DEFAULT 'Hi {{firstName}},
  
  Your consultation with *SIRAH DIGITAL* is confirmed.
  
  *When:* {{dateTime}}
  *Duration:* 45 minutes
  
  We will send you the joining link one hour before the call.
  
  If anything changes, reply here and we will get back to you.
  
  *Kind regards,*
  *Team SIRAH DIGITAL*',
  	"day_before_enabled" boolean DEFAULT true,
  	"day_before_body" varchar DEFAULT 'Hi {{firstName}},
  
  A quick reminder that your consultation with *SIRAH DIGITAL* is tomorrow.
  
  *When:* {{dateTime}}
  
  We will send the joining link an hour before we start. If anything changes, reply here and we will get back to you.
  
  *Team SIRAH DIGITAL*',
  	"hour_before_enabled" boolean DEFAULT true,
  	"hour_before_body" varchar DEFAULT 'Hi {{firstName}},
  
  Your consultation with *SIRAH DIGITAL* starts in about an hour ({{time}}).
  
  Join here:
  {{meetLink}}
  
  See you shortly.
  
  *Team SIRAH DIGITAL*',
  	"team_email_enabled" boolean DEFAULT true,
  	"team_email_to" varchar DEFAULT 'support@sirahdigital.in',
  	"team_email_subject" varchar DEFAULT 'New consultation booked — {{fullName}}, {{dateTime}}',
  	"team_email_body" varchar DEFAULT 'A consultation call has been booked.
  
  Name:     {{fullName}}
  Email:    {{email}}
  Phone:    {{phone}}
  Company:  {{company}}
  
  When:     {{dateTime}}
  Link:     {{meetLink}}
  
  Interested in: {{interests}}
  
  What they said:
  {{message}}
  
  This booking was read from the connected Google Calendar.',
  	"_status" "enum_message_templates_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_message_templates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_booked_enabled" boolean DEFAULT true,
  	"version_booked_body" varchar DEFAULT 'Hi {{firstName}},
  
  Your consultation with *SIRAH DIGITAL* is confirmed.
  
  *When:* {{dateTime}}
  *Duration:* 45 minutes
  
  We will send you the joining link one hour before the call.
  
  If anything changes, reply here and we will get back to you.
  
  *Kind regards,*
  *Team SIRAH DIGITAL*',
  	"version_day_before_enabled" boolean DEFAULT true,
  	"version_day_before_body" varchar DEFAULT 'Hi {{firstName}},
  
  A quick reminder that your consultation with *SIRAH DIGITAL* is tomorrow.
  
  *When:* {{dateTime}}
  
  We will send the joining link an hour before we start. If anything changes, reply here and we will get back to you.
  
  *Team SIRAH DIGITAL*',
  	"version_hour_before_enabled" boolean DEFAULT true,
  	"version_hour_before_body" varchar DEFAULT 'Hi {{firstName}},
  
  Your consultation with *SIRAH DIGITAL* starts in about an hour ({{time}}).
  
  Join here:
  {{meetLink}}
  
  See you shortly.
  
  *Team SIRAH DIGITAL*',
  	"version_team_email_enabled" boolean DEFAULT true,
  	"version_team_email_to" varchar DEFAULT 'support@sirahdigital.in',
  	"version_team_email_subject" varchar DEFAULT 'New consultation booked — {{fullName}}, {{dateTime}}',
  	"version_team_email_body" varchar DEFAULT 'A consultation call has been booked.
  
  Name:     {{fullName}}
  Email:    {{email}}
  Phone:    {{phone}}
  Company:  {{company}}
  
  When:     {{dateTime}}
  Link:     {{meetLink}}
  
  Interested in: {{interests}}
  
  What they said:
  {{message}}
  
  This booking was read from the connected Google Calendar.',
  	"version__status" "enum__message_templates_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_chapters" ADD CONSTRAINT "pages_blocks_service_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_industry_orbit" ADD CONSTRAINT "pages_blocks_industry_orbit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_client_marquee" ADD CONSTRAINT "pages_blocks_client_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_wall" ADD CONSTRAINT "pages_blocks_testimonial_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_carousel" ADD CONSTRAINT "pages_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_posts_feed" ADD CONSTRAINT "pages_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_posts_feed" ADD CONSTRAINT "pages_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_transformation_story" ADD CONSTRAINT "pages_blocks_transformation_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_roi_calculator" ADD CONSTRAINT "pages_blocks_roi_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective_carousel" ADD CONSTRAINT "pages_blocks_perspective_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_methodology_journey" ADD CONSTRAINT "pages_blocks_methodology_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_band_stats" ADD CONSTRAINT "pages_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_band" ADD CONSTRAINT "pages_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD CONSTRAINT "pages_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD CONSTRAINT "pages_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall" ADD CONSTRAINT "pages_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_steps" ADD CONSTRAINT "pages_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid" ADD CONSTRAINT "pages_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_chapters" ADD CONSTRAINT "_pages_v_blocks_service_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industry_orbit" ADD CONSTRAINT "_pages_v_blocks_industry_orbit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_client_marquee" ADD CONSTRAINT "_pages_v_blocks_client_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_wall" ADD CONSTRAINT "_pages_v_blocks_testimonial_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_carousel" ADD CONSTRAINT "_pages_v_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_feed" ADD CONSTRAINT "_pages_v_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_feed" ADD CONSTRAINT "_pages_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_transformation_story" ADD CONSTRAINT "_pages_v_blocks_transformation_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_roi_calculator" ADD CONSTRAINT "_pages_v_blocks_roi_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_perspective_carousel" ADD CONSTRAINT "_pages_v_blocks_perspective_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_methodology_journey" ADD CONSTRAINT "_pages_v_blocks_methodology_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_band_stats" ADD CONSTRAINT "_pages_v_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_band" ADD CONSTRAINT "_pages_v_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall" ADD CONSTRAINT "_pages_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_steps" ADD CONSTRAINT "_pages_v_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD CONSTRAINT "_pages_v_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries_outcomes" ADD CONSTRAINT "industries_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_stack" ADD CONSTRAINT "industries_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_workflow" ADD CONSTRAINT "industries_workflow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries_rels" ADD CONSTRAINT "industries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_rels" ADD CONSTRAINT "industries_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_outcomes" ADD CONSTRAINT "_industries_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_stack" ADD CONSTRAINT "_industries_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_workflow" ADD CONSTRAINT "_industries_v_version_workflow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_parent_id_industries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v_rels" ADD CONSTRAINT "_industries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_rels" ADD CONSTRAINT "_industries_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_features" ADD CONSTRAINT "products_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_hero" ADD CONSTRAINT "products_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_hero" ADD CONSTRAINT "products_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_rich_text" ADD CONSTRAINT "products_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_product_grid" ADD CONSTRAINT "products_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_service_chapters" ADD CONSTRAINT "products_blocks_service_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_industry_orbit" ADD CONSTRAINT "products_blocks_industry_orbit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_client_marquee" ADD CONSTRAINT "products_blocks_client_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_testimonial_wall" ADD CONSTRAINT "products_blocks_testimonial_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_insights_carousel" ADD CONSTRAINT "products_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_posts_feed" ADD CONSTRAINT "products_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_posts_feed" ADD CONSTRAINT "products_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_transformation_story" ADD CONSTRAINT "products_blocks_transformation_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_roi_calculator" ADD CONSTRAINT "products_blocks_roi_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_perspective_carousel" ADD CONSTRAINT "products_blocks_perspective_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_methodology_journey" ADD CONSTRAINT "products_blocks_methodology_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stat_band_stats" ADD CONSTRAINT "products_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stat_band" ADD CONSTRAINT "products_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_logo_wall_logos" ADD CONSTRAINT "products_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_logo_wall_logos" ADD CONSTRAINT "products_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_logo_wall" ADD CONSTRAINT "products_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items" ADD CONSTRAINT "products_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq" ADD CONSTRAINT "products_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_timeline_steps" ADD CONSTRAINT "products_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_timeline" ADD CONSTRAINT "products_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_band" ADD CONSTRAINT "products_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_team_grid" ADD CONSTRAINT "products_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_spacer" ADD CONSTRAINT "products_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_features" ADD CONSTRAINT "_products_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_hero" ADD CONSTRAINT "_products_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_hero" ADD CONSTRAINT "_products_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_rich_text" ADD CONSTRAINT "_products_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_product_grid" ADD CONSTRAINT "_products_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_service_chapters" ADD CONSTRAINT "_products_v_blocks_service_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_industry_orbit" ADD CONSTRAINT "_products_v_blocks_industry_orbit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_client_marquee" ADD CONSTRAINT "_products_v_blocks_client_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_testimonial_wall" ADD CONSTRAINT "_products_v_blocks_testimonial_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_insights_carousel" ADD CONSTRAINT "_products_v_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_posts_feed" ADD CONSTRAINT "_products_v_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_posts_feed" ADD CONSTRAINT "_products_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_transformation_story" ADD CONSTRAINT "_products_v_blocks_transformation_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_roi_calculator" ADD CONSTRAINT "_products_v_blocks_roi_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_perspective_carousel" ADD CONSTRAINT "_products_v_blocks_perspective_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_methodology_journey" ADD CONSTRAINT "_products_v_blocks_methodology_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_stat_band_stats" ADD CONSTRAINT "_products_v_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_stat_band" ADD CONSTRAINT "_products_v_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_logo_wall_logos" ADD CONSTRAINT "_products_v_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_logo_wall_logos" ADD CONSTRAINT "_products_v_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_logo_wall" ADD CONSTRAINT "_products_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq_items" ADD CONSTRAINT "_products_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq" ADD CONSTRAINT "_products_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_timeline_steps" ADD CONSTRAINT "_products_v_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_timeline" ADD CONSTRAINT "_products_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_band" ADD CONSTRAINT "_products_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_team_grid" ADD CONSTRAINT "_products_v_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_spacer" ADD CONSTRAINT "_products_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_stack" ADD CONSTRAINT "case_studies_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_metrics" ADD CONSTRAINT "case_studies_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_stack" ADD CONSTRAINT "_case_studies_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_metrics" ADD CONSTRAINT "_case_studies_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_industry_id_industries_id_fk" FOREIGN KEY ("version_industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_parent_id_clients_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_clients_v" ADD CONSTRAINT "_clients_v_version_industry_id_industries_id_fk" FOREIGN KEY ("version_industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_socials" ADD CONSTRAINT "team_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v_version_socials" ADD CONSTRAINT "_team_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_parent_id_team_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carousel_cards" ADD CONSTRAINT "carousel_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_carousel_cards_v" ADD CONSTRAINT "_carousel_cards_v_parent_id_carousel_cards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."carousel_cards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_carousel_cards_v" ADD CONSTRAINT "_carousel_cards_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
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
  ALTER TABLE "leads_notes" ADD CONSTRAINT "leads_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_texts" ADD CONSTRAINT "leads_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slot_id_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "slots" ADD CONSTRAINT "slots_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_slots_fk" FOREIGN KEY ("slots_id") REFERENCES "public"."slots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_address" ADD CONSTRAINT "site_settings_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_address" ADD CONSTRAINT "_site_settings_v_version_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_socials" ADD CONSTRAINT "_site_settings_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults_robots_disallow" ADD CONSTRAINT "seo_defaults_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_defaults"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_seo_defaults_v_version_robots_disallow" ADD CONSTRAINT "_seo_defaults_v_version_robots_disallow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_seo_defaults_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_seo_defaults_v" ADD CONSTRAINT "_seo_defaults_v_version_default_og_image_id_media_id_fk" FOREIGN KEY ("version_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_legacy_anchors" ADD CONSTRAINT "navigation_legacy_anchors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header_children" ADD CONSTRAINT "_navigation_v_version_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header" ADD CONSTRAINT "_navigation_v_version_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_legacy_anchors" ADD CONSTRAINT "_navigation_v_version_legacy_anchors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns" ADD CONSTRAINT "_footer_v_version_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_legal_links" ADD CONSTRAINT "_footer_v_version_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_rich_text" ADD CONSTRAINT "homepage_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_product_grid" ADD CONSTRAINT "homepage_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_service_chapters" ADD CONSTRAINT "homepage_blocks_service_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_industry_orbit" ADD CONSTRAINT "homepage_blocks_industry_orbit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_client_marquee" ADD CONSTRAINT "homepage_blocks_client_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_testimonial_wall" ADD CONSTRAINT "homepage_blocks_testimonial_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights_carousel" ADD CONSTRAINT "homepage_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_posts_feed" ADD CONSTRAINT "homepage_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_posts_feed" ADD CONSTRAINT "homepage_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_transformation_story" ADD CONSTRAINT "homepage_blocks_transformation_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_roi_calculator" ADD CONSTRAINT "homepage_blocks_roi_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_perspective_carousel" ADD CONSTRAINT "homepage_blocks_perspective_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_methodology_journey" ADD CONSTRAINT "homepage_blocks_methodology_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stat_band_stats" ADD CONSTRAINT "homepage_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_stat_band" ADD CONSTRAINT "homepage_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_logo_wall_logos" ADD CONSTRAINT "homepage_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_logo_wall_logos" ADD CONSTRAINT "homepage_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_logo_wall" ADD CONSTRAINT "homepage_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq_items" ADD CONSTRAINT "homepage_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_faq" ADD CONSTRAINT "homepage_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_timeline_steps" ADD CONSTRAINT "homepage_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_timeline" ADD CONSTRAINT "homepage_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_band" ADD CONSTRAINT "homepage_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_team_grid" ADD CONSTRAINT "homepage_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_spacer" ADD CONSTRAINT "homepage_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero" ADD CONSTRAINT "_homepage_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero" ADD CONSTRAINT "_homepage_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_rich_text" ADD CONSTRAINT "_homepage_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_product_grid" ADD CONSTRAINT "_homepage_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_service_chapters" ADD CONSTRAINT "_homepage_v_blocks_service_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_industry_orbit" ADD CONSTRAINT "_homepage_v_blocks_industry_orbit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_client_marquee" ADD CONSTRAINT "_homepage_v_blocks_client_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_testimonial_wall" ADD CONSTRAINT "_homepage_v_blocks_testimonial_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights_carousel" ADD CONSTRAINT "_homepage_v_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_posts_feed" ADD CONSTRAINT "_homepage_v_blocks_posts_feed_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_posts_feed" ADD CONSTRAINT "_homepage_v_blocks_posts_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_transformation_story" ADD CONSTRAINT "_homepage_v_blocks_transformation_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_roi_calculator" ADD CONSTRAINT "_homepage_v_blocks_roi_calculator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_perspective_carousel" ADD CONSTRAINT "_homepage_v_blocks_perspective_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_methodology_journey" ADD CONSTRAINT "_homepage_v_blocks_methodology_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_stat_band_stats" ADD CONSTRAINT "_homepage_v_blocks_stat_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_stat_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_stat_band" ADD CONSTRAINT "_homepage_v_blocks_stat_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_logo_wall_logos" ADD CONSTRAINT "_homepage_v_blocks_logo_wall_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_logo_wall_logos" ADD CONSTRAINT "_homepage_v_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_logo_wall" ADD CONSTRAINT "_homepage_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_faq_items" ADD CONSTRAINT "_homepage_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_faq" ADD CONSTRAINT "_homepage_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_timeline_steps" ADD CONSTRAINT "_homepage_v_blocks_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_timeline" ADD CONSTRAINT "_homepage_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta_band" ADD CONSTRAINT "_homepage_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_team_grid" ADD CONSTRAINT "_homepage_v_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_spacer" ADD CONSTRAINT "_homepage_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_carousel_cards_fk" FOREIGN KEY ("carousel_cards_id") REFERENCES "public"."carousel_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "methodology_pillars" ADD CONSTRAINT "methodology_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."methodology"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_methodology_v_version_pillars" ADD CONSTRAINT "_methodology_v_version_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_methodology_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "transformation_story_scenes_points" ADD CONSTRAINT "transformation_story_scenes_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."transformation_story_scenes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "transformation_story_scenes" ADD CONSTRAINT "transformation_story_scenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."transformation_story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_transformation_story_v_version_scenes_points" ADD CONSTRAINT "_transformation_story_v_version_scenes_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_transformation_story_v_version_scenes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_transformation_story_v_version_scenes" ADD CONSTRAINT "_transformation_story_v_version_scenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_transformation_story_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roi_config_industries_recommendations" ADD CONSTRAINT "roi_config_industries_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roi_config_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roi_config_industries" ADD CONSTRAINT "roi_config_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roi_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roi_config_v_version_industries_recommendations" ADD CONSTRAINT "_roi_config_v_version_industries_recommendations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_roi_config_v_version_industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roi_config_v_version_industries" ADD CONSTRAINT "_roi_config_v_version_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_roi_config_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_grid_order_idx" ON "pages_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_grid_parent_id_idx" ON "pages_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_path_idx" ON "pages_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_service_chapters_order_idx" ON "pages_blocks_service_chapters" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_chapters_parent_id_idx" ON "pages_blocks_service_chapters" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_chapters_path_idx" ON "pages_blocks_service_chapters" USING btree ("_path");
  CREATE INDEX "pages_blocks_industry_orbit_order_idx" ON "pages_blocks_industry_orbit" USING btree ("_order");
  CREATE INDEX "pages_blocks_industry_orbit_parent_id_idx" ON "pages_blocks_industry_orbit" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industry_orbit_path_idx" ON "pages_blocks_industry_orbit" USING btree ("_path");
  CREATE INDEX "pages_blocks_client_marquee_order_idx" ON "pages_blocks_client_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_client_marquee_parent_id_idx" ON "pages_blocks_client_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_client_marquee_path_idx" ON "pages_blocks_client_marquee" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonial_wall_order_idx" ON "pages_blocks_testimonial_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_wall_parent_id_idx" ON "pages_blocks_testimonial_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_wall_path_idx" ON "pages_blocks_testimonial_wall" USING btree ("_path");
  CREATE INDEX "pages_blocks_insights_carousel_order_idx" ON "pages_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_carousel_parent_id_idx" ON "pages_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_insights_carousel_path_idx" ON "pages_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_posts_feed_order_idx" ON "pages_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_posts_feed_parent_id_idx" ON "pages_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_posts_feed_path_idx" ON "pages_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "pages_blocks_posts_feed_category_idx" ON "pages_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "pages_blocks_transformation_story_order_idx" ON "pages_blocks_transformation_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_transformation_story_parent_id_idx" ON "pages_blocks_transformation_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_transformation_story_path_idx" ON "pages_blocks_transformation_story" USING btree ("_path");
  CREATE INDEX "pages_blocks_roi_calculator_order_idx" ON "pages_blocks_roi_calculator" USING btree ("_order");
  CREATE INDEX "pages_blocks_roi_calculator_parent_id_idx" ON "pages_blocks_roi_calculator" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_roi_calculator_path_idx" ON "pages_blocks_roi_calculator" USING btree ("_path");
  CREATE INDEX "pages_blocks_perspective_carousel_order_idx" ON "pages_blocks_perspective_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_perspective_carousel_parent_id_idx" ON "pages_blocks_perspective_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perspective_carousel_path_idx" ON "pages_blocks_perspective_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_methodology_journey_order_idx" ON "pages_blocks_methodology_journey" USING btree ("_order");
  CREATE INDEX "pages_blocks_methodology_journey_parent_id_idx" ON "pages_blocks_methodology_journey" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_methodology_journey_path_idx" ON "pages_blocks_methodology_journey" USING btree ("_path");
  CREATE INDEX "pages_blocks_stat_band_stats_order_idx" ON "pages_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_band_stats_parent_id_idx" ON "pages_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_band_order_idx" ON "pages_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_band_parent_id_idx" ON "pages_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_band_path_idx" ON "pages_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_wall_logos_order_idx" ON "pages_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_logos_parent_id_idx" ON "pages_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_logos_image_idx" ON "pages_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_wall_order_idx" ON "pages_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_parent_id_idx" ON "pages_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_path_idx" ON "pages_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_steps_order_idx" ON "pages_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_steps_parent_id_idx" ON "pages_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_grid_order_idx" ON "pages_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_parent_id_idx" ON "pages_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_path_idx" ON "pages_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_industries_id_idx" ON "pages_rels" USING btree ("industries_id");
  CREATE INDEX "pages_rels_clients_id_idx" ON "pages_rels" USING btree ("clients_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "pages_rels_insights_id_idx" ON "pages_rels" USING btree ("insights_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_carousel_cards_id_idx" ON "pages_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "pages_rels_team_id_idx" ON "pages_rels" USING btree ("team_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_media_idx" ON "_pages_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_grid_order_idx" ON "_pages_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_grid_parent_id_idx" ON "_pages_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_path_idx" ON "_pages_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_service_chapters_order_idx" ON "_pages_v_blocks_service_chapters" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_chapters_parent_id_idx" ON "_pages_v_blocks_service_chapters" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_chapters_path_idx" ON "_pages_v_blocks_service_chapters" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_industry_orbit_order_idx" ON "_pages_v_blocks_industry_orbit" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industry_orbit_parent_id_idx" ON "_pages_v_blocks_industry_orbit" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industry_orbit_path_idx" ON "_pages_v_blocks_industry_orbit" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_client_marquee_order_idx" ON "_pages_v_blocks_client_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_client_marquee_parent_id_idx" ON "_pages_v_blocks_client_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_client_marquee_path_idx" ON "_pages_v_blocks_client_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonial_wall_order_idx" ON "_pages_v_blocks_testimonial_wall" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_wall_parent_id_idx" ON "_pages_v_blocks_testimonial_wall" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_wall_path_idx" ON "_pages_v_blocks_testimonial_wall" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_insights_carousel_order_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_carousel_parent_id_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_carousel_path_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_posts_feed_order_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_posts_feed_parent_id_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_posts_feed_path_idx" ON "_pages_v_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_posts_feed_category_idx" ON "_pages_v_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_transformation_story_order_idx" ON "_pages_v_blocks_transformation_story" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_transformation_story_parent_id_idx" ON "_pages_v_blocks_transformation_story" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_transformation_story_path_idx" ON "_pages_v_blocks_transformation_story" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_roi_calculator_order_idx" ON "_pages_v_blocks_roi_calculator" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_roi_calculator_parent_id_idx" ON "_pages_v_blocks_roi_calculator" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_roi_calculator_path_idx" ON "_pages_v_blocks_roi_calculator" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_perspective_carousel_order_idx" ON "_pages_v_blocks_perspective_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_perspective_carousel_parent_id_idx" ON "_pages_v_blocks_perspective_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_perspective_carousel_path_idx" ON "_pages_v_blocks_perspective_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_methodology_journey_order_idx" ON "_pages_v_blocks_methodology_journey" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_methodology_journey_parent_id_idx" ON "_pages_v_blocks_methodology_journey" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_methodology_journey_path_idx" ON "_pages_v_blocks_methodology_journey" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stat_band_stats_order_idx" ON "_pages_v_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_band_stats_parent_id_idx" ON "_pages_v_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_band_order_idx" ON "_pages_v_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_band_parent_id_idx" ON "_pages_v_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_band_path_idx" ON "_pages_v_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_order_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_parent_id_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_image_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_order_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_parent_id_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_path_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_steps_order_idx" ON "_pages_v_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_steps_parent_id_idx" ON "_pages_v_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_grid_order_idx" ON "_pages_v_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_grid_parent_id_idx" ON "_pages_v_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_grid_path_idx" ON "_pages_v_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_industries_id_idx" ON "_pages_v_rels" USING btree ("industries_id");
  CREATE INDEX "_pages_v_rels_clients_id_idx" ON "_pages_v_rels" USING btree ("clients_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_insights_id_idx" ON "_pages_v_rels" USING btree ("insights_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_carousel_cards_id_idx" ON "_pages_v_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "_pages_v_rels_team_id_idx" ON "_pages_v_rels" USING btree ("team_id");
  CREATE INDEX "services_order_idx" ON "services" USING btree ("order");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_order_idx" ON "_services_v" USING btree ("version_order");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_seo_version_seo_og_image_idx" ON "_services_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE INDEX "industries_outcomes_order_idx" ON "industries_outcomes" USING btree ("_order");
  CREATE INDEX "industries_outcomes_parent_id_idx" ON "industries_outcomes" USING btree ("_parent_id");
  CREATE INDEX "industries_stack_order_idx" ON "industries_stack" USING btree ("_order");
  CREATE INDEX "industries_stack_parent_id_idx" ON "industries_stack" USING btree ("_parent_id");
  CREATE INDEX "industries_workflow_order_idx" ON "industries_workflow" USING btree ("_order");
  CREATE INDEX "industries_workflow_parent_id_idx" ON "industries_workflow" USING btree ("_parent_id");
  CREATE INDEX "industries_order_idx" ON "industries" USING btree ("order");
  CREATE UNIQUE INDEX "industries_slug_idx" ON "industries" USING btree ("slug");
  CREATE INDEX "industries_image_idx" ON "industries" USING btree ("image_id");
  CREATE INDEX "industries_seo_seo_og_image_idx" ON "industries" USING btree ("seo_og_image_id");
  CREATE INDEX "industries_updated_at_idx" ON "industries" USING btree ("updated_at");
  CREATE INDEX "industries_created_at_idx" ON "industries" USING btree ("created_at");
  CREATE INDEX "industries__status_idx" ON "industries" USING btree ("_status");
  CREATE INDEX "industries_rels_order_idx" ON "industries_rels" USING btree ("order");
  CREATE INDEX "industries_rels_parent_idx" ON "industries_rels" USING btree ("parent_id");
  CREATE INDEX "industries_rels_path_idx" ON "industries_rels" USING btree ("path");
  CREATE INDEX "industries_rels_services_id_idx" ON "industries_rels" USING btree ("services_id");
  CREATE INDEX "_industries_v_version_outcomes_order_idx" ON "_industries_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_industries_v_version_outcomes_parent_id_idx" ON "_industries_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_industries_v_version_stack_order_idx" ON "_industries_v_version_stack" USING btree ("_order");
  CREATE INDEX "_industries_v_version_stack_parent_id_idx" ON "_industries_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_industries_v_version_workflow_order_idx" ON "_industries_v_version_workflow" USING btree ("_order");
  CREATE INDEX "_industries_v_version_workflow_parent_id_idx" ON "_industries_v_version_workflow" USING btree ("_parent_id");
  CREATE INDEX "_industries_v_parent_idx" ON "_industries_v" USING btree ("parent_id");
  CREATE INDEX "_industries_v_version_version_order_idx" ON "_industries_v" USING btree ("version_order");
  CREATE INDEX "_industries_v_version_version_slug_idx" ON "_industries_v" USING btree ("version_slug");
  CREATE INDEX "_industries_v_version_version_image_idx" ON "_industries_v" USING btree ("version_image_id");
  CREATE INDEX "_industries_v_version_seo_version_seo_og_image_idx" ON "_industries_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_industries_v_version_version_updated_at_idx" ON "_industries_v" USING btree ("version_updated_at");
  CREATE INDEX "_industries_v_version_version_created_at_idx" ON "_industries_v" USING btree ("version_created_at");
  CREATE INDEX "_industries_v_version_version__status_idx" ON "_industries_v" USING btree ("version__status");
  CREATE INDEX "_industries_v_created_at_idx" ON "_industries_v" USING btree ("created_at");
  CREATE INDEX "_industries_v_updated_at_idx" ON "_industries_v" USING btree ("updated_at");
  CREATE INDEX "_industries_v_latest_idx" ON "_industries_v" USING btree ("latest");
  CREATE INDEX "_industries_v_autosave_idx" ON "_industries_v" USING btree ("autosave");
  CREATE INDEX "_industries_v_rels_order_idx" ON "_industries_v_rels" USING btree ("order");
  CREATE INDEX "_industries_v_rels_parent_idx" ON "_industries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_industries_v_rels_path_idx" ON "_industries_v_rels" USING btree ("path");
  CREATE INDEX "_industries_v_rels_services_id_idx" ON "_industries_v_rels" USING btree ("services_id");
  CREATE INDEX "products_features_order_idx" ON "products_features" USING btree ("_order");
  CREATE INDEX "products_features_parent_id_idx" ON "products_features" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_hero_order_idx" ON "products_blocks_hero" USING btree ("_order");
  CREATE INDEX "products_blocks_hero_parent_id_idx" ON "products_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_hero_path_idx" ON "products_blocks_hero" USING btree ("_path");
  CREATE INDEX "products_blocks_hero_media_idx" ON "products_blocks_hero" USING btree ("media_id");
  CREATE INDEX "products_blocks_rich_text_order_idx" ON "products_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "products_blocks_rich_text_parent_id_idx" ON "products_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_rich_text_path_idx" ON "products_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "products_blocks_product_grid_order_idx" ON "products_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "products_blocks_product_grid_parent_id_idx" ON "products_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_product_grid_path_idx" ON "products_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "products_blocks_service_chapters_order_idx" ON "products_blocks_service_chapters" USING btree ("_order");
  CREATE INDEX "products_blocks_service_chapters_parent_id_idx" ON "products_blocks_service_chapters" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_service_chapters_path_idx" ON "products_blocks_service_chapters" USING btree ("_path");
  CREATE INDEX "products_blocks_industry_orbit_order_idx" ON "products_blocks_industry_orbit" USING btree ("_order");
  CREATE INDEX "products_blocks_industry_orbit_parent_id_idx" ON "products_blocks_industry_orbit" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_industry_orbit_path_idx" ON "products_blocks_industry_orbit" USING btree ("_path");
  CREATE INDEX "products_blocks_client_marquee_order_idx" ON "products_blocks_client_marquee" USING btree ("_order");
  CREATE INDEX "products_blocks_client_marquee_parent_id_idx" ON "products_blocks_client_marquee" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_client_marquee_path_idx" ON "products_blocks_client_marquee" USING btree ("_path");
  CREATE INDEX "products_blocks_testimonial_wall_order_idx" ON "products_blocks_testimonial_wall" USING btree ("_order");
  CREATE INDEX "products_blocks_testimonial_wall_parent_id_idx" ON "products_blocks_testimonial_wall" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_testimonial_wall_path_idx" ON "products_blocks_testimonial_wall" USING btree ("_path");
  CREATE INDEX "products_blocks_insights_carousel_order_idx" ON "products_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "products_blocks_insights_carousel_parent_id_idx" ON "products_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_insights_carousel_path_idx" ON "products_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "products_blocks_posts_feed_order_idx" ON "products_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "products_blocks_posts_feed_parent_id_idx" ON "products_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_posts_feed_path_idx" ON "products_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "products_blocks_posts_feed_category_idx" ON "products_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "products_blocks_transformation_story_order_idx" ON "products_blocks_transformation_story" USING btree ("_order");
  CREATE INDEX "products_blocks_transformation_story_parent_id_idx" ON "products_blocks_transformation_story" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_transformation_story_path_idx" ON "products_blocks_transformation_story" USING btree ("_path");
  CREATE INDEX "products_blocks_roi_calculator_order_idx" ON "products_blocks_roi_calculator" USING btree ("_order");
  CREATE INDEX "products_blocks_roi_calculator_parent_id_idx" ON "products_blocks_roi_calculator" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_roi_calculator_path_idx" ON "products_blocks_roi_calculator" USING btree ("_path");
  CREATE INDEX "products_blocks_perspective_carousel_order_idx" ON "products_blocks_perspective_carousel" USING btree ("_order");
  CREATE INDEX "products_blocks_perspective_carousel_parent_id_idx" ON "products_blocks_perspective_carousel" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_perspective_carousel_path_idx" ON "products_blocks_perspective_carousel" USING btree ("_path");
  CREATE INDEX "products_blocks_methodology_journey_order_idx" ON "products_blocks_methodology_journey" USING btree ("_order");
  CREATE INDEX "products_blocks_methodology_journey_parent_id_idx" ON "products_blocks_methodology_journey" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_methodology_journey_path_idx" ON "products_blocks_methodology_journey" USING btree ("_path");
  CREATE INDEX "products_blocks_stat_band_stats_order_idx" ON "products_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "products_blocks_stat_band_stats_parent_id_idx" ON "products_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stat_band_order_idx" ON "products_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "products_blocks_stat_band_parent_id_idx" ON "products_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stat_band_path_idx" ON "products_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "products_blocks_logo_wall_logos_order_idx" ON "products_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "products_blocks_logo_wall_logos_parent_id_idx" ON "products_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_logo_wall_logos_image_idx" ON "products_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "products_blocks_logo_wall_order_idx" ON "products_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "products_blocks_logo_wall_parent_id_idx" ON "products_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_logo_wall_path_idx" ON "products_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "products_blocks_faq_items_order_idx" ON "products_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_items_parent_id_idx" ON "products_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_order_idx" ON "products_blocks_faq" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_parent_id_idx" ON "products_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_path_idx" ON "products_blocks_faq" USING btree ("_path");
  CREATE INDEX "products_blocks_timeline_steps_order_idx" ON "products_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "products_blocks_timeline_steps_parent_id_idx" ON "products_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_timeline_order_idx" ON "products_blocks_timeline" USING btree ("_order");
  CREATE INDEX "products_blocks_timeline_parent_id_idx" ON "products_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_timeline_path_idx" ON "products_blocks_timeline" USING btree ("_path");
  CREATE INDEX "products_blocks_cta_band_order_idx" ON "products_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_band_parent_id_idx" ON "products_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_band_path_idx" ON "products_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "products_blocks_team_grid_order_idx" ON "products_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "products_blocks_team_grid_parent_id_idx" ON "products_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_team_grid_path_idx" ON "products_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "products_blocks_spacer_order_idx" ON "products_blocks_spacer" USING btree ("_order");
  CREATE INDEX "products_blocks_spacer_parent_id_idx" ON "products_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_spacer_path_idx" ON "products_blocks_spacer" USING btree ("_path");
  CREATE INDEX "products_order_idx" ON "products" USING btree ("order");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_hero_image_idx" ON "products" USING btree ("hero_image_id");
  CREATE INDEX "products_seo_seo_og_image_idx" ON "products" USING btree ("seo_og_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "products_rels_services_id_idx" ON "products_rels" USING btree ("services_id");
  CREATE INDEX "products_rels_industries_id_idx" ON "products_rels" USING btree ("industries_id");
  CREATE INDEX "products_rels_clients_id_idx" ON "products_rels" USING btree ("clients_id");
  CREATE INDEX "products_rels_testimonials_id_idx" ON "products_rels" USING btree ("testimonials_id");
  CREATE INDEX "products_rels_insights_id_idx" ON "products_rels" USING btree ("insights_id");
  CREATE INDEX "products_rels_posts_id_idx" ON "products_rels" USING btree ("posts_id");
  CREATE INDEX "products_rels_carousel_cards_id_idx" ON "products_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "products_rels_team_id_idx" ON "products_rels" USING btree ("team_id");
  CREATE INDEX "_products_v_version_features_order_idx" ON "_products_v_version_features" USING btree ("_order");
  CREATE INDEX "_products_v_version_features_parent_id_idx" ON "_products_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_hero_order_idx" ON "_products_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_hero_parent_id_idx" ON "_products_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_hero_path_idx" ON "_products_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_hero_media_idx" ON "_products_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_products_v_blocks_rich_text_order_idx" ON "_products_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_rich_text_parent_id_idx" ON "_products_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_rich_text_path_idx" ON "_products_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_product_grid_order_idx" ON "_products_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_product_grid_parent_id_idx" ON "_products_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_product_grid_path_idx" ON "_products_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_service_chapters_order_idx" ON "_products_v_blocks_service_chapters" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_service_chapters_parent_id_idx" ON "_products_v_blocks_service_chapters" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_service_chapters_path_idx" ON "_products_v_blocks_service_chapters" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_industry_orbit_order_idx" ON "_products_v_blocks_industry_orbit" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_industry_orbit_parent_id_idx" ON "_products_v_blocks_industry_orbit" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_industry_orbit_path_idx" ON "_products_v_blocks_industry_orbit" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_client_marquee_order_idx" ON "_products_v_blocks_client_marquee" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_client_marquee_parent_id_idx" ON "_products_v_blocks_client_marquee" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_client_marquee_path_idx" ON "_products_v_blocks_client_marquee" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_testimonial_wall_order_idx" ON "_products_v_blocks_testimonial_wall" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_testimonial_wall_parent_id_idx" ON "_products_v_blocks_testimonial_wall" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_testimonial_wall_path_idx" ON "_products_v_blocks_testimonial_wall" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_insights_carousel_order_idx" ON "_products_v_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_insights_carousel_parent_id_idx" ON "_products_v_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_insights_carousel_path_idx" ON "_products_v_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_posts_feed_order_idx" ON "_products_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_posts_feed_parent_id_idx" ON "_products_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_posts_feed_path_idx" ON "_products_v_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_posts_feed_category_idx" ON "_products_v_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "_products_v_blocks_transformation_story_order_idx" ON "_products_v_blocks_transformation_story" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_transformation_story_parent_id_idx" ON "_products_v_blocks_transformation_story" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_transformation_story_path_idx" ON "_products_v_blocks_transformation_story" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_roi_calculator_order_idx" ON "_products_v_blocks_roi_calculator" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_roi_calculator_parent_id_idx" ON "_products_v_blocks_roi_calculator" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_roi_calculator_path_idx" ON "_products_v_blocks_roi_calculator" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_perspective_carousel_order_idx" ON "_products_v_blocks_perspective_carousel" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_perspective_carousel_parent_id_idx" ON "_products_v_blocks_perspective_carousel" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_perspective_carousel_path_idx" ON "_products_v_blocks_perspective_carousel" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_methodology_journey_order_idx" ON "_products_v_blocks_methodology_journey" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_methodology_journey_parent_id_idx" ON "_products_v_blocks_methodology_journey" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_methodology_journey_path_idx" ON "_products_v_blocks_methodology_journey" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_stat_band_stats_order_idx" ON "_products_v_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_stat_band_stats_parent_id_idx" ON "_products_v_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_stat_band_order_idx" ON "_products_v_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_stat_band_parent_id_idx" ON "_products_v_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_stat_band_path_idx" ON "_products_v_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_logo_wall_logos_order_idx" ON "_products_v_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_logo_wall_logos_parent_id_idx" ON "_products_v_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_logo_wall_logos_image_idx" ON "_products_v_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "_products_v_blocks_logo_wall_order_idx" ON "_products_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_logo_wall_parent_id_idx" ON "_products_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_logo_wall_path_idx" ON "_products_v_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_faq_items_order_idx" ON "_products_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_items_parent_id_idx" ON "_products_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_faq_order_idx" ON "_products_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_parent_id_idx" ON "_products_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_faq_path_idx" ON "_products_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_timeline_steps_order_idx" ON "_products_v_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_timeline_steps_parent_id_idx" ON "_products_v_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_timeline_order_idx" ON "_products_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_timeline_parent_id_idx" ON "_products_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_timeline_path_idx" ON "_products_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_cta_band_order_idx" ON "_products_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_band_parent_id_idx" ON "_products_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_cta_band_path_idx" ON "_products_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_team_grid_order_idx" ON "_products_v_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_team_grid_parent_id_idx" ON "_products_v_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_team_grid_path_idx" ON "_products_v_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_spacer_order_idx" ON "_products_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_spacer_parent_id_idx" ON "_products_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_spacer_path_idx" ON "_products_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_order_idx" ON "_products_v" USING btree ("version_order");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_hero_image_idx" ON "_products_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_products_v_version_seo_version_seo_og_image_idx" ON "_products_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_rels_services_id_idx" ON "_products_v_rels" USING btree ("services_id");
  CREATE INDEX "_products_v_rels_industries_id_idx" ON "_products_v_rels" USING btree ("industries_id");
  CREATE INDEX "_products_v_rels_clients_id_idx" ON "_products_v_rels" USING btree ("clients_id");
  CREATE INDEX "_products_v_rels_testimonials_id_idx" ON "_products_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_products_v_rels_insights_id_idx" ON "_products_v_rels" USING btree ("insights_id");
  CREATE INDEX "_products_v_rels_posts_id_idx" ON "_products_v_rels" USING btree ("posts_id");
  CREATE INDEX "_products_v_rels_carousel_cards_id_idx" ON "_products_v_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "_products_v_rels_team_id_idx" ON "_products_v_rels" USING btree ("team_id");
  CREATE INDEX "case_studies_stack_order_idx" ON "case_studies_stack" USING btree ("_order");
  CREATE INDEX "case_studies_stack_parent_id_idx" ON "case_studies_stack" USING btree ("_parent_id");
  CREATE INDEX "case_studies_metrics_order_idx" ON "case_studies_metrics" USING btree ("_order");
  CREATE INDEX "case_studies_metrics_parent_id_idx" ON "case_studies_metrics" USING btree ("_parent_id");
  CREATE INDEX "case_studies_order_idx" ON "case_studies" USING btree ("order");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_client_idx" ON "case_studies" USING btree ("client_id");
  CREATE INDEX "case_studies_industry_idx" ON "case_studies" USING btree ("industry_id");
  CREATE INDEX "case_studies_cover_idx" ON "case_studies" USING btree ("cover_id");
  CREATE INDEX "case_studies_seo_seo_og_image_idx" ON "case_studies" USING btree ("seo_og_image_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "_case_studies_v_version_stack_order_idx" ON "_case_studies_v_version_stack" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_stack_parent_id_idx" ON "_case_studies_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_metrics_order_idx" ON "_case_studies_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_metrics_parent_id_idx" ON "_case_studies_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_order_idx" ON "_case_studies_v" USING btree ("version_order");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_client_idx" ON "_case_studies_v" USING btree ("version_client_id");
  CREATE INDEX "_case_studies_v_version_version_industry_idx" ON "_case_studies_v" USING btree ("version_industry_id");
  CREATE INDEX "_case_studies_v_version_version_cover_idx" ON "_case_studies_v" USING btree ("version_cover_id");
  CREATE INDEX "_case_studies_v_version_seo_version_seo_og_image_idx" ON "_case_studies_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_autosave_idx" ON "_case_studies_v" USING btree ("autosave");
  CREATE INDEX "testimonials_order_idx" ON "testimonials" USING btree ("order");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_client_idx" ON "testimonials" USING btree ("client_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_order_idx" ON "_testimonials_v" USING btree ("version_order");
  CREATE INDEX "_testimonials_v_version_version_avatar_idx" ON "_testimonials_v" USING btree ("version_avatar_id");
  CREATE INDEX "_testimonials_v_version_version_client_idx" ON "_testimonials_v" USING btree ("version_client_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_autosave_idx" ON "_testimonials_v" USING btree ("autosave");
  CREATE INDEX "clients_order_idx" ON "clients" USING btree ("order");
  CREATE UNIQUE INDEX "clients_slug_idx" ON "clients" USING btree ("slug");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_industry_idx" ON "clients" USING btree ("industry_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "clients__status_idx" ON "clients" USING btree ("_status");
  CREATE INDEX "_clients_v_parent_idx" ON "_clients_v" USING btree ("parent_id");
  CREATE INDEX "_clients_v_version_version_order_idx" ON "_clients_v" USING btree ("version_order");
  CREATE INDEX "_clients_v_version_version_slug_idx" ON "_clients_v" USING btree ("version_slug");
  CREATE INDEX "_clients_v_version_version_logo_idx" ON "_clients_v" USING btree ("version_logo_id");
  CREATE INDEX "_clients_v_version_version_industry_idx" ON "_clients_v" USING btree ("version_industry_id");
  CREATE INDEX "_clients_v_version_version_updated_at_idx" ON "_clients_v" USING btree ("version_updated_at");
  CREATE INDEX "_clients_v_version_version_created_at_idx" ON "_clients_v" USING btree ("version_created_at");
  CREATE INDEX "_clients_v_version_version__status_idx" ON "_clients_v" USING btree ("version__status");
  CREATE INDEX "_clients_v_created_at_idx" ON "_clients_v" USING btree ("created_at");
  CREATE INDEX "_clients_v_updated_at_idx" ON "_clients_v" USING btree ("updated_at");
  CREATE INDEX "_clients_v_latest_idx" ON "_clients_v" USING btree ("latest");
  CREATE INDEX "_clients_v_autosave_idx" ON "_clients_v" USING btree ("autosave");
  CREATE INDEX "team_socials_order_idx" ON "team_socials" USING btree ("_order");
  CREATE INDEX "team_socials_parent_id_idx" ON "team_socials" USING btree ("_parent_id");
  CREATE INDEX "team_order_idx" ON "team" USING btree ("order");
  CREATE INDEX "team_photo_idx" ON "team" USING btree ("photo_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "team__status_idx" ON "team" USING btree ("_status");
  CREATE INDEX "_team_v_version_socials_order_idx" ON "_team_v_version_socials" USING btree ("_order");
  CREATE INDEX "_team_v_version_socials_parent_id_idx" ON "_team_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_team_v_parent_idx" ON "_team_v" USING btree ("parent_id");
  CREATE INDEX "_team_v_version_version_order_idx" ON "_team_v" USING btree ("version_order");
  CREATE INDEX "_team_v_version_version_photo_idx" ON "_team_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_v_version_version_updated_at_idx" ON "_team_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_v_version_version_created_at_idx" ON "_team_v" USING btree ("version_created_at");
  CREATE INDEX "_team_v_version_version__status_idx" ON "_team_v" USING btree ("version__status");
  CREATE INDEX "_team_v_created_at_idx" ON "_team_v" USING btree ("created_at");
  CREATE INDEX "_team_v_updated_at_idx" ON "_team_v" USING btree ("updated_at");
  CREATE INDEX "_team_v_latest_idx" ON "_team_v" USING btree ("latest");
  CREATE INDEX "_team_v_autosave_idx" ON "_team_v" USING btree ("autosave");
  CREATE INDEX "insights_order_idx" ON "insights" USING btree ("order");
  CREATE INDEX "insights_cover_idx" ON "insights" USING btree ("cover_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_order_idx" ON "_insights_v" USING btree ("version_order");
  CREATE INDEX "_insights_v_version_version_cover_idx" ON "_insights_v" USING btree ("version_cover_id");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  CREATE INDEX "_insights_v_autosave_idx" ON "_insights_v" USING btree ("autosave");
  CREATE INDEX "carousel_cards_order_idx" ON "carousel_cards" USING btree ("order");
  CREATE INDEX "carousel_cards_image_idx" ON "carousel_cards" USING btree ("image_id");
  CREATE INDEX "carousel_cards_updated_at_idx" ON "carousel_cards" USING btree ("updated_at");
  CREATE INDEX "carousel_cards_created_at_idx" ON "carousel_cards" USING btree ("created_at");
  CREATE INDEX "carousel_cards__status_idx" ON "carousel_cards" USING btree ("_status");
  CREATE INDEX "_carousel_cards_v_parent_idx" ON "_carousel_cards_v" USING btree ("parent_id");
  CREATE INDEX "_carousel_cards_v_version_version_order_idx" ON "_carousel_cards_v" USING btree ("version_order");
  CREATE INDEX "_carousel_cards_v_version_version_image_idx" ON "_carousel_cards_v" USING btree ("version_image_id");
  CREATE INDEX "_carousel_cards_v_version_version_updated_at_idx" ON "_carousel_cards_v" USING btree ("version_updated_at");
  CREATE INDEX "_carousel_cards_v_version_version_created_at_idx" ON "_carousel_cards_v" USING btree ("version_created_at");
  CREATE INDEX "_carousel_cards_v_version_version__status_idx" ON "_carousel_cards_v" USING btree ("version__status");
  CREATE INDEX "_carousel_cards_v_created_at_idx" ON "_carousel_cards_v" USING btree ("created_at");
  CREATE INDEX "_carousel_cards_v_updated_at_idx" ON "_carousel_cards_v" USING btree ("updated_at");
  CREATE INDEX "_carousel_cards_v_latest_idx" ON "_carousel_cards_v" USING btree ("latest");
  CREATE INDEX "_carousel_cards_v_autosave_idx" ON "_carousel_cards_v" USING btree ("autosave");
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
  CREATE UNIQUE INDEX "media_source_path_idx" ON "media" USING btree ("source_path");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "leads_notes_order_idx" ON "leads_notes" USING btree ("_order");
  CREATE INDEX "leads_notes_parent_id_idx" ON "leads_notes" USING btree ("_parent_id");
  CREATE INDEX "leads_owner_idx" ON "leads" USING btree ("owner_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "leads_texts_order_parent" ON "leads_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "bookings_calendar_event_id_idx" ON "bookings" USING btree ("calendar_event_id");
  CREATE INDEX "bookings_slot_idx" ON "bookings" USING btree ("slot_id");
  CREATE INDEX "bookings_invitee_email_idx" ON "bookings" USING btree ("invitee_email");
  CREATE INDEX "bookings_lead_idx" ON "bookings" USING btree ("lead_id");
  CREATE INDEX "bookings_start_at_idx" ON "bookings" USING btree ("start_at");
  CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "slots_local_date_idx" ON "slots" USING btree ("local_date");
  CREATE INDEX "slots_start_at_idx" ON "slots" USING btree ("start_at");
  CREATE INDEX "slots_status_idx" ON "slots" USING btree ("status");
  CREATE INDEX "slots_booking_idx" ON "slots" USING btree ("booking_id");
  CREATE INDEX "slots_updated_at_idx" ON "slots" USING btree ("updated_at");
  CREATE INDEX "slots_created_at_idx" ON "slots" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_industries_id_idx" ON "payload_locked_documents_rels" USING btree ("industries_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");
  CREATE INDEX "payload_locked_documents_rels_carousel_cards_id_idx" ON "payload_locked_documents_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_slots_id_idx" ON "payload_locked_documents_rels" USING btree ("slots_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_address_order_idx" ON "site_settings_address" USING btree ("_order");
  CREATE INDEX "site_settings_address_parent_id_idx" ON "site_settings_address" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_address_order_idx" ON "_site_settings_v_version_address" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_address_parent_id_idx" ON "_site_settings_v_version_address" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_socials_order_idx" ON "_site_settings_v_version_socials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_socials_parent_id_idx" ON "_site_settings_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE INDEX "_site_settings_v_autosave_idx" ON "_site_settings_v" USING btree ("autosave");
  CREATE INDEX "seo_defaults_robots_disallow_order_idx" ON "seo_defaults_robots_disallow" USING btree ("_order");
  CREATE INDEX "seo_defaults_robots_disallow_parent_id_idx" ON "seo_defaults_robots_disallow" USING btree ("_parent_id");
  CREATE INDEX "seo_defaults_default_og_image_idx" ON "seo_defaults" USING btree ("default_og_image_id");
  CREATE INDEX "seo_defaults__status_idx" ON "seo_defaults" USING btree ("_status");
  CREATE INDEX "_seo_defaults_v_version_robots_disallow_order_idx" ON "_seo_defaults_v_version_robots_disallow" USING btree ("_order");
  CREATE INDEX "_seo_defaults_v_version_robots_disallow_parent_id_idx" ON "_seo_defaults_v_version_robots_disallow" USING btree ("_parent_id");
  CREATE INDEX "_seo_defaults_v_version_version_default_og_image_idx" ON "_seo_defaults_v" USING btree ("version_default_og_image_id");
  CREATE INDEX "_seo_defaults_v_version_version__status_idx" ON "_seo_defaults_v" USING btree ("version__status");
  CREATE INDEX "_seo_defaults_v_created_at_idx" ON "_seo_defaults_v" USING btree ("created_at");
  CREATE INDEX "_seo_defaults_v_updated_at_idx" ON "_seo_defaults_v" USING btree ("updated_at");
  CREATE INDEX "_seo_defaults_v_latest_idx" ON "_seo_defaults_v" USING btree ("latest");
  CREATE INDEX "_seo_defaults_v_autosave_idx" ON "_seo_defaults_v" USING btree ("autosave");
  CREATE INDEX "navigation_header_children_order_idx" ON "navigation_header_children" USING btree ("_order");
  CREATE INDEX "navigation_header_children_parent_id_idx" ON "navigation_header_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_legacy_anchors_order_idx" ON "navigation_legacy_anchors" USING btree ("_order");
  CREATE INDEX "navigation_legacy_anchors_parent_id_idx" ON "navigation_legacy_anchors" USING btree ("_parent_id");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE INDEX "_navigation_v_version_header_children_order_idx" ON "_navigation_v_version_header_children" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_header_children_parent_id_idx" ON "_navigation_v_version_header_children" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_header_order_idx" ON "_navigation_v_version_header" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_header_parent_id_idx" ON "_navigation_v_version_header" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_legacy_anchors_order_idx" ON "_navigation_v_version_legacy_anchors" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_legacy_anchors_parent_id_idx" ON "_navigation_v_version_legacy_anchors" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");
  CREATE INDEX "_navigation_v_autosave_idx" ON "_navigation_v" USING btree ("autosave");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE INDEX "_footer_v_version_columns_links_order_idx" ON "_footer_v_version_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_links_parent_id_idx" ON "_footer_v_version_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_columns_order_idx" ON "_footer_v_version_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_parent_id_idx" ON "_footer_v_version_columns" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_legal_links_order_idx" ON "_footer_v_version_legal_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_legal_links_parent_id_idx" ON "_footer_v_version_legal_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  CREATE INDEX "homepage_blocks_hero_order_idx" ON "homepage_blocks_hero" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_parent_id_idx" ON "homepage_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_path_idx" ON "homepage_blocks_hero" USING btree ("_path");
  CREATE INDEX "homepage_blocks_hero_media_idx" ON "homepage_blocks_hero" USING btree ("media_id");
  CREATE INDEX "homepage_blocks_rich_text_order_idx" ON "homepage_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "homepage_blocks_rich_text_parent_id_idx" ON "homepage_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_rich_text_path_idx" ON "homepage_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "homepage_blocks_product_grid_order_idx" ON "homepage_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "homepage_blocks_product_grid_parent_id_idx" ON "homepage_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_product_grid_path_idx" ON "homepage_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "homepage_blocks_service_chapters_order_idx" ON "homepage_blocks_service_chapters" USING btree ("_order");
  CREATE INDEX "homepage_blocks_service_chapters_parent_id_idx" ON "homepage_blocks_service_chapters" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_service_chapters_path_idx" ON "homepage_blocks_service_chapters" USING btree ("_path");
  CREATE INDEX "homepage_blocks_industry_orbit_order_idx" ON "homepage_blocks_industry_orbit" USING btree ("_order");
  CREATE INDEX "homepage_blocks_industry_orbit_parent_id_idx" ON "homepage_blocks_industry_orbit" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_industry_orbit_path_idx" ON "homepage_blocks_industry_orbit" USING btree ("_path");
  CREATE INDEX "homepage_blocks_client_marquee_order_idx" ON "homepage_blocks_client_marquee" USING btree ("_order");
  CREATE INDEX "homepage_blocks_client_marquee_parent_id_idx" ON "homepage_blocks_client_marquee" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_client_marquee_path_idx" ON "homepage_blocks_client_marquee" USING btree ("_path");
  CREATE INDEX "homepage_blocks_testimonial_wall_order_idx" ON "homepage_blocks_testimonial_wall" USING btree ("_order");
  CREATE INDEX "homepage_blocks_testimonial_wall_parent_id_idx" ON "homepage_blocks_testimonial_wall" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_testimonial_wall_path_idx" ON "homepage_blocks_testimonial_wall" USING btree ("_path");
  CREATE INDEX "homepage_blocks_insights_carousel_order_idx" ON "homepage_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "homepage_blocks_insights_carousel_parent_id_idx" ON "homepage_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_insights_carousel_path_idx" ON "homepage_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "homepage_blocks_posts_feed_order_idx" ON "homepage_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "homepage_blocks_posts_feed_parent_id_idx" ON "homepage_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_posts_feed_path_idx" ON "homepage_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "homepage_blocks_posts_feed_category_idx" ON "homepage_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "homepage_blocks_transformation_story_order_idx" ON "homepage_blocks_transformation_story" USING btree ("_order");
  CREATE INDEX "homepage_blocks_transformation_story_parent_id_idx" ON "homepage_blocks_transformation_story" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_transformation_story_path_idx" ON "homepage_blocks_transformation_story" USING btree ("_path");
  CREATE INDEX "homepage_blocks_roi_calculator_order_idx" ON "homepage_blocks_roi_calculator" USING btree ("_order");
  CREATE INDEX "homepage_blocks_roi_calculator_parent_id_idx" ON "homepage_blocks_roi_calculator" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_roi_calculator_path_idx" ON "homepage_blocks_roi_calculator" USING btree ("_path");
  CREATE INDEX "homepage_blocks_perspective_carousel_order_idx" ON "homepage_blocks_perspective_carousel" USING btree ("_order");
  CREATE INDEX "homepage_blocks_perspective_carousel_parent_id_idx" ON "homepage_blocks_perspective_carousel" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_perspective_carousel_path_idx" ON "homepage_blocks_perspective_carousel" USING btree ("_path");
  CREATE INDEX "homepage_blocks_methodology_journey_order_idx" ON "homepage_blocks_methodology_journey" USING btree ("_order");
  CREATE INDEX "homepage_blocks_methodology_journey_parent_id_idx" ON "homepage_blocks_methodology_journey" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_methodology_journey_path_idx" ON "homepage_blocks_methodology_journey" USING btree ("_path");
  CREATE INDEX "homepage_blocks_stat_band_stats_order_idx" ON "homepage_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stat_band_stats_parent_id_idx" ON "homepage_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stat_band_order_idx" ON "homepage_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "homepage_blocks_stat_band_parent_id_idx" ON "homepage_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_stat_band_path_idx" ON "homepage_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "homepage_blocks_logo_wall_logos_order_idx" ON "homepage_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "homepage_blocks_logo_wall_logos_parent_id_idx" ON "homepage_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_logo_wall_logos_image_idx" ON "homepage_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "homepage_blocks_logo_wall_order_idx" ON "homepage_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "homepage_blocks_logo_wall_parent_id_idx" ON "homepage_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_logo_wall_path_idx" ON "homepage_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "homepage_blocks_faq_items_order_idx" ON "homepage_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_items_parent_id_idx" ON "homepage_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_order_idx" ON "homepage_blocks_faq" USING btree ("_order");
  CREATE INDEX "homepage_blocks_faq_parent_id_idx" ON "homepage_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_faq_path_idx" ON "homepage_blocks_faq" USING btree ("_path");
  CREATE INDEX "homepage_blocks_timeline_steps_order_idx" ON "homepage_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "homepage_blocks_timeline_steps_parent_id_idx" ON "homepage_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_timeline_order_idx" ON "homepage_blocks_timeline" USING btree ("_order");
  CREATE INDEX "homepage_blocks_timeline_parent_id_idx" ON "homepage_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_timeline_path_idx" ON "homepage_blocks_timeline" USING btree ("_path");
  CREATE INDEX "homepage_blocks_cta_band_order_idx" ON "homepage_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_band_parent_id_idx" ON "homepage_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_band_path_idx" ON "homepage_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "homepage_blocks_team_grid_order_idx" ON "homepage_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "homepage_blocks_team_grid_parent_id_idx" ON "homepage_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_team_grid_path_idx" ON "homepage_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "homepage_blocks_spacer_order_idx" ON "homepage_blocks_spacer" USING btree ("_order");
  CREATE INDEX "homepage_blocks_spacer_parent_id_idx" ON "homepage_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_spacer_path_idx" ON "homepage_blocks_spacer" USING btree ("_path");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_products_id_idx" ON "homepage_rels" USING btree ("products_id");
  CREATE INDEX "homepage_rels_services_id_idx" ON "homepage_rels" USING btree ("services_id");
  CREATE INDEX "homepage_rels_industries_id_idx" ON "homepage_rels" USING btree ("industries_id");
  CREATE INDEX "homepage_rels_clients_id_idx" ON "homepage_rels" USING btree ("clients_id");
  CREATE INDEX "homepage_rels_testimonials_id_idx" ON "homepage_rels" USING btree ("testimonials_id");
  CREATE INDEX "homepage_rels_insights_id_idx" ON "homepage_rels" USING btree ("insights_id");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "homepage_rels" USING btree ("posts_id");
  CREATE INDEX "homepage_rels_carousel_cards_id_idx" ON "homepage_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "homepage_rels_team_id_idx" ON "homepage_rels" USING btree ("team_id");
  CREATE INDEX "_homepage_v_blocks_hero_order_idx" ON "_homepage_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_parent_id_idx" ON "_homepage_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_path_idx" ON "_homepage_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_hero_media_idx" ON "_homepage_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_homepage_v_blocks_rich_text_order_idx" ON "_homepage_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_rich_text_parent_id_idx" ON "_homepage_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_rich_text_path_idx" ON "_homepage_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_product_grid_order_idx" ON "_homepage_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_product_grid_parent_id_idx" ON "_homepage_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_product_grid_path_idx" ON "_homepage_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_service_chapters_order_idx" ON "_homepage_v_blocks_service_chapters" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_service_chapters_parent_id_idx" ON "_homepage_v_blocks_service_chapters" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_service_chapters_path_idx" ON "_homepage_v_blocks_service_chapters" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_industry_orbit_order_idx" ON "_homepage_v_blocks_industry_orbit" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_industry_orbit_parent_id_idx" ON "_homepage_v_blocks_industry_orbit" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_industry_orbit_path_idx" ON "_homepage_v_blocks_industry_orbit" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_client_marquee_order_idx" ON "_homepage_v_blocks_client_marquee" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_client_marquee_parent_id_idx" ON "_homepage_v_blocks_client_marquee" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_client_marquee_path_idx" ON "_homepage_v_blocks_client_marquee" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_testimonial_wall_order_idx" ON "_homepage_v_blocks_testimonial_wall" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_testimonial_wall_parent_id_idx" ON "_homepage_v_blocks_testimonial_wall" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_testimonial_wall_path_idx" ON "_homepage_v_blocks_testimonial_wall" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_insights_carousel_order_idx" ON "_homepage_v_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_insights_carousel_parent_id_idx" ON "_homepage_v_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_insights_carousel_path_idx" ON "_homepage_v_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_posts_feed_order_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_posts_feed_parent_id_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_posts_feed_path_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_posts_feed_category_idx" ON "_homepage_v_blocks_posts_feed" USING btree ("category_id");
  CREATE INDEX "_homepage_v_blocks_transformation_story_order_idx" ON "_homepage_v_blocks_transformation_story" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_transformation_story_parent_id_idx" ON "_homepage_v_blocks_transformation_story" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_transformation_story_path_idx" ON "_homepage_v_blocks_transformation_story" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_roi_calculator_order_idx" ON "_homepage_v_blocks_roi_calculator" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_roi_calculator_parent_id_idx" ON "_homepage_v_blocks_roi_calculator" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_roi_calculator_path_idx" ON "_homepage_v_blocks_roi_calculator" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_perspective_carousel_order_idx" ON "_homepage_v_blocks_perspective_carousel" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_perspective_carousel_parent_id_idx" ON "_homepage_v_blocks_perspective_carousel" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_perspective_carousel_path_idx" ON "_homepage_v_blocks_perspective_carousel" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_methodology_journey_order_idx" ON "_homepage_v_blocks_methodology_journey" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_methodology_journey_parent_id_idx" ON "_homepage_v_blocks_methodology_journey" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_methodology_journey_path_idx" ON "_homepage_v_blocks_methodology_journey" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_stat_band_stats_order_idx" ON "_homepage_v_blocks_stat_band_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_stat_band_stats_parent_id_idx" ON "_homepage_v_blocks_stat_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_stat_band_order_idx" ON "_homepage_v_blocks_stat_band" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_stat_band_parent_id_idx" ON "_homepage_v_blocks_stat_band" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_stat_band_path_idx" ON "_homepage_v_blocks_stat_band" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_logo_wall_logos_order_idx" ON "_homepage_v_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_logo_wall_logos_parent_id_idx" ON "_homepage_v_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_logo_wall_logos_image_idx" ON "_homepage_v_blocks_logo_wall_logos" USING btree ("image_id");
  CREATE INDEX "_homepage_v_blocks_logo_wall_order_idx" ON "_homepage_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_logo_wall_parent_id_idx" ON "_homepage_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_logo_wall_path_idx" ON "_homepage_v_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_faq_items_order_idx" ON "_homepage_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_faq_items_parent_id_idx" ON "_homepage_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_faq_order_idx" ON "_homepage_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_faq_parent_id_idx" ON "_homepage_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_faq_path_idx" ON "_homepage_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_timeline_steps_order_idx" ON "_homepage_v_blocks_timeline_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_timeline_steps_parent_id_idx" ON "_homepage_v_blocks_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_timeline_order_idx" ON "_homepage_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_timeline_parent_id_idx" ON "_homepage_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_timeline_path_idx" ON "_homepage_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_cta_band_order_idx" ON "_homepage_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_cta_band_parent_id_idx" ON "_homepage_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_cta_band_path_idx" ON "_homepage_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_team_grid_order_idx" ON "_homepage_v_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_team_grid_parent_id_idx" ON "_homepage_v_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_team_grid_path_idx" ON "_homepage_v_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_spacer_order_idx" ON "_homepage_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_spacer_parent_id_idx" ON "_homepage_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_spacer_path_idx" ON "_homepage_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_products_id_idx" ON "_homepage_v_rels" USING btree ("products_id");
  CREATE INDEX "_homepage_v_rels_services_id_idx" ON "_homepage_v_rels" USING btree ("services_id");
  CREATE INDEX "_homepage_v_rels_industries_id_idx" ON "_homepage_v_rels" USING btree ("industries_id");
  CREATE INDEX "_homepage_v_rels_clients_id_idx" ON "_homepage_v_rels" USING btree ("clients_id");
  CREATE INDEX "_homepage_v_rels_testimonials_id_idx" ON "_homepage_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_homepage_v_rels_insights_id_idx" ON "_homepage_v_rels" USING btree ("insights_id");
  CREATE INDEX "_homepage_v_rels_posts_id_idx" ON "_homepage_v_rels" USING btree ("posts_id");
  CREATE INDEX "_homepage_v_rels_carousel_cards_id_idx" ON "_homepage_v_rels" USING btree ("carousel_cards_id");
  CREATE INDEX "_homepage_v_rels_team_id_idx" ON "_homepage_v_rels" USING btree ("team_id");
  CREATE INDEX "methodology_pillars_order_idx" ON "methodology_pillars" USING btree ("_order");
  CREATE INDEX "methodology_pillars_parent_id_idx" ON "methodology_pillars" USING btree ("_parent_id");
  CREATE INDEX "methodology__status_idx" ON "methodology" USING btree ("_status");
  CREATE INDEX "_methodology_v_version_pillars_order_idx" ON "_methodology_v_version_pillars" USING btree ("_order");
  CREATE INDEX "_methodology_v_version_pillars_parent_id_idx" ON "_methodology_v_version_pillars" USING btree ("_parent_id");
  CREATE INDEX "_methodology_v_version_version__status_idx" ON "_methodology_v" USING btree ("version__status");
  CREATE INDEX "_methodology_v_created_at_idx" ON "_methodology_v" USING btree ("created_at");
  CREATE INDEX "_methodology_v_updated_at_idx" ON "_methodology_v" USING btree ("updated_at");
  CREATE INDEX "_methodology_v_latest_idx" ON "_methodology_v" USING btree ("latest");
  CREATE INDEX "_methodology_v_autosave_idx" ON "_methodology_v" USING btree ("autosave");
  CREATE INDEX "transformation_story_scenes_points_order_idx" ON "transformation_story_scenes_points" USING btree ("_order");
  CREATE INDEX "transformation_story_scenes_points_parent_id_idx" ON "transformation_story_scenes_points" USING btree ("_parent_id");
  CREATE INDEX "transformation_story_scenes_order_idx" ON "transformation_story_scenes" USING btree ("_order");
  CREATE INDEX "transformation_story_scenes_parent_id_idx" ON "transformation_story_scenes" USING btree ("_parent_id");
  CREATE INDEX "transformation_story__status_idx" ON "transformation_story" USING btree ("_status");
  CREATE INDEX "_transformation_story_v_version_scenes_points_order_idx" ON "_transformation_story_v_version_scenes_points" USING btree ("_order");
  CREATE INDEX "_transformation_story_v_version_scenes_points_parent_id_idx" ON "_transformation_story_v_version_scenes_points" USING btree ("_parent_id");
  CREATE INDEX "_transformation_story_v_version_scenes_order_idx" ON "_transformation_story_v_version_scenes" USING btree ("_order");
  CREATE INDEX "_transformation_story_v_version_scenes_parent_id_idx" ON "_transformation_story_v_version_scenes" USING btree ("_parent_id");
  CREATE INDEX "_transformation_story_v_version_version__status_idx" ON "_transformation_story_v" USING btree ("version__status");
  CREATE INDEX "_transformation_story_v_created_at_idx" ON "_transformation_story_v" USING btree ("created_at");
  CREATE INDEX "_transformation_story_v_updated_at_idx" ON "_transformation_story_v" USING btree ("updated_at");
  CREATE INDEX "_transformation_story_v_latest_idx" ON "_transformation_story_v" USING btree ("latest");
  CREATE INDEX "_transformation_story_v_autosave_idx" ON "_transformation_story_v" USING btree ("autosave");
  CREATE INDEX "roi_config_industries_recommendations_order_idx" ON "roi_config_industries_recommendations" USING btree ("_order");
  CREATE INDEX "roi_config_industries_recommendations_parent_id_idx" ON "roi_config_industries_recommendations" USING btree ("_parent_id");
  CREATE INDEX "roi_config_industries_order_idx" ON "roi_config_industries" USING btree ("_order");
  CREATE INDEX "roi_config_industries_parent_id_idx" ON "roi_config_industries" USING btree ("_parent_id");
  CREATE INDEX "roi_config__status_idx" ON "roi_config" USING btree ("_status");
  CREATE INDEX "_roi_config_v_version_industries_recommendations_order_idx" ON "_roi_config_v_version_industries_recommendations" USING btree ("_order");
  CREATE INDEX "_roi_config_v_version_industries_recommendations_parent_id_idx" ON "_roi_config_v_version_industries_recommendations" USING btree ("_parent_id");
  CREATE INDEX "_roi_config_v_version_industries_order_idx" ON "_roi_config_v_version_industries" USING btree ("_order");
  CREATE INDEX "_roi_config_v_version_industries_parent_id_idx" ON "_roi_config_v_version_industries" USING btree ("_parent_id");
  CREATE INDEX "_roi_config_v_version_version__status_idx" ON "_roi_config_v" USING btree ("version__status");
  CREATE INDEX "_roi_config_v_created_at_idx" ON "_roi_config_v" USING btree ("created_at");
  CREATE INDEX "_roi_config_v_updated_at_idx" ON "_roi_config_v" USING btree ("updated_at");
  CREATE INDEX "_roi_config_v_latest_idx" ON "_roi_config_v" USING btree ("latest");
  CREATE INDEX "_roi_config_v_autosave_idx" ON "_roi_config_v" USING btree ("autosave");
  CREATE INDEX "message_templates__status_idx" ON "message_templates" USING btree ("_status");
  CREATE INDEX "_message_templates_v_version_version__status_idx" ON "_message_templates_v" USING btree ("version__status");
  CREATE INDEX "_message_templates_v_created_at_idx" ON "_message_templates_v" USING btree ("created_at");
  CREATE INDEX "_message_templates_v_updated_at_idx" ON "_message_templates_v" USING btree ("updated_at");
  CREATE INDEX "_message_templates_v_latest_idx" ON "_message_templates_v" USING btree ("latest");
  CREATE INDEX "_message_templates_v_autosave_idx" ON "_message_templates_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_service_chapters" CASCADE;
  DROP TABLE "pages_blocks_industry_orbit" CASCADE;
  DROP TABLE "pages_blocks_client_marquee" CASCADE;
  DROP TABLE "pages_blocks_testimonial_wall" CASCADE;
  DROP TABLE "pages_blocks_insights_carousel" CASCADE;
  DROP TABLE "pages_blocks_posts_feed" CASCADE;
  DROP TABLE "pages_blocks_transformation_story" CASCADE;
  DROP TABLE "pages_blocks_roi_calculator" CASCADE;
  DROP TABLE "pages_blocks_perspective_carousel" CASCADE;
  DROP TABLE "pages_blocks_methodology_journey" CASCADE;
  DROP TABLE "pages_blocks_stat_band_stats" CASCADE;
  DROP TABLE "pages_blocks_stat_band" CASCADE;
  DROP TABLE "pages_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_wall" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_timeline_steps" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_team_grid" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_service_chapters" CASCADE;
  DROP TABLE "_pages_v_blocks_industry_orbit" CASCADE;
  DROP TABLE "_pages_v_blocks_client_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_wall" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_posts_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_transformation_story" CASCADE;
  DROP TABLE "_pages_v_blocks_roi_calculator" CASCADE;
  DROP TABLE "_pages_v_blocks_perspective_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_methodology_journey" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_band_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_band" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "industries_outcomes" CASCADE;
  DROP TABLE "industries_stack" CASCADE;
  DROP TABLE "industries_workflow" CASCADE;
  DROP TABLE "industries" CASCADE;
  DROP TABLE "industries_rels" CASCADE;
  DROP TABLE "_industries_v_version_outcomes" CASCADE;
  DROP TABLE "_industries_v_version_stack" CASCADE;
  DROP TABLE "_industries_v_version_workflow" CASCADE;
  DROP TABLE "_industries_v" CASCADE;
  DROP TABLE "_industries_v_rels" CASCADE;
  DROP TABLE "products_features" CASCADE;
  DROP TABLE "products_blocks_hero" CASCADE;
  DROP TABLE "products_blocks_rich_text" CASCADE;
  DROP TABLE "products_blocks_product_grid" CASCADE;
  DROP TABLE "products_blocks_service_chapters" CASCADE;
  DROP TABLE "products_blocks_industry_orbit" CASCADE;
  DROP TABLE "products_blocks_client_marquee" CASCADE;
  DROP TABLE "products_blocks_testimonial_wall" CASCADE;
  DROP TABLE "products_blocks_insights_carousel" CASCADE;
  DROP TABLE "products_blocks_posts_feed" CASCADE;
  DROP TABLE "products_blocks_transformation_story" CASCADE;
  DROP TABLE "products_blocks_roi_calculator" CASCADE;
  DROP TABLE "products_blocks_perspective_carousel" CASCADE;
  DROP TABLE "products_blocks_methodology_journey" CASCADE;
  DROP TABLE "products_blocks_stat_band_stats" CASCADE;
  DROP TABLE "products_blocks_stat_band" CASCADE;
  DROP TABLE "products_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "products_blocks_logo_wall" CASCADE;
  DROP TABLE "products_blocks_faq_items" CASCADE;
  DROP TABLE "products_blocks_faq" CASCADE;
  DROP TABLE "products_blocks_timeline_steps" CASCADE;
  DROP TABLE "products_blocks_timeline" CASCADE;
  DROP TABLE "products_blocks_cta_band" CASCADE;
  DROP TABLE "products_blocks_team_grid" CASCADE;
  DROP TABLE "products_blocks_spacer" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_features" CASCADE;
  DROP TABLE "_products_v_blocks_hero" CASCADE;
  DROP TABLE "_products_v_blocks_rich_text" CASCADE;
  DROP TABLE "_products_v_blocks_product_grid" CASCADE;
  DROP TABLE "_products_v_blocks_service_chapters" CASCADE;
  DROP TABLE "_products_v_blocks_industry_orbit" CASCADE;
  DROP TABLE "_products_v_blocks_client_marquee" CASCADE;
  DROP TABLE "_products_v_blocks_testimonial_wall" CASCADE;
  DROP TABLE "_products_v_blocks_insights_carousel" CASCADE;
  DROP TABLE "_products_v_blocks_posts_feed" CASCADE;
  DROP TABLE "_products_v_blocks_transformation_story" CASCADE;
  DROP TABLE "_products_v_blocks_roi_calculator" CASCADE;
  DROP TABLE "_products_v_blocks_perspective_carousel" CASCADE;
  DROP TABLE "_products_v_blocks_methodology_journey" CASCADE;
  DROP TABLE "_products_v_blocks_stat_band_stats" CASCADE;
  DROP TABLE "_products_v_blocks_stat_band" CASCADE;
  DROP TABLE "_products_v_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "_products_v_blocks_logo_wall" CASCADE;
  DROP TABLE "_products_v_blocks_faq_items" CASCADE;
  DROP TABLE "_products_v_blocks_faq" CASCADE;
  DROP TABLE "_products_v_blocks_timeline_steps" CASCADE;
  DROP TABLE "_products_v_blocks_timeline" CASCADE;
  DROP TABLE "_products_v_blocks_cta_band" CASCADE;
  DROP TABLE "_products_v_blocks_team_grid" CASCADE;
  DROP TABLE "_products_v_blocks_spacer" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "case_studies_stack" CASCADE;
  DROP TABLE "case_studies_metrics" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "_case_studies_v_version_stack" CASCADE;
  DROP TABLE "_case_studies_v_version_metrics" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "_clients_v" CASCADE;
  DROP TABLE "team_socials" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "_team_v_version_socials" CASCADE;
  DROP TABLE "_team_v" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "carousel_cards" CASCADE;
  DROP TABLE "_carousel_cards_v" CASCADE;
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
  DROP TABLE "media" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "leads_notes" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "leads_texts" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "slots" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_address" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_address" CASCADE;
  DROP TABLE "_site_settings_v_version_socials" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "seo_defaults_robots_disallow" CASCADE;
  DROP TABLE "seo_defaults" CASCADE;
  DROP TABLE "_seo_defaults_v_version_robots_disallow" CASCADE;
  DROP TABLE "_seo_defaults_v" CASCADE;
  DROP TABLE "navigation_header_children" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_legacy_anchors" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "_navigation_v_version_header_children" CASCADE;
  DROP TABLE "_navigation_v_version_header" CASCADE;
  DROP TABLE "_navigation_v_version_legacy_anchors" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v_version_columns_links" CASCADE;
  DROP TABLE "_footer_v_version_columns" CASCADE;
  DROP TABLE "_footer_v_version_legal_links" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "homepage_blocks_hero" CASCADE;
  DROP TABLE "homepage_blocks_rich_text" CASCADE;
  DROP TABLE "homepage_blocks_product_grid" CASCADE;
  DROP TABLE "homepage_blocks_service_chapters" CASCADE;
  DROP TABLE "homepage_blocks_industry_orbit" CASCADE;
  DROP TABLE "homepage_blocks_client_marquee" CASCADE;
  DROP TABLE "homepage_blocks_testimonial_wall" CASCADE;
  DROP TABLE "homepage_blocks_insights_carousel" CASCADE;
  DROP TABLE "homepage_blocks_posts_feed" CASCADE;
  DROP TABLE "homepage_blocks_transformation_story" CASCADE;
  DROP TABLE "homepage_blocks_roi_calculator" CASCADE;
  DROP TABLE "homepage_blocks_perspective_carousel" CASCADE;
  DROP TABLE "homepage_blocks_methodology_journey" CASCADE;
  DROP TABLE "homepage_blocks_stat_band_stats" CASCADE;
  DROP TABLE "homepage_blocks_stat_band" CASCADE;
  DROP TABLE "homepage_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "homepage_blocks_logo_wall" CASCADE;
  DROP TABLE "homepage_blocks_faq_items" CASCADE;
  DROP TABLE "homepage_blocks_faq" CASCADE;
  DROP TABLE "homepage_blocks_timeline_steps" CASCADE;
  DROP TABLE "homepage_blocks_timeline" CASCADE;
  DROP TABLE "homepage_blocks_cta_band" CASCADE;
  DROP TABLE "homepage_blocks_team_grid" CASCADE;
  DROP TABLE "homepage_blocks_spacer" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero" CASCADE;
  DROP TABLE "_homepage_v_blocks_rich_text" CASCADE;
  DROP TABLE "_homepage_v_blocks_product_grid" CASCADE;
  DROP TABLE "_homepage_v_blocks_service_chapters" CASCADE;
  DROP TABLE "_homepage_v_blocks_industry_orbit" CASCADE;
  DROP TABLE "_homepage_v_blocks_client_marquee" CASCADE;
  DROP TABLE "_homepage_v_blocks_testimonial_wall" CASCADE;
  DROP TABLE "_homepage_v_blocks_insights_carousel" CASCADE;
  DROP TABLE "_homepage_v_blocks_posts_feed" CASCADE;
  DROP TABLE "_homepage_v_blocks_transformation_story" CASCADE;
  DROP TABLE "_homepage_v_blocks_roi_calculator" CASCADE;
  DROP TABLE "_homepage_v_blocks_perspective_carousel" CASCADE;
  DROP TABLE "_homepage_v_blocks_methodology_journey" CASCADE;
  DROP TABLE "_homepage_v_blocks_stat_band_stats" CASCADE;
  DROP TABLE "_homepage_v_blocks_stat_band" CASCADE;
  DROP TABLE "_homepage_v_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "_homepage_v_blocks_logo_wall" CASCADE;
  DROP TABLE "_homepage_v_blocks_faq_items" CASCADE;
  DROP TABLE "_homepage_v_blocks_faq" CASCADE;
  DROP TABLE "_homepage_v_blocks_timeline_steps" CASCADE;
  DROP TABLE "_homepage_v_blocks_timeline" CASCADE;
  DROP TABLE "_homepage_v_blocks_cta_band" CASCADE;
  DROP TABLE "_homepage_v_blocks_team_grid" CASCADE;
  DROP TABLE "_homepage_v_blocks_spacer" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "methodology_pillars" CASCADE;
  DROP TABLE "methodology" CASCADE;
  DROP TABLE "_methodology_v_version_pillars" CASCADE;
  DROP TABLE "_methodology_v" CASCADE;
  DROP TABLE "transformation_story_scenes_points" CASCADE;
  DROP TABLE "transformation_story_scenes" CASCADE;
  DROP TABLE "transformation_story" CASCADE;
  DROP TABLE "_transformation_story_v_version_scenes_points" CASCADE;
  DROP TABLE "_transformation_story_v_version_scenes" CASCADE;
  DROP TABLE "_transformation_story_v" CASCADE;
  DROP TABLE "roi_config_industries_recommendations" CASCADE;
  DROP TABLE "roi_config_industries" CASCADE;
  DROP TABLE "roi_config" CASCADE;
  DROP TABLE "_roi_config_v_version_industries_recommendations" CASCADE;
  DROP TABLE "_roi_config_v_version_industries" CASCADE;
  DROP TABLE "_roi_config_v" CASCADE;
  DROP TABLE "message_templates" CASCADE;
  DROP TABLE "_message_templates_v" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_testimonial_wall_layout";
  DROP TYPE "public"."enum_pages_blocks_posts_feed_mode";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_wall_layout";
  DROP TYPE "public"."enum__pages_v_blocks_posts_feed_mode";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_services_visual";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_visual";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_industries_status";
  DROP TYPE "public"."enum__industries_v_version_status";
  DROP TYPE "public"."enum_products_blocks_rich_text_width";
  DROP TYPE "public"."enum_products_blocks_testimonial_wall_layout";
  DROP TYPE "public"."enum_products_blocks_posts_feed_mode";
  DROP TYPE "public"."enum_products_blocks_spacer_size";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__products_v_blocks_testimonial_wall_layout";
  DROP TYPE "public"."enum__products_v_blocks_posts_feed_mode";
  DROP TYPE "public"."enum__products_v_blocks_spacer_size";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_case_studies_stage";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_stage";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_clients_status";
  DROP TYPE "public"."enum__clients_v_version_status";
  DROP TYPE "public"."enum_team_socials_label";
  DROP TYPE "public"."enum_team_status";
  DROP TYPE "public"."enum__team_v_version_socials_label";
  DROP TYPE "public"."enum__team_v_version_status";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum_carousel_cards_status";
  DROP TYPE "public"."enum__carousel_cards_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_authors_socials_label";
  DROP TYPE "public"."enum_authors_status";
  DROP TYPE "public"."enum__authors_v_version_socials_label";
  DROP TYPE "public"."enum__authors_v_version_status";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_slots_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum_seo_defaults_status";
  DROP TYPE "public"."enum__seo_defaults_v_version_status";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_status";
  DROP TYPE "public"."enum_homepage_blocks_rich_text_width";
  DROP TYPE "public"."enum_homepage_blocks_testimonial_wall_layout";
  DROP TYPE "public"."enum_homepage_blocks_posts_feed_mode";
  DROP TYPE "public"."enum_homepage_blocks_spacer_size";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__homepage_v_blocks_testimonial_wall_layout";
  DROP TYPE "public"."enum__homepage_v_blocks_posts_feed_mode";
  DROP TYPE "public"."enum__homepage_v_blocks_spacer_size";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_methodology_status";
  DROP TYPE "public"."enum__methodology_v_version_status";
  DROP TYPE "public"."enum_transformation_story_scenes_status_tone";
  DROP TYPE "public"."enum_transformation_story_status";
  DROP TYPE "public"."enum__transformation_story_v_version_scenes_status_tone";
  DROP TYPE "public"."enum__transformation_story_v_version_status";
  DROP TYPE "public"."enum_roi_config_status";
  DROP TYPE "public"."enum__roi_config_v_version_status";
  DROP TYPE "public"."enum_message_templates_status";
  DROP TYPE "public"."enum__message_templates_v_version_status";`)
}
