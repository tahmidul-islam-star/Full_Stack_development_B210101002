import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notice from "@/models/Notice";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const notice = await Notice.findById(id).populate("author", "name email designation");
    if (!notice) {
      return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
