import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Notice from "@/models/Notice";
import Contest from "@/models/Contest";
import ContestApplication from "@/models/ContestApplication";
import ContestResult from "@/models/ContestResult";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);

    const userId = token?.id || session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userProfile = await User.findById(userId).select("-password");

    const myApplications = await ContestApplication.find({ user: userId })
      .populate("contest", "title contestDate platform status")
      .sort({ createdAt: -1 });

    const upcomingContests = await Contest.find({ status: { $ne: "COMPLETED" } })
      .sort({ contestDate: 1 })
      .limit(5);

    const recentNotices = await Notice.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(5);

    const myResults = await ContestResult.find({ user: userId })
      .populate("contest", "title contestDate")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      profile: userProfile,
      applications: myApplications || [],
      upcomingContests: upcomingContests || [],
      recentNotices: recentNotices || [],
      results: myResults || [],
    });
  } catch (error) {
    console.error("Member dashboard API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
