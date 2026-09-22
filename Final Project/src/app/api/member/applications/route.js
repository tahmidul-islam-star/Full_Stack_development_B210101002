import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContestApplication from "@/models/ContestApplication";
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

    const applications = await ContestApplication.find({ user: userId })
      .populate("contest", "title contestDate platform status")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
