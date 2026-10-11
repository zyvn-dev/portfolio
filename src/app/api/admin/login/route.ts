import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

// Hardcoded fallbacks so login works even without env vars on Vercel
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
    const passMatch = password === ADMIN_PASSWORD;

    if (!emailMatch || !passMatch) {
      // Small delay to slow brute-force
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { message: "Invalid credentials. Check email and password." },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ email: ADMIN_EMAIL, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 h
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
