import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — QueerSpace',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      <header className="border-b border-zinc-900 px-4 h-14 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="text-lg font-bold" style={{ color: '#c084fc' }}>
          QueerSpace
        </Link>
        <Link href="/register" className="text-xs text-zinc-500 hover:text-white transition">
          Create account
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">1. Introduction</h2>
            <p>
              QueerSpace ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.
            </p>
            <p>
              By using QueerSpace you consent to the data practices described in this policy. If you do not agree with this policy, please do not use the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>

            <h3 className="text-sm font-semibold text-zinc-300 mt-4">Information you provide directly</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address (used for authentication)</li>
              <li>Username (displayed publicly)</li>
              <li>Profile bio (displayed publicly if provided)</li>
              <li>Profile avatar (displayed publicly if provided)</li>
              <li>Posts, comments, and reactions you create</li>
              <li>Age confirmation (18+ verification checkbox)</li>
            </ul>

            <h3 className="text-sm font-semibold text-zinc-300 mt-4">Information collected automatically</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account creation timestamp</li>
              <li>Post and comment timestamps</li>
              <li>Payment transaction records (via NOWPayments)</li>
              <li>Subscription status and expiry dates</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, operate, and maintain the platform</li>
              <li>Authenticate your identity and secure your account</li>
              <li>Process payments and manage subscriptions</li>
              <li>Display your public profile and content to other users</li>
              <li>Send notifications about activity on your posts</li>
              <li>Enforce our Terms of Service and content policies</li>
              <li>Improve and develop the platform</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We do not sell your personal information to third parties. We do not use your data for advertising purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">4. Public Information</h2>
            <p>
              The following information is publicly visible to all users of the platform:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your username</li>
              <li>Your profile avatar</li>
              <li>Your profile bio</li>
              <li>Posts you create (after moderation approval)</li>
              <li>Comments you post</li>
              <li>Your reaction counts</li>
            </ul>
            <p>
              Your email address is never displayed publicly. Choose a username that does not reveal your real identity if anonymity is important to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">5. Payments and Financial Data</h2>
            <p>
              All payments on QueerSpace are processed through NOWPayments, a third-party cryptocurrency payment processor. We do not store your payment credentials, wallet addresses, or financial details on our servers.
            </p>
            <p>
              We store only the outcome of payment transactions — whether a payment was completed, the amount, and the resulting subscription or boost status. For NOWPayments' privacy practices, please refer to their privacy policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">6. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a managed database platform with industry-standard security practices including encryption at rest and in transit.
            </p>
            <p>
              We implement row-level security policies to ensure users can only access data they are authorized to view. While we take reasonable steps to protect your information, no method of transmission over the internet is 100% secure. Use the platform at your own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active. If you request account deletion, we will delete your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
            </p>
            <p>
              Content you have posted may remain visible even after account deletion unless you delete it before requesting account closure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The right to access the personal data we hold about you</li>
              <li>The right to correct inaccurate personal data</li>
              <li>The right to request deletion of your personal data</li>
              <li>The right to restrict or object to processing of your data</li>
              <li>The right to data portability</li>
            </ul>
            <p>
              To exercise any of these rights, contact us through the platform. We will respond to all requests within 30 days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">9. Cookies</h2>
            <p>
              QueerSpace uses cookies and similar technologies solely for authentication and session management. We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">10. Third Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-zinc-300">Supabase</span> — database, authentication, and file storage</li>
              <li><span className="text-zinc-300">NOWPayments</span> — cryptocurrency payment processing</li>
              <li><span className="text-zinc-300">Vercel</span> — platform hosting and deployment</li>
            </ul>
            <p>
              Each of these services has their own privacy policies. We encourage you to review them. We are not responsible for the privacy practices of these third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">11. Children's Privacy</h2>
            <p>
              QueerSpace is strictly for adults aged 18 and over. We do not knowingly collect personal information from anyone under 18. If we become aware that a minor has provided us with personal information, we will immediately delete their account and all associated data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on the platform. Continued use of QueerSpace after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">13. Contact</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us through the platform.
            </p>
          </section>

        </div>

      </main>

      <footer className="border-t border-zinc-900 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold" style={{ color: '#c084fc' }}>QueerSpace</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition">Terms</Link>
            <Link href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition">Privacy</Link>
            <Link href="/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}