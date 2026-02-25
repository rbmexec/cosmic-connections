import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendSms } from "@/lib/twilio";

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

    // Rate limit: max 3 OTPs per phone per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentCount = await prisma.phoneVerification.count({
      where: {
        phone,
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recentCount >= 3) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait and try again." },
        { status: 429 }
      );
    }

    const code = generateOtp();
    const hashed = await hashOtp(code);

    await prisma.phoneVerification.create({
      data: {
        phone,
        code: hashed,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      },
    });

    await sendSms(phone, `Your astr verification code is: ${code}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[phone/send] Error:", error);
    return NextResponse.json(
      { error: "Failed to send code. Please try again." },
      { status: 500 }
    );
  }
}
