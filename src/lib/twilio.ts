import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = Twilio(accountSid, authToken);

export async function sendVerification(phone: string) {
  const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: phone, channel: "sms" });

  return verification.status; // "pending"
}

export async function checkVerification(phone: string, code: string) {
  const check = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: phone, code });

  return { status: check.status, valid: check.valid };
}
