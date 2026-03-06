import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[100dvh] bg-black text-white/80">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-violet-400 text-sm hover:underline">&larr; Back to app</Link>

        <h1 className="text-3xl font-light text-white mt-8 mb-2">Privacy Policy</h1>
        <p className="text-xs text-white/30 mb-10">Last updated: March 2026 &mdash; BH Strategic Advisory</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-medium text-white mb-3">1. Information We Collect</h2>
            <p className="mb-2">When you use astr, we collect:</p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li><strong className="text-white/80">Account information:</strong> Name, email address, and profile photo from your Google or Apple sign-in.</li>
              <li><strong className="text-white/80">Profile data:</strong> Birth date, location, occupation, and profile prompts you voluntarily provide.</li>
              <li><strong className="text-white/80">Usage data:</strong> Interactions within the app such as matches, messages, and swipes.</li>
              <li><strong className="text-white/80">Payment information:</strong> Processed securely through Stripe. We do not store your credit card details.</li>
              <li><strong className="text-white/80">Connected services:</strong> If you choose to connect Spotify or Instagram, we access limited public data from those platforms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>To create and maintain your account and profile.</li>
              <li>To calculate cosmic compatibility scores using numerology, western astrology, and Chinese zodiac.</li>
              <li>To facilitate matches and messaging between users.</li>
              <li>To process subscription payments.</li>
              <li>To improve our services and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">3. Data Sharing</h2>
            <p className="text-white/60">We do not sell your personal data. We share information only with:</p>
            <ul className="list-disc list-inside space-y-1 text-white/60 mt-2">
              <li><strong className="text-white/80">Other users:</strong> Your profile information is visible to other users for matching purposes.</li>
              <li><strong className="text-white/80">Service providers:</strong> Stripe for payments, authentication providers (Google, Apple), and hosting infrastructure.</li>
              <li><strong className="text-white/80">Legal requirements:</strong> When required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">4. Data Security</h2>
            <p className="text-white/60">We implement industry-standard security measures including encrypted connections (HTTPS), secure authentication via OAuth 2.0, and rate-limited API endpoints. Payment processing is handled entirely by Stripe, a PCI-compliant payment processor.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">5. Data Retention</h2>
            <p className="text-white/60">Your data is retained as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at the email below or through the in-app account settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">6. Account Deletion</h2>
            <p className="text-white/60 mb-2">You may delete your account and all associated data at any time. To do so:</p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Go to <strong className="text-white/80">Settings → Delete Account</strong> inside the app, or</li>
              <li>Email <a href="mailto:privacy@astr8.ai" className="text-violet-400 hover:underline">privacy@astr8.ai</a> with the subject line &quot;Delete My Account&quot;</li>
            </ul>
            <p className="text-white/60 mt-2">Upon deletion, all personal data including your profile, matches, and messages will be permanently removed within 30 days. Anonymized aggregate data may be retained for analytics purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">7. Your Rights</h2>
            <p className="text-white/60">Depending on your location, you may have the right to access, correct, delete, or export your personal data. California residents have additional rights under CCPA. EU/UK residents have rights under GDPR. To exercise these rights, contact us at the address below.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-white/60">astr is intended for users 17 and older. We do not knowingly collect personal information from anyone under 17. If you believe a minor has provided us with personal information, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">9. Cookies</h2>
            <p className="text-white/60">We use essential cookies for authentication and session management. We do not use third-party tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">10. Changes to This Policy</h2>
            <p className="text-white/60">We may update this policy from time to time. We will notify users of significant changes via the app or email. Continued use of the app after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-white mb-3">11. Contact</h2>
            <p className="text-white/60">For privacy-related questions or data requests, contact us at:</p>
            <p className="text-white/60 mt-2">
              <strong className="text-white/80">BH Strategic Advisory</strong><br />
              <a href="mailto:privacy@astr8.ai" className="text-violet-400 hover:underline">privacy@astr8.ai</a><br />
              <a href="https://www.astr8.ai" className="text-violet-400 hover:underline">www.astr8.ai</a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          astr &mdash; BH Strategic Advisory &copy; 2026
        </div>
      </div>
    </div>
  );
}
