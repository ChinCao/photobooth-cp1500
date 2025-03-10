"use server";

import {db} from "@/drizzle/db";
import {ProcessedImageTable} from "@/drizzle/schema";
export const createProcessedImage = async (id: string): Promise<{error: boolean | undefined}> => {
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
