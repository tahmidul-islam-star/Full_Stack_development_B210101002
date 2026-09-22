import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import JoinApplication from "@/models/JoinApplication";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query = {};
    if (status && status !== "ALL") {
      query.status = status;
    }

    const applications = await JoinApplication.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching join applications:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
