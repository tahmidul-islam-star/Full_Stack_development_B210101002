import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function isAdminRequest(req) {
  const [token, session] = await Promise.all([
    getToken({ req, secret: process.env.NEXTAUTH_SECRET }),
    getServerSession(authOptions),
  ]);

  return (token?.role || session?.user?.role) === "ADMIN";
}
