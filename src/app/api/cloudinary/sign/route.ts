import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyAdminToken } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    const isAuthorized = await verifyAdminToken(idToken);

    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Forbidden: Access restricted to authorized administrator" },
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

    // Cloudinary signature formula:
    // Sort parameters alphabetically: folder=...&timestamp=...<API_SECRET>
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
    });
  } catch (error: any) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
