import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContestApplication from "@/models/ContestApplication";
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
    const resolvedParams = await params;
    const contestId = resolvedParams.id;

    const applications = await ContestApplication.find({ contest: contestId })
      .populate("user", "name email studentId department session designation avatarUrl")
      .populate("contest", "title contestDate platform")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);

    const userRole = token?.role || session?.user?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { applicationId, status, remarks } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "applicationId and status are required." },
        { status: 400 }
      );
    }

    const application = await ContestApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    application.status = status;
    if (remarks !== undefined) application.remarks = remarks;

    await application.save();

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const PUT = PATCH;
