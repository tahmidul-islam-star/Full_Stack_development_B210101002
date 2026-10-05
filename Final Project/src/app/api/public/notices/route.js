import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notice from "@/models/Notice";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const notices = await Notice.find({ isPublished: { $ne: false } })
      .populate("author", "name email role designation")
      .sort({ isPinned: -1, noticeDate: -1, createdAt: -1 });

    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
