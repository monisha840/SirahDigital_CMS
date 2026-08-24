import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Rescheduling: three columns on `bookings` with an index on the token, and
 * the reschedule email templates on the message-templates global.
 *
 * ── Hand-written, not generated ──────────────────────────────────────────
 * `payload migrate:create` diffs the config against a live database, and the
 * only DATABASE_URI on this machine points at production. Generating this file
 * would mean opening production to write a migration whose whole purpose is to
 * be applied to production later, by the deploy. Seven ADD COLUMNs are small
 * enough to write by hand and check by eye, so that is what this is.
 *
 * ── IF NOT EXISTS, for the reason the previous migration documents ───────
 * A dev-mode schema push may already have created these. `push` is opt-in and
 * off by default now, but it was `NODE_ENV !== 'production'` for the whole life
 * of this database, and the remove_blog migration failed twice on exactly this
 * — media.prefix already existed and the generated ADD aborted the batch. The
 * guards make the migration idempotent, which is what it should have been.
 *
 * ── Backfill ────────────────────────────────────────────────────────────
 * Existing rows get a token. Without one, a booking made before this deploy can
 * never be moved by the person who made it: rescheduleLinkFor returns '' with no
 * token, so the day-before message would be held back entirely by isSendable
 * once the template carries {{rescheduleLink}}. That is a live booking silently
 * losing its reminder, which is worse than the missing feature.
 *
 * gen_random_uuid() rather than matching the application's 24 random bytes.
 * pgcrypto ships with Supabase, it needs no extension this database lacks, and
 * a v4 UUID is 122 bits of randomness — weaker than the 192 the hook mints, and
 * ample for a value that only has to be unguessable for the days these rows
 * have left. New rows get the stronger one from the collection hook.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "reschedule_token" varchar;
    ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "reschedule_count" numeric DEFAULT 0;
    ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "rescheduled_from" timestamp(3) with time zone;

    UPDATE "bookings"
       SET "reschedule_token" = replace(gen_random_uuid()::text, '-', '')
     WHERE "reschedule_token" IS NULL;

    UPDATE "bookings" SET "reschedule_count" = 0 WHERE "reschedule_count" IS NULL;

    /*
     * Not UNIQUE. The column is the credential for moving a booking, so a
     * collision would be a real problem — but a unique index turns that
     * problem into a failed INSERT at booking time, which is a visitor being
     * told their slot could not be confirmed. At 192 bits a collision will not
     * happen; if it somehow did, two bookings sharing a token is recoverable
     * and a refused booking is not.
     */
    CREATE INDEX IF NOT EXISTS "bookings_reschedule_token_idx"
        ON "bookings" USING btree ("reschedule_token");

    /*
     * The reschedule email templates, on the global and on its version table.
     *
     * Both, because message-templates has drafts enabled: the published row
     * lives in "message_templates" and every saved revision in
     * "_message_templates_v". Adding the column to only one of them lets the
     * admin save a value that the next publish silently discards — and the
     * missing column does not fail loudly, it fails as a 42703 the first time
     * anything reads the global, which is the reminder job at 3am.
     */
    ALTER TABLE "message_templates" ADD COLUMN IF NOT EXISTS "team_reschedule_subject" varchar;
    ALTER TABLE "message_templates" ADD COLUMN IF NOT EXISTS "team_reschedule_body" varchar;
    ALTER TABLE "_message_templates_v" ADD COLUMN IF NOT EXISTS "version_team_reschedule_subject" varchar;
    ALTER TABLE "_message_templates_v" ADD COLUMN IF NOT EXISTS "version_team_reschedule_body" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_message_templates_v" DROP COLUMN IF EXISTS "version_team_reschedule_body";
    ALTER TABLE "_message_templates_v" DROP COLUMN IF EXISTS "version_team_reschedule_subject";
    ALTER TABLE "message_templates" DROP COLUMN IF EXISTS "team_reschedule_body";
    ALTER TABLE "message_templates" DROP COLUMN IF EXISTS "team_reschedule_subject";
    DROP INDEX IF EXISTS "bookings_reschedule_token_idx";
    ALTER TABLE "bookings" DROP COLUMN IF EXISTS "reschedule_token";
    ALTER TABLE "bookings" DROP COLUMN IF EXISTS "reschedule_count";
    ALTER TABLE "bookings" DROP COLUMN IF EXISTS "rescheduled_from";
  `)
}
