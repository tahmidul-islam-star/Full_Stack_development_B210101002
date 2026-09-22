import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";
import ContestApplication from "@/models/ContestApplication";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);

    const userId = token?.id || session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const contestId = resolvedParams.id;
    const body = await req.json();

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return NextResponse.json({ success: false, error: "Contest not found" }, { status: 404 });
    }

    const existingApp = await ContestApplication.findOne({
      contest: contestId,
      user: userId,
    });

    if (existingApp) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this contest." },
        { status: 400 }
      );
    }

    const application = await ContestApplication.create({
      contest: contestId,
      user: userId,
      teamName: body.teamName || "",
      teamMembers: body.teamMembers || [],
      status: "PENDING",
      remarks: body.remarks || "",
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
