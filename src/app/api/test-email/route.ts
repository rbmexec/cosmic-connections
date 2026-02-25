export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const to = url.searchParams.get("to") || "test@example.com";
  const results: string[] = [];

  // Step 1: Check env var
  const apiKey = process.env.AUTH_RESEND_KEY;
  results.push(`1. AUTH_RESEND_KEY: ${apiKey ? "SET (" + apiKey.slice(0, 10) + "...)" : "MISSING"}`);

  // Step 2: Test database - write/read VerificationToken
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.verificationToken.create({
      data: {
        identifier: "test@test.com",
        token: "test-token-" + Date.now(),
        expires: new Date(Date.now() + 60000),
      },
    });
    results.push("2. DB VerificationToken write: OK");

    // Clean up
    await prisma.verificationToken.deleteMany({
      where: { identifier: "test@test.com" },
    });
    results.push("3. DB VerificationToken cleanup: OK");
  } catch (e) {
    results.push(`2. DB ERROR: ${e instanceof Error ? e.message : String(e)}`);
  }

  // Step 3: Test Resend API directly
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "astr <onboarding@resend.dev>",
          to,
          subject: "astr magic link test",
          html: "<p>If you see this, Resend is working!</p>",
        }),
      });
      const data = await res.json();
      results.push(`4. Resend API (${res.status}): ${JSON.stringify(data)}`);
    } catch (e) {
      results.push(`4. Resend API ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return new Response(results.join("\n"), {
    headers: { "Content-Type": "text/plain" },
  });
}
