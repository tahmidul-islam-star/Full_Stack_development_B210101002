import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const contests = await Contest.find({ isPublished: { $ne: false } }).sort({
      isFeatured: -1,
      contestDate: 1,
    });
    return NextResponse.json({ success: true, data: contests });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
