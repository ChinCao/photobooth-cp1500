import r2 from "@/lib/r2";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import type {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    const contentType = formData.get("contentType") as string;
    const filename = formData.get("filename") as string;

    // Convert Blob directly to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const putObjectCommand = new PutObjectCommand({
      Bucket: "vcp-photobooth",
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    });

    const result = await r2.send(putObjectCommand);

    return Response.json({
      success: true,
      response: result,
      size: buffer.length,
      filename,
      contentType,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Upload error details:", error);
      return Response.json({
        success: false,
        error: error.message,
        stack: error.stack,
      });
    }
    return Response.json({
      success: false,
      error: "An unknown error occurred",
    });
  }
}
