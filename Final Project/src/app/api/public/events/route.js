import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find({ isActive: true }).sort({ eventDate: 1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
