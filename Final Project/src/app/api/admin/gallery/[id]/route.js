import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";
import { isAdminRequest } from "@/lib/adminAuth";
import { cleanupR2Upload } from "@/lib/r2";

const galleryFields = [
  "title",
  "description",
  "imageUrl",
  "category",
  "displayOrder",
  "isPublished",
];

export async function PUT(req, { params }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid gallery item ID." }, { status: 400 });
    }

    const body = await req.json();
    const updates = Object.fromEntries(
      galleryFields
        .filter((field) => Object.hasOwn(body, field))
        .map((field) => [field, body[field]])
    );
    if (Object.hasOwn(updates, "title") && !updates.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Gallery item title cannot be empty." },
        { status: 400 }
      );
    }
    if (Object.hasOwn(updates, "imageUrl") && !updates.imageUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Gallery item image is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existingItem = await GalleryItem.findById(id);
    if (!existingItem) {
      return NextResponse.json({ success: false, error: "Gallery item not found." }, { status: 404 });
    }
    const previousImageUrl = existingItem.imageUrl;
    const item = await GalleryItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    const warning =
      updates.imageUrl !== undefined && updates.imageUrl !== previousImageUrl
        ? await cleanupR2Upload(previousImageUrl)
        : null;
    return NextResponse.json({ success: true, data: item, warning });
  } catch (error) {
    console.error("Admin gallery update error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update gallery item." },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid gallery item ID." }, { status: 400 });
    }
    await connectToDatabase();
    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Gallery item not found." }, { status: 404 });
    }
    const warning = await cleanupR2Upload(item.imageUrl);
    return NextResponse.json({ success: true, data: item, warning });
  } catch (error) {
    console.error("Admin gallery delete error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to delete gallery item." },
      { status: 500 }
    );
  }
}
