import {S3Client} from "@aws-sdk/client-s3";

const CLOUDFARE_ACCOUNT_ID = process.env.CLOUDFARE_ACCOUNT_ID as string;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID as string;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY as string;

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export default R2;

export const uploadImageToR2 = async (image: string) => {
  try {
    const imageData = image;

    const contentType = imageData.split(";")[0].split(":")[1];
    const fileName = `${crypto.randomUUID()}.${contentType.split("/")[1]}`;

    const base64Data = imageData.split(",")[1];
    const blobData = new Blob([Buffer.from(base64Data, "base64")], {type: contentType});

    const formData = new FormData();
    formData.append("file", blobData, fileName);
    formData.append("contentType", contentType);
    formData.append("filename", fileName);

    const response = await fetch(`/api/r2/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.error || "Unknown error"}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
