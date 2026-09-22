import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const contest = await Contest.findById(id);
    if (!contest) return NextResponse.json({ success: false, error: "Contest not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: contest });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
