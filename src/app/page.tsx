import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Flame, Shield, Zap, MessageCircle, Users, Lock } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already logged in — go straight to feed
  if (user) redirect('/feed')

  const features = [
    {
      icon: Flame,
      title: 'Real connections',
      description: 'A space built for the LGBTQ+ community. No algorithms hiding your voice.',
    },
    {
      icon: Shield,
      title: 'Safe & moderated',
      description: 'Every post is reviewed. Toxic behaviour is not tolerated.',
    },
    {
      icon: Zap,
      title: 'Premium experience',
      description: 'Unlock the full platform with Premium. Pay privately with crypto.',
    },
    {
      icon: MessageCircle,
      title: 'Real conversations',
      description: 'Comment, react, and engage with content that actually matters to you.',
    },
    {
      icon: Users,
      title: 'Your community',
      description: 'Find your people. Bears, twinks, daddies, divas — everyone welcome.',
    },
    {
      icon: Lock,
      title: 'Private by design',
      description: 'No ads. No data selling. No corporate nonsense.',
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight" style={{ color: '#c084fc' }}>
            QueerSpace
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white transition"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
            >
              Join free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #9333ea, transparent)' }} />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #c026d3, transparent)' }} />
        </div>

        <div className="relative text-center max-w-3xl mx-auto pt-14">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs text-purple-300 font-medium">Now open to everyone</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none mb-6">
            Your space.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #c084fc, #e879f9, #f0abfc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              No apologies.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10">
            A dark, fast, and unapologetic social platform built exclusively for the LGBTQ+ community.
            Connect, post, and be yourself.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white transition active:scale-95 shadow-lg shadow-purple-900/40"
              style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white transition"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-600">
            Free to join. 18+ only. No credit card required.
          </p>

        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">
              Built different
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              Not another generic social network. QueerSpace is designed from the ground up for us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 hover:border-zinc-700 transition"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #9333ea22, #c026d322)', border: '1px solid #9333ea33' }}>
                  <feature.icon size={18} style={{ color: '#c084fc' }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Premium teaser */}
      <section className="py-24 px-4 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">

          <div className="rounded-2xl p-8 sm:p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a0a2e, #0f0520)', border: '1px solid #9333ea33' }}>

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-30"
                style={{ background: 'radial-gradient(circle, #9333ea, transparent)' }} />
            </div>

            <div className="relative">
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6"
                style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)', color: 'white' }}>
                PREMIUM
              </span>
              <h2 className="text-3xl font-black text-white mb-4">
                Unlock everything
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Premium members get access to all comments, a premium badge,
                and priority features. Pay privately with crypto.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">$9.99</p>
                  <p className="text-xs text-zinc-500">per month</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-zinc-700" />
                <div className="text-center">
                  <p className="text-3xl font-black text-white">$59.99</p>
                  <p className="text-xs text-zinc-500">per year — save 50%</p>
                </div>
              </div>
              <Link
                href="/register"
                className="inline-block px-8 py-3 rounded-xl text-sm font-bold text-white transition active:scale-95"
                style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
              >
                Get started free
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 border-t border-zinc-900 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to join?
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            Thousands of LGBTQ+ people already call this home.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 rounded-xl text-base font-bold text-white transition active:scale-95 shadow-lg shadow-purple-900/40"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            Create your free account
          </Link>
          <p className="mt-4 text-xs text-zinc-700">
            18+ only · No ads · Crypto payments · Built with 🖤
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold" style={{ color: '#c084fc' }}>QueerSpace</span>
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} QueerSpace. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
              Sign in
            </Link>
            <Link href="/register" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
              Register
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}