import {VALID_THEMES, VALID_FRAME_TYPES} from "@/constants/constants";
import {relations} from "drizzle-orm";
import {pgTable, uuid, text, timestamp, pgEnum, integer} from "drizzle-orm/pg-core";

export const Theme = pgEnum("theme", VALID_THEMES);

export const FrameType = pgEnum("frame_type", VALID_FRAME_TYPES);

export const QueueStatus = pgEnum("queueStatus", ["pending", "processing", "completed", "failed"]);

export const ProcessedImage = pgTable("processed_image", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  theme: Theme("theme").notNull(),
  type: FrameType("type").notNull(),
  slotCount: integer("slotCount").notNull(),
  quantity: integer("quantity").notNull(),
  filter: text("filter").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  queueId: uuid("queueId").references(() => Queue.id, {onDelete: "cascade"}),
});

export const Queue = pgTable("queue", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  status: QueueStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ImageTable = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  url: text("url").notNull(),
  slotPosition: integer("slotPosition"),
  proccessedImageId: uuid("proccessedImageId")
    .notNull()
    .references(() => ProcessedImage.id, {onDelete: "cascade"}),
});

export const VideoTable = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  url: text("url").notNull(),
  proccessedImageId: uuid("proccessedImageId")
    .notNull()
    .references(() => ProcessedImage.id, {onDelete: "cascade"}),
});

export const ImageRelation = relations(ImageTable, ({one}) => ({
  frame: one(ProcessedImage, {
    fields: [ImageTable.proccessedImageId],
    references: [ProcessedImage.id],
  }),
}));

export const ProcessedImageRelation = relations(ProcessedImage, ({many, one}) => ({
  images: many(ImageTable),
  video: one(VideoTable),
  queue: one(Queue, {
    fields: [ProcessedImage.queueId],
    references: [Queue.id],
  }),
}));

export const VideoRelation = relations(VideoTable, ({one}) => ({
  frame: one(ProcessedImage, {
    fields: [VideoTable.proccessedImageId],
    references: [ProcessedImage.id],
  }),
}));

export const QueueRelation = relations(Queue, ({many}) => ({
  processedImages: many(ProcessedImage),
}));
