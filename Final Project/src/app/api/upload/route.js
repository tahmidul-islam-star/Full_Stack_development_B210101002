import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Sign in before uploading files." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "application/pdf",
    ]);
    const maxFileSize = file.type === "application/pdf" ? 15 * 1024 * 1024 : 10 * 1024 * 1024;
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Upload a JPG, PNG, WEBP, GIF, AVIF, or PDF file." },
        { status: 415 }
      );
    }
    if (file.size <= 0 || file.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 10 MB (15 MB for PDFs)." },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileUrl = await uploadToR2(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file to Cloudflare R2" },
      { status: 500 }
    );
  }
}
