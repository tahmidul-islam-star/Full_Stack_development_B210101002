import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Public site settings error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load site settings." },
      { status: 500 }
    );
  }
}
