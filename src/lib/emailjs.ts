// EmailJS configuration
// Set these in .env.local (and Vercel environment variables):
//   NEXT_PUBLIC_EMAILJS_SERVICE_ID   — e.g. "service_abc123"
//   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID  — e.g. "template_xyz789"
//   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY   — e.g. "abcDEFghiJKL1234"

export const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";

export const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";

export const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
