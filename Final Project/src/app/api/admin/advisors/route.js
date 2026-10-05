import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Advisor from "@/models/Advisor";
import { isAdminRequest } from "@/lib/adminAuth";

const advisorFields = [
  "name",
  "title",
  "designation",
  "department",
  "institution",
  "bio",
  "email",
  "avatarUrl",
  "websiteUrl",
  "linkedinUrl",
  "facebookUrl",
  "displayOrder",
  "isActive",
  "isPublished",
];

function advisorUpdates(body) {
  return Object.fromEntries(
    advisorFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

export async function GET(req) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();
    const advisors = await Advisor.find().sort({ displayOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: advisors });
  } catch (error) {
    console.error("Admin advisor load error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load advisors." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Advisor name is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const advisor = await Advisor.create(advisorUpdates(body));
    return NextResponse.json({ success: true, data: advisor }, { status: 201 });
  } catch (error) {
    console.error("Admin advisor create error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to create advisor." },
      { status: 400 }
    );
  }
}
