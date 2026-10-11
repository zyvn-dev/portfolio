import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "living-sky-admin-super-secret-key-32chars!!"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;
  let isValid = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // 1. /admin/login page
  if (pathname === "/admin/login") {
    // If already authenticated, redirect to /admin/dashboard
    if (isValid) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    // Otherwise allow access to the login page
    return NextResponse.next();
  }

  // 2. /admin root
  if (pathname === "/admin") {
    if (isValid) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // 3. All other /admin/* routes (/admin/dashboard, /admin/profile, /admin/projects, etc.)
  if (!isValid) {
    const loginUrl = new URL("/admin/login", req.url);
    const res = NextResponse.redirect(loginUrl);
    if (token) {
      // Invalidate bad cookie
      res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
