import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import JoinApplication from "@/models/JoinApplication";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, remarks } = body;

    await connectToDatabase();

    const application = await JoinApplication.findById(id);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    if (status) application.status = status;
    if (remarks !== undefined) application.remarks = remarks;

    await application.save();

    // If status changed to APPROVED, create or update the User account using the password from JoinApplication
    let createdUser = null;
    if (status === "APPROVED") {
      let userPassword = application.password;

      // Hash password if raw/unhashed
      if (userPassword && !userPassword.startsWith("$2a$") && !userPassword.startsWith("$2b$")) {
        userPassword = await bcrypt.hash(userPassword, 10);
      }

      let existingUser = await User.findOne({
        $or: [{ email: application.email.toLowerCase() }, { studentId: application.studentId }],
      });

      if (existingUser) {
        if (userPassword) existingUser.password = userPassword;
        existingUser.status = "ACTIVE";
        existingUser.name = application.name || existingUser.name;
        existingUser.department = application.department || existingUser.department;
        existingUser.session = application.session || existingUser.session;
        if (application.codeforcesHandle) existingUser.codeforcesHandle = application.codeforcesHandle;
        if (application.phone) existingUser.phone = application.phone;
        await existingUser.save();
        createdUser = existingUser;
      } else {
        createdUser = await User.create({
          name: application.name,
          email: application.email.toLowerCase(),
          password: userPassword || (await bcrypt.hash("member123", 10)),
          role: "MEMBER",
          studentId: application.studentId,
          department: application.department,
          session: application.session,
          codeforcesHandle: application.codeforcesHandle || "",
          phone: application.phone || "",
          designation: "Member",
          status: "ACTIVE",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status ? status.toLowerCase() : "updated"} successfully!`,
      data: application,
      userCreated: !!createdUser,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deletedApp = await JoinApplication.findByIdAndDelete(id);
    if (!deletedApp) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
