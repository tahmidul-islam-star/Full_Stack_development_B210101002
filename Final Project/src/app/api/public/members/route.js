import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { sortByDesignation } from "@/lib/designations";
import { isExecutiveDesignation } from "@/lib/memberClasses";

export const dynamic = "force-dynamic";

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

    const rawUsers = await User.find(query).select("-password").lean();

    const visibleUsers = rawUsers.filter((user) => user.isProfileVisible !== false);
    const designationOrder = new Map(
      sortByDesignation(visibleUsers).map((user, index) => [
        user._id.toString(),
        index,
      ])
    );
    const sortedUsers = [...visibleUsers]
      .sort(
        (a, b) =>
          (a.displayOrder || 0) - (b.displayOrder || 0) ||
          designationOrder.get(a._id.toString()) -
            designationOrder.get(b._id.toString())
      )
      .map((user) => ({
      ...user,
      memberClass:
        user.memberClass === "EXECUTIVE_MEMBER" || isExecutiveDesignation(user.designation)
          ? "EXECUTIVE_MEMBER"
          : user.memberClass || "MEMBER",
      }));

    return NextResponse.json({ success: true, data: sortedUsers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
