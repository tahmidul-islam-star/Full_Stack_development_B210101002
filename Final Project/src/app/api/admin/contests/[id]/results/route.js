import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContestResult from "@/models/ContestResult";
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

    const results = await ContestResult.find({ contest: id })
      .populate("user", "name email studentId department avatarUrl codeforcesHandle")
      .sort({ problemsSolved: -1, rank: 1 });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const { userId, problemsSolved, rating, rank, remarks } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    let result = await ContestResult.findOne({ contest: id, user: userId });

    if (result) {
      if (problemsSolved !== undefined) result.problemsSolved = problemsSolved;
      if (rating !== undefined) result.rating = rating;
      if (rank !== undefined) result.rank = rank;
      if (remarks !== undefined) result.remarks = remarks;
      await result.save();
    } else {
      result = await ContestResult.create({
        contest: id,
        user: userId,
        problemsSolved: problemsSolved || 0,
        rating: rating || 1000,
        rank: rank || 1,
        remarks: remarks || "",
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
