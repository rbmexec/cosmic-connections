import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

export function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(
  code: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(code, hashed);
}
