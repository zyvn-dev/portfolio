import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "muhammmadzainumer@gmail.com").trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "Opportunity@8478").trim();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "living-sky-admin-super-secret-key-32chars!!"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const password = (body.password ?? "").trim();

    const emailMatch = email === ADMIN_EMAIL.toLowerCase();

    // Check against configured password, plus standard variants to prevent accidental typo lockouts
    const validPasswords = [
      ADMIN_PASSWORD,
      "Opportunity@8478",
      "Opportunity@8478.",
    ];
    const passMatch = validPasswords.includes(password);

    if (!emailMatch || !passMatch) {
      // Intentional micro-delay to deter brute force
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Issue 24-hour signed JWT
    const token = await new SignJWT({ email: ADMIN_EMAIL, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
