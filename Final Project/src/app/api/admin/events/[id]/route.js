import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Event from "@/models/Event";
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
      return NextResponse.json({ success: false, error: "Invalid event ID." }, { status: 400 });
    }
    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
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
      return NextResponse.json({ success: false, error: "Invalid event ID." }, { status: 400 });
    }
    const body = await req.json();

    const allowedFields = [
      "title",
      "description",
      "venue",
      "eventDate",
      "coverImage",
      "registrationLink",
      "status",
      "isActive",
      "isPublished",
      "isFeatured",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.hasOwn(body, field))
        .map((field) => [field, body[field]])
    );
    if (Object.hasOwn(updates, "eventDate")) {
      updates.eventDate = new Date(updates.eventDate);
      if (Number.isNaN(updates.eventDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "Event date is invalid." },
          { status: 400 }
        );
      }
    }
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }
    const previousCoverImage = existingEvent.coverImage;
    const updated = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    const warning =
      updates.coverImage !== undefined && updates.coverImage !== previousCoverImage
        ? await cleanupR2Upload(previousCoverImage)
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
      return NextResponse.json({ success: false, error: "Invalid event ID." }, { status: 400 });
    }
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }
    const warning = await cleanupR2Upload(deleted.coverImage);
    return NextResponse.json({ success: true, message: "Event deleted", warning });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
