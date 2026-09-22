import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Contest from "@/models/Contest";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const contests = await Contest.find().sort({ contestDate: -1 });
    return NextResponse.json({ success: true, data: contests });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin required." }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const { title, description, platform, contestUrl, contestDate, registrationDeadline, status } = body;

    if (!title || !contestDate) {
      return NextResponse.json(
        { success: false, error: "Title and contest date are required." },
        { status: 400 }
      );
    }

    const contest = await Contest.create({
      title,
      description: description || "",
      platform: platform || "VJudge",
      contestUrl: contestUrl || "",
      contestDate: new Date(contestDate),
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
      status: status || "UPCOMING",
    });

    return NextResponse.json({ success: true, data: contest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
