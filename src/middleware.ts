import { NextRequest, NextResponse } from "next/server";
// Use jose's JWT-only export to avoid JWE/CompressionStream Edge Runtime warnings
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "living-sky-admin-super-secret-key-32chars!!"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes (but not API routes — those guard themselves)
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
