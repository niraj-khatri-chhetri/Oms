ALTER TABLE "departments" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "departments" ALTER COLUMN "description" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "departments" ALTER COLUMN "updated_at" SET DEFAULT null;