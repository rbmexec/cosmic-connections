import { NextResponse } from "next/server";
import { sendVerification } from "@/lib/twilio";

export const dynamic = "force-dynamic";

const E164_REGEX = /^\+\d{7,15}$/;

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || !E164_REGEX.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const status = await sendVerification(phone);
    console.log(`[phone/send] Verification sent to ${phone}: ${status}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[phone/send] Error:", error);
    return NextResponse.json(
      { error: "Failed to send code. Please try again." },
      { status: 500 }
    );
  }
}
