import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import JoinApplication from "@/models/JoinApplication";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      name,
      studentId,
      email,
      password,
      phone,
      department,
      session,
      codeforcesHandle,
      paymentMethod,
      transactionNumber,
    } = body;

    if (
      !name ||
      !studentId ||
      !email ||
      !password ||
      !department ||
      !session ||
      !paymentMethod ||
      !transactionNumber
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if member user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { studentId }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An active user with this Email or Student ID is already registered.",
        },
        { status: 400 }
      );
    }

    // Check if there is already a PENDING join application for this Student ID or Email
    const existingApplication = await JoinApplication.findOne({
      $or: [{ email: email.toLowerCase() }, { studentId }],
      status: "PENDING",
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A pending application with this Student ID or Email is already under review.",
        },
        { status: 400 }
      );
    }

    // Hash password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    const application = await JoinApplication.create({
      name,
      studentId,
      email,
      password: hashedPassword,
      phone: phone || "",
      department,
      session,
      codeforcesHandle: codeforcesHandle || "",
      paymentMethod,
      transactionNumber,
      status: "PENDING",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your application to join the club has been submitted successfully!",
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting join application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
