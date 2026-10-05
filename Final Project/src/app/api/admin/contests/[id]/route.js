import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";
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
      return NextResponse.json({ success: false, error: "Invalid contest ID." }, { status: 400 });
    }
    const contest = await Contest.findById(id);
    if (!contest) return NextResponse.json({ success: false, error: "Contest not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: contest });
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
      return NextResponse.json({ success: false, error: "Invalid contest ID." }, { status: 400 });
    }
    const body = await req.json();

    const allowedFields = [
      "title",
      "description",
      "platform",
      "contestUrl",
      "registrationLink",
      "resultLink",
      "contestDate",
      "registrationDeadline",
      "status",
      "isPublished",
      "isFeatured",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.hasOwn(body, field))
        .map((field) => [field, body[field]])
    );
    for (const field of ["contestDate", "registrationDeadline"]) {
      if (Object.hasOwn(updates, field)) {
        updates[field] = updates[field] ? new Date(updates[field]) : undefined;
        if (updates[field] && Number.isNaN(updates[field].getTime())) {
          return NextResponse.json(
            { success: false, error: `${field} is invalid.` },
            { status: 400 }
          );
        }
      }
    }
    const updated = await Contest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Contest not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
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
      return NextResponse.json({ success: false, error: "Invalid contest ID." }, { status: 400 });
    }
    const deleted = await Contest.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Contest not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Contest deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
