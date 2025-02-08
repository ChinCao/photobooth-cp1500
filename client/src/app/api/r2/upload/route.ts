import r2 from "@/lib/r2";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import type {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as string;
    const [, base64Data] = file.split(",");
    const buffer = Buffer.from(base64Data, "base64");
    const filename = formData.get("filename") as string;

    const putObjectCommand = new PutObjectCommand({
      Bucket: "vcp-photobooth",
      Key: filename,
      Body: buffer,
    });
    const response = await r2.send(putObjectCommand);
    return Response.json({response});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({error: error.message});
    }
    return Response.json({error: "An unknown error occurred"});
  }
}
