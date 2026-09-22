import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/models/Event";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
