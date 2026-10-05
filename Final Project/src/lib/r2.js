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
  if (!accountId || !accessKeyId || !secretAccessKey || !publicUrl) {
    throw new Error(
      "Cloudflare R2 account credentials and R2_PUBLIC_URL must be configured before uploading files."
    );
  }

  const key = `uploads/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

export async function deleteFromR2(fileUrl) {
  const publicBaseUrl = publicUrl.replace(/\/$/, "");
  const objectPrefix = `${publicBaseUrl}/uploads/`;
  if (!fileUrl || !publicBaseUrl || !fileUrl.startsWith(objectPrefix)) return false;

  const key = fileUrl.slice(publicBaseUrl.length + 1).split(/[?#]/, 1)[0];
  if (!key || key.includes("..")) {
    throw new Error("Invalid Cloudflare R2 object URL.");
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
  return true;
}

export async function cleanupR2Upload(fileUrl) {
  try {
    await deleteFromR2(fileUrl);
    return null;
  } catch (error) {
    console.error("Cloudflare R2 upload cleanup failed:", error);
    return "The content was saved, but its previous uploaded file could not be removed from storage.";
  }
}
