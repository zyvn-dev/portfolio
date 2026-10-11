import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "living-sky-admin-super-secret-key-change-in-prod"
);

export async function POST(req: NextRequest) {
  try {
    // Verify admin JWT cookie
    const token = req.cookies.get("admin_session")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Forbidden: Invalid or expired session" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const folder = body.folder || "portfolio";
    const timestamp = Math.round(new Date().getTime() / 1000);

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { message: "Cloudinary credentials are not configured on the server" },
        { status: 500 }
      );
    }

    // Cloudinary signature: sort parameters alphabetically
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return NextResponse.json({ signature, timestamp, apiKey, cloudName });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Cloudinary signing error:", error);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
