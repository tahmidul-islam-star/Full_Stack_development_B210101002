import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Advisor from "@/models/Advisor";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const advisors = await Advisor.find({
      isActive: true,
      isPublished: { $ne: false },
    }).sort({ displayOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: advisors });
  } catch (error) {
    console.error("Public advisor load error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load advisors." },
      { status: 500 }
    );
  }
}
