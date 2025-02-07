/* eslint-disable @typescript-eslint/no-explicit-any */
import type {NextRequest} from "next/server";
import {GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import S3 from "@/lib/r2";

export const runtime = "edge";

// Get Pre-Signed URL for Upload
export async function POST(request: NextRequest) {
  const {filename}: {filename: string} = await request.json();

  try {
    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: "vcp-photobooth",
        Key: filename,
      }),
      {
        expiresIn: 600,
      }
    );
    return Response.json({url});
  } catch (error: any) {
    return Response.json({error: error.message});
  }
}

// Get Pre-Signed URL for Download
export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get("filename") as string;
  try {
    const url = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: "vcp-photobooth",
        Key: filename,
      }),
      {
        expiresIn: 600,
      }
    );
    return Response.json({url});
  } catch (error: any) {
    return Response.json({error: error.message});
  }
}
