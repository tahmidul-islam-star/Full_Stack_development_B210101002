import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await GalleryItem.find({ isPublished: { $ne: false } }).sort({
      displayOrder: 1,
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Public gallery load error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load gallery items." },
      { status: 500 }
    );
  }
}
