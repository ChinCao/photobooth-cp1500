ALTER TABLE "processed_image" RENAME TO "processedImage";--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT "images_proccessedImageId_processed_image_id_fk";
--> statement-breakpoint
ALTER TABLE "processedImage" DROP CONSTRAINT "processed_image_queueId_queue_id_fk";
--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_proccessedImageId_processed_image_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_proccessedImageId_processedImage_id_fk" FOREIGN KEY ("proccessedImageId") REFERENCES "public"."processedImage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processedImage" ADD CONSTRAINT "processedImage_queueId_queue_id_fk" FOREIGN KEY ("queueId") REFERENCES "public"."queue"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_proccessedImageId_processedImage_id_fk" FOREIGN KEY ("proccessedImageId") REFERENCES "public"."processedImage"("id") ON DELETE cascade ON UPDATE no action;