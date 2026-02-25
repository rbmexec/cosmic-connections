import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-[100dvh] bg-black text-white/80">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-400 text-sm hover:underline">&larr; Back to app</Link>

        <h1 className="text-3xl font-light text-white mt-8 mb-2">Terms of Service</h1>
        <p className="text-xs text-white/30 mb-10">Last updated: February 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-medium text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-white/60">By accessing or using astr (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">2. Eligibility</h2>
            <p className="text-white/60">You must be at least 18 years old to use astr. By creating an account, you represent that you meet this age requirement.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">3. Account Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You agree to provide accurate and truthful profile information.</li>
              <li>You may not create multiple accounts or impersonate others.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">4. Acceptable Use</h2>
            <p className="mb-2 text-white/60">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Harass, threaten, or abuse other users.</li>
              <li>Post offensive, explicit, or illegal content.</li>
              <li>Use the Service for commercial solicitation or spam.</li>
              <li>Attempt to reverse-engineer, hack, or compromise the Service.</li>
              <li>Use automated tools to access the Service (bots, scrapers, etc.).</li>
              <li>Violate any applicable laws or regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">5. Subscriptions & Payments</h2>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>astr offers free and paid subscription tiers (Pro, Cosmic+).</li>
              <li>Paid subscriptions are billed through Stripe on a recurring basis.</li>
              <li>You may cancel your subscription at any time. Access continues until the end of your current billing period.</li>
              <li>Refunds are handled on a case-by-case basis. Contact support for assistance.</li>
              <li>We reserve the right to change pricing with reasonable notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">6. Cosmic Compatibility</h2>
            <p className="text-white/60">astr provides compatibility scores and insights based on numerology, western astrology, and Chinese zodiac for entertainment and personal discovery purposes. These readings are not scientific predictions and should not be used as the sole basis for relationship decisions.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">7. Intellectual Property</h2>
            <p className="text-white/60">All content, design, and functionality of astr are owned by us and protected by applicable intellectual property laws. You may not copy, reproduce, or distribute any part of the Service without our written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">8. Content You Submit</h2>
            <p className="text-white/60">By submitting profile information, messages, and other content, you grant us a non-exclusive, royalty-free license to use, display, and distribute that content within the Service. You retain ownership of your content and may delete it at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">9. Termination</h2>
            <p className="text-white/60">We may suspend or terminate your account if you violate these terms. You may delete your account at any time by contacting support. Upon termination, your right to use the Service ceases immediately.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">10. Disclaimers</h2>
            <p className="text-white/60">The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy of compatibility readings, the behavior of other users, or uninterrupted availability of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">11. Limitation of Liability</h2>
            <p className="text-white/60">To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">12. Changes to Terms</h2>
            <p className="text-white/60">We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">13. Contact</h2>
            <p className="text-white/60">For questions about these terms, contact us at <a href="mailto:support@astr.app" className="text-violet-400 hover:underline">support@astr.app</a>.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          astr &mdash; Cosmic Connections
        </div>
      </div>
    </div>
  );
}
