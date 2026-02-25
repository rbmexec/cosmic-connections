interface ReferralData {
  name: string;
  birthday: string; // "YYYY-MM-DD"
}

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return atob(b64);
}

export function encodeReferralData(data: ReferralData): string {
  return toBase64Url(JSON.stringify(data));
}

export function decodeReferralData(encoded: string): ReferralData | null {
  try {
    const json = fromBase64Url(encoded);
    const data = JSON.parse(json) as ReferralData;
    if (!data.name || !data.birthday) return null;
    return data;
  } catch {
    return null;
  }
}

export function buildReferralUrl(data: ReferralData): string {
  const encoded = encodeReferralData(data);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/chart/${encoded}`;
}

// ─── Comparison Links (two-person) ───

export interface ComparisonData {
  user: { name: string; birthday: string };
  connection: { name: string; birthday: string };
}

export function encodeComparisonData(data: ComparisonData): string {
  return toBase64Url(JSON.stringify(data));
}

export function decodeComparisonData(encoded: string): ComparisonData | null {
  try {
    const json = fromBase64Url(encoded);
    const data = JSON.parse(json) as ComparisonData;
    if (!data.user?.name || !data.user?.birthday || !data.connection?.name || !data.connection?.birthday) return null;
    return data;
  } catch {
    return null;
  }
}

export function buildComparisonUrl(data: ComparisonData): string {
  const encoded = encodeComparisonData(data);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/circle/${encoded}`;
}
