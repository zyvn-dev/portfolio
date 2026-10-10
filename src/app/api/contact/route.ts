import { NextRequest, NextResponse } from "next/server";
import { ContactMessageSchema } from "@/lib/schemas";
import { adminDb } from "@/lib/firebase/admin";

// In-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    // Rate limiting: max 4 messages per IP per 10 minutes
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= 4) {
      return NextResponse.json(
        { message: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = ContactMessageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: parseResult.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot } = parseResult.data;

    // Honeypot check: If filled, it's a spam bot
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true }); // Silently ignore bot
    }

    // Save message via Admin Firestore
    await adminDb.collection("messages").add({
      name,
      email,
      message,
      createdAt: now,
      read: false,
      replied: false,
      ipHash: ip.substring(0, 7) + "...",
    });

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error processing contact form:", err);
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
