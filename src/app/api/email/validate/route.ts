import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation.server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const key = getRateLimitKey(request, "email-validate");
    const limit = rateLimit(key, { limit: 10, windowSec: 300 });

    if (!limit.allowed) {
      return NextResponse.json(
        { valid: false, error: "Too many attempts. Please wait and try again." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { valid: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await validateEmail(email);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[email/validate] Error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed. Please try again." },
      { status: 500 }
    );
  }
}
