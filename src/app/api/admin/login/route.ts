import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "muhammmadzainumer@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Opportunity@8478.";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "living-sky-admin-super-secret-key-change-in-prod"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (
      email?.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Issue a 24-hour JWT
    const token = await new SignJWT({ email: ADMIN_EMAIL, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
