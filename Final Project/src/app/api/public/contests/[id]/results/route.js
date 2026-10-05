import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";
import ContestResult from "@/models/ContestResult";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid contest ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const contest = await Contest.findOne({
      _id: id,
      isPublished: { $ne: false },
    }).select("_id");
    if (!contest) {
      return NextResponse.json(
        { success: false, error: "Contest not found." },
        { status: 404 }
      );
    }

    const results = await ContestResult.find({ contest: id })
      .populate("user", "name email studentId department avatarUrl codeforcesHandle")
      .sort({ problemsSolved: -1, rank: 1 });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
