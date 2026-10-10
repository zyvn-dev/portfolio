import { NextRequest, NextResponse } from "next/server";
import { ContactMessageSchema } from "@/lib/schemas";
import { adminDb } from "@/lib/firebase/admin";
import nodemailer from "nodemailer";

// In-memory rate limiting (IP → timestamps[])
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
    const timestamps = (rateLimitMap.get(ip) || []).filter(
      (t) => now - t < windowMs
    );

    if (timestamps.length >= 4) {
      return NextResponse.json(
        { message: "Too many messages. Please wait a few minutes before trying again." },
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

    // Honeypot – silently drop bots
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true });
    }

    // ── 1. Save to Firestore ────────────────────────────────────────────────
    try {
      await adminDb.collection("messages").add({
        name,
        email,
        message,
        createdAt: now,
        read: false,
        replied: false,
        ipHash: ip.substring(0, 7) + "...",
      });
    } catch (firestoreErr) {
      console.error("Firestore save error:", firestoreErr);
      // Continue even if Firestore fails – still send the email
    }

    // ── 2. Send email via Gmail SMTP ────────────────────────────────────────
    const gmailUser = process.env.GMAIL_USER;       // muhammmadzainumer@gmail.com
    const gmailPass = process.env.GMAIL_APP_PASSWORD; // Gmail App Password (16 chars)

    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${gmailUser}>`,
        to: gmailUser,
        replyTo: email,
        subject: `📬 New message from ${name} — Portfolio`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
            <div style="background:#1e293b;padding:24px 32px;border-bottom:1px solid #334155;">
              <h2 style="margin:0;font-size:18px;color:#38bdf8;">📬 New Portfolio Message</h2>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;width:80px;">From</td>
                  <td style="padding:8px 0;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#38bdf8;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;">Time</td>
                  <td style="padding:8px 0;font-size:13px;">${new Date(now).toLocaleString()}</td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid #334155;margin:20px 0;" />
              <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">Message:</p>
              <div style="background:#1e293b;padding:16px;border-radius:8px;line-height:1.7;white-space:pre-wrap;">${message}</div>
              <p style="margin-top:24px;font-size:12px;color:#475569;">
                Hit <strong>Reply</strong> to respond directly to ${name}.
              </p>
            </div>
          </div>
        `,
      });
    } else {
      console.warn(
        "GMAIL_USER or GMAIL_APP_PASSWORD not set — email notification skipped."
      );
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
