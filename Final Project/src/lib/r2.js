import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET || "cpc";
const publicUrl = process.env.R2_PUBLIC_URL || "";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export async function uploadToR2(buffer, fileName, contentType) {
  const key = `uploads/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL or fallback path
  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, "")}/${key}`;
  }
  return `/api/files/${key}`;
}

export async function deleteFromR2(fileUrl) {
  if (!fileUrl) return;

  try {
    let key = "";
    if (publicUrl && fileUrl.startsWith(publicUrl)) {
      key = fileUrl.replace(`${publicUrl.replace(/\/$/, "")}/`, "");
    } else {
      const parts = fileUrl.split("/uploads/");
      if (parts.length > 1) {
        key = `uploads/${parts[1]}`;
      }
    }

    if (key) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await r2Client.send(command);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudflare R2:", error);
  }
}
