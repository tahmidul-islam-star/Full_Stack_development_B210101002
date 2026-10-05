import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";
import { isAdminRequest } from "@/lib/adminAuth";

const galleryFields = [
  "title",
  "description",
  "imageUrl",
  "category",
  "displayOrder",
  "isPublished",
];

function galleryUpdates(body) {
  return Object.fromEntries(
    galleryFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

export async function GET(req) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();
    const items = await GalleryItem.find().sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Admin gallery load error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load gallery items." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      typeof body.imageUrl !== "string" ||
      !body.imageUrl.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "A title and uploaded image are required." },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const item = await GalleryItem.create(galleryUpdates(body));
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Admin gallery create error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create gallery item." },
      { status: 400 }
    );
  }
}
