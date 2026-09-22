import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Notice from "@/models/Notice";
import Event from "@/models/Event";
import Contest from "@/models/Contest";
import ContestApplication from "@/models/ContestApplication";
import JoinApplication from "@/models/JoinApplication";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);

    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const [
      totalMembers,
      totalAdmins,
      totalNotices,
      totalEvents,
      totalContests,
      pendingApplications,
      pendingJoinApplications,
    ] = await Promise.all([
      User.countDocuments({ role: "MEMBER" }),
      User.countDocuments({ role: "ADMIN" }),
      Notice.countDocuments(),
      Event.countDocuments(),
      Contest.countDocuments(),
      ContestApplication.countDocuments({ status: "PENDING" }),
      JoinApplication.countDocuments({ status: "PENDING" }),
    ]);

    const recentApplications = await ContestApplication.find()
      .populate("user", "name email studentId department avatarUrl")
      .populate("contest", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJoinApplications = await JoinApplication.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers,
        totalAdmins,
        totalNotices,
        totalEvents,
        totalContests,
        pendingApplications,
        pendingJoinApplications,
      },
      recentApplications,
      recentJoinApplications,
      recentNotices,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
