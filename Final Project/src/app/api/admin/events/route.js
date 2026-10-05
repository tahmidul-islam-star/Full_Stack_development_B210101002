import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const events = await Event.find().sort({ eventDate: -1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const {
      title,
      description,
      venue,
      eventDate,
      coverImage,
      registrationLink,
      status,
      isActive,
      isPublished,
      isFeatured,
    } = body;

    if (!title || !description || !venue || !eventDate) {
      return NextResponse.json(
        { success: false, error: "Title, description, venue, and event date are required." },
        { status: 400 }
      );
    }

    const parsedEventDate = new Date(eventDate);
    if (Number.isNaN(parsedEventDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Event date is invalid." },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title,
      description,
      venue,
      eventDate: parsedEventDate,
      coverImage: coverImage || "",
      registrationLink: registrationLink || "",
      status: status || "UPCOMING",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      isPublished: isPublished !== false,
      isFeatured: Boolean(isFeatured),
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
