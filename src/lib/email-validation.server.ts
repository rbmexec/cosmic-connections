/**
 * Server-only email validation — uses Node dns module for MX record checks.
 */

import { resolveMx, resolve4 } from "node:dns/promises";
import {
  isValidEmailFormat,
  isDisposableEmail,
  detectEmailTypo,
} from "./email-validation";

async function hasMxRecords(email: string): Promise<boolean> {
  const domain = email.trim().split("@")[1]?.toLowerCase();
  if (!domain) return false;

  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DNS timeout")), 5000)
      ),
    ]);
    return records.length > 0;
  } catch {
    // Fallback: check for A records (some domains serve mail without MX)
    try {
      const aRecords = await Promise.race([
        resolve4(domain),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("DNS timeout")), 5000)
        ),
      ]);
      return aRecords.length > 0;
    } catch {
      return false;
    }
  }
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  const trimmed = email.trim();

  if (!isValidEmailFormat(trimmed)) {
    return { valid: false, error: "Invalid email format" };
  }

  if (isDisposableEmail(trimmed)) {
    return { valid: false, error: "Disposable email addresses are not allowed" };
  }

  const suggestion = detectEmailTypo(trimmed) ?? undefined;

  const hasMx = await hasMxRecords(trimmed);
  if (!hasMx) {
    return {
      valid: false,
      error: "This email domain doesn't appear to accept mail",
      suggestion,
    };
  }

  return { valid: true, suggestion };
}
