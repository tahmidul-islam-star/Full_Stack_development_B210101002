import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notice from "@/models/Notice";
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
    const notices = await Notice.find()
      .populate("author", "name email role designation")
      .sort({ isPinned: -1, createdAt: -1 });

    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const userRole = token?.role || session?.user?.role;
    const userId = token?.id || session?.user?.id;

    if (userRole !== "ADMIN" || !userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin required." },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const { title, content, category, isPinned, attachmentUrl } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required." },
        { status: 400 }
      );
    }

    const notice = await Notice.create({
      title,
      content,
      category: category || "ANNOUNCEMENT",
      isPinned: Boolean(isPinned),
      attachmentUrl: attachmentUrl || "",
      author: userId,
    });

    const populated = await notice.populate("author", "name email role designation");

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
