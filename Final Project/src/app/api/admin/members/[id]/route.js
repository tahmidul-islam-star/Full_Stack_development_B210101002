import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
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
    const { id } = resolvedParams;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin required." },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    if (body.role) user.role = body.role;
    if (body.status) user.status = body.status;
    if (body.designation) user.designation = body.designation;
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email.toLowerCase();
    if (body.studentId !== undefined) user.studentId = body.studentId;
    if (body.department !== undefined) user.department = body.department;
    if (body.session !== undefined) user.session = body.session;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl;
    if (body.codeforcesHandle !== undefined) user.codeforcesHandle = body.codeforcesHandle;
    if (body.vjudgeHandle !== undefined) user.vjudgeHandle = body.vjudgeHandle;
    if (body.githubUrl !== undefined) user.githubUrl = body.githubUrl;

    if (body.password) {
      user.password = await bcrypt.hash(body.password, 10);
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({ success: true, data: userObj });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin required." },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin accounts cannot be deleted." },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
