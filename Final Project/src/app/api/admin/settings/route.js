import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { isAdminRequest } from "@/lib/adminAuth";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

const editableFields = [
  "clubName",
  "tagline",
  "clubDescription",
  "email",
  "facebookUrl",
  "universityUrl",
  "constitutionUrl",
  "copyrightText",
  "heroTitle",
  "heroSubtitle",
  "membershipCtaText",
  "membershipCtaUrl",
  "constitutionCtaText",
  "statistics",
];

export async function GET(req) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne({ key: "main" }).lean();
    return NextResponse.json({
      success: true,
      data: { ...DEFAULT_SITE_SETTINGS, ...settings },
    });
  } catch (error) {
    console.error("Admin settings load error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load site settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin required." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    if (
      typeof body.clubName !== "string" ||
      !body.clubName.trim() ||
      typeof body.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    ) {
      return NextResponse.json(
        { success: false, error: "A club name and valid club email are required." },
        { status: 400 }
      );
    }

    const updates = Object.fromEntries(
      editableFields
        .filter((field) => Object.hasOwn(body, field))
        .map((field) => [field, body[field]])
    );
    await connectToDatabase();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { $set: updates, $setOnInsert: { key: "main" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to save site settings." },
      { status: 400 }
    );
  }
}
