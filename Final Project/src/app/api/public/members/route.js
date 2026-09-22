import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { sortByDesignation } from "@/lib/designations";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "MEMBER";
    const status = searchParams.get("status") || "ACTIVE";
    const search = searchParams.get("search");

    let query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { codeforcesHandle: { $regex: search, $options: "i" } },
      ];
    }

    const rawUsers = await User.find(query)
      .select("-password")
      .lean();

    const sortedUsers = sortByDesignation(rawUsers);

    return NextResponse.json({ success: true, data: sortedUsers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
