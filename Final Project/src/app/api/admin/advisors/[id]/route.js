import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Advisor from "@/models/Advisor";
import { isAdminRequest } from "@/lib/adminAuth";
import { cleanupR2Upload } from "@/lib/r2";

const advisorFields = [
  "name",
  "title",
  "designation",
  "department",
  "institution",
  "bio",
  "email",
  "avatarUrl",
  "websiteUrl",
  "linkedinUrl",
  "facebookUrl",
  "displayOrder",
  "isActive",
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
      return NextResponse.json({ success: false, error: "Invalid advisor ID." }, { status: 400 });
    }

    const body = await req.json();
    const updates = Object.fromEntries(
      advisorFields
        .filter((field) => Object.hasOwn(body, field))
        .map((field) => [field, body[field]])
    );
    if (Object.hasOwn(updates, "name") && !updates.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Advisor name cannot be empty." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existingAdvisor = await Advisor.findById(id);
    if (!existingAdvisor) {
      return NextResponse.json({ success: false, error: "Advisor not found." }, { status: 404 });
    }
    const previousAvatarUrl = existingAdvisor.avatarUrl;
    const advisor = await Advisor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    const warning =
      updates.avatarUrl !== undefined && updates.avatarUrl !== previousAvatarUrl
        ? await cleanupR2Upload(previousAvatarUrl)
        : null;
    return NextResponse.json({ success: true, data: advisor, warning });
  } catch (error) {
    console.error("Admin advisor update error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to update advisor." },
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
      return NextResponse.json({ success: false, error: "Invalid advisor ID." }, { status: 400 });
    }
    await connectToDatabase();
    const advisor = await Advisor.findByIdAndDelete(id);
    if (!advisor) {
      return NextResponse.json({ success: false, error: "Advisor not found." }, { status: 404 });
    }
    const warning = await cleanupR2Upload(advisor.avatarUrl);
    return NextResponse.json({ success: true, data: advisor, warning });
  } catch (error) {
    console.error("Admin advisor delete error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to delete advisor." },
      { status: 500 }
    );
  }
}
