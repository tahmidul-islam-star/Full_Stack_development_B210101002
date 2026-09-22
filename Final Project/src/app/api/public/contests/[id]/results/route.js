import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContestResult from "@/models/ContestResult";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const results = await ContestResult.find({ contest: id })
      .populate("user", "name email studentId department avatarUrl codeforcesHandle")
      .sort({ problemsSolved: -1, rank: 1 });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
