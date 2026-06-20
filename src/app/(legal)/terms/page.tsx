import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — QueerSpace',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* Nav */}
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
          <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using QueerSpace ("the Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform.
            </p>
            <p>
              These terms constitute a legally binding agreement between you and QueerSpace. We reserve the right to update these terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">2. Age Requirement</h2>
            <p>
              QueerSpace is an adult platform intended exclusively for users who are 18 years of age or older. By creating an account, you confirm and warrant that you are at least 18 years old.
            </p>
            <p>
              If we discover or have reason to believe that a user is under 18 years of age, we will immediately terminate their account and remove any content they have posted. We take age verification seriously and reserve the right to request proof of age at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">3. Account Registration</h2>
            <p>
              To use QueerSpace you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and truthful information during registration</li>
              <li>Keep your account credentials confidential</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Be responsible for all activity that occurs under your account</li>
              <li>Not create multiple accounts or share your account with others</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or that we determine, in our sole discretion, are being used inappropriately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">4. Content Standards</h2>
            <p>
              All content posted on QueerSpace is subject to moderation. By posting content you confirm that it does not:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Depict or involve minors in any sexual or inappropriate context</li>
              <li>Contain non-consensual content or content obtained without consent</li>
              <li>Constitute harassment, hate speech, or targeted abuse</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Contain malware, spam, or deceptive content</li>
              <li>Dox or expose the private information of others without consent</li>
            </ul>
            <p>
              All posts are reviewed before appearing publicly. We reserve the right to reject, remove, or restrict any content at our sole discretion without notice or explanation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">5. Adult Content</h2>
            <p>
              QueerSpace permits adult content between consenting adults. By using the platform you confirm you are legally permitted to view adult content in your jurisdiction. You are solely responsible for compliance with local laws regarding adult content.
            </p>
            <p>
              We strictly prohibit any content that depicts minors, non-consensual scenarios presented approvingly, or content that violates the laws of any jurisdiction. Violations will result in immediate account termination and may be reported to relevant authorities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">6. Premium Subscriptions</h2>
            <p>
              QueerSpace offers optional Premium subscriptions that unlock additional features. By purchasing a subscription you agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All payments are processed through NOWPayments in cryptocurrency</li>
              <li>Subscriptions are non-refundable unless required by applicable law</li>
              <li>We reserve the right to modify subscription pricing with reasonable notice</li>
              <li>Subscriptions do not guarantee any specific content availability</li>
              <li>We may terminate your subscription if you violate these terms</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibond text-white">7. Post Boosts</h2>
            <p>
              Users may pay to boost posts for increased visibility. Boost payments are non-refundable. Boost effectiveness is subject to the platform's ranking algorithm which may change at any time. Boosting a post does not guarantee any specific level of engagement or visibility.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">8. Intellectual Property</h2>
            <p>
              You retain ownership of content you post on QueerSpace. By posting content you grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content on the Platform.
            </p>
            <p>
              The QueerSpace name, logo, and platform design are our intellectual property. You may not use them without our express written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">9. Disclaimer of Warranties</h2>
            <p>
              QueerSpace is provided "as is" without warranties of any kind, express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components. We make no guarantees regarding the accuracy, reliability, or completeness of any content on the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, QueerSpace shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account and access to QueerSpace at any time, for any reason, with or without notice. Upon termination, your right to use the platform ceases immediately. Provisions of these terms that by their nature should survive termination shall survive.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">12. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration where permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">13. Contact</h2>
            <p>
              If you have questions about these Terms of Service please contact us through the platform.
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