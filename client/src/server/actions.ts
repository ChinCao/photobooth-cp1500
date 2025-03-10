"use server";

import {db} from "@/drizzle/db";
import {ImageTable, ProcessedImageTable, VideoTable} from "@/drizzle/schema";
export const createProcessedImage = async (id: string): Promise<{error: boolean}> => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return {error: true};
  }

  try {
    await db.insert(ProcessedImageTable).values({id});
    return {error: false};
  } catch (error) {
    console.error("Failed to create image:", error);
    return {error: true};
  }
};

export const createImage = async (href: string, processedImageId: string): Promise<{error: boolean}> => {
  try {
    await db.insert(ImageTable).values({url: href, proccessedImageId: processedImageId});
    return {error: false};
  } catch (error) {
    console.error("Failed to create image:", error);
    return {error: true};
  }
};

export const createVideo = async (href: string, processedImageId: string): Promise<{error: boolean}> => {
  try {
    await db.insert(VideoTable).values({url: href, proccessedImageId: processedImageId});
    return {error: false};
  } catch (error) {
    console.error("Failed to create video:", error);
    return {error: true};
  }
};
