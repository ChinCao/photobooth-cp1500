CREATE TYPE "public"."frame_type" AS ENUM('singular', 'double');--> statement-breakpoint
CREATE TYPE "public"."queueStatus" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('prom', 'usagyuun');--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"slotPosition" integer,
	"proccessedImageId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "processedImage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"theme" "theme" NOT NULL,
	"frameURL" text NOT NULL,
	"type" "frame_type" NOT NULL,
	"slotCount" integer NOT NULL,
	"quantity" integer,
	"filter" text DEFAULT 'Original',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"queueId" uuid
);
--> statement-breakpoint
CREATE TABLE "queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "queueStatus" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"proccessedImageId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_proccessedImageId_processedImage_id_fk" FOREIGN KEY ("proccessedImageId") REFERENCES "public"."processedImage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processedImage" ADD CONSTRAINT "processedImage_queueId_queue_id_fk" FOREIGN KEY ("queueId") REFERENCES "public"."queue"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_proccessedImageId_processedImage_id_fk" FOREIGN KEY ("proccessedImageId") REFERENCES "public"."processedImage"("id") ON DELETE cascade ON UPDATE no action;