import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Notice from "@/models/Notice";
import { cleanupR2Upload } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid notice ID." }, { status: 400 });
    }
    const notice = await Notice.findById(id).populate("author", "name email designation");
    if (!notice) {
      return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid notice ID." }, { status: 400 });
    }
    const body = await req.json();

    const allowedFields = [
      "title",
      "content",
      "category",
      "isPinned",
      "isPublished",
      "noticeDate",
      "attachmentUrl",
      "externalLink",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.hasOwn(body, field))
        .map((field) => [field, body[field]])
    );
    if (Object.hasOwn(updates, "noticeDate")) {
      updates.noticeDate = updates.noticeDate ? new Date(updates.noticeDate) : null;
      if (updates.noticeDate && Number.isNaN(updates.noticeDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "Notice date is invalid." },
          { status: 400 }
        );
      }
    }
    const existingNotice = await Notice.findById(id);
    if (!existingNotice) {
      return NextResponse.json({ success: false, error: "Notice not found." }, { status: 404 });
    }
    const previousAttachmentUrl = existingNotice.attachmentUrl;
    const updated = await Notice.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("author", "name email designation");
    const warning =
      updates.attachmentUrl !== undefined && updates.attachmentUrl !== previousAttachmentUrl
        ? await cleanupR2Upload(previousAttachmentUrl)
        : null;
    return NextResponse.json({ success: true, data: updated, warning });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid notice ID." }, { status: 400 });
    }
    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Notice not found." }, { status: 404 });
    }
    const warning = await cleanupR2Upload(deleted.attachmentUrl);
    return NextResponse.json({ success: true, message: "Notice deleted", warning });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
