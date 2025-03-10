ALTER TABLE "processed_image" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "processed_image" ALTER COLUMN "theme" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "processed_image" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "processed_image" ALTER COLUMN "slotCount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "processed_image" ALTER COLUMN "quantity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "processed_image" ALTER COLUMN "filter" DROP NOT NULL;