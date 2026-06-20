'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 70%)' }}
    >
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#c084fc' }}>
              QueerSpace
            </h1>
          </Link>
          <p className="text-zinc-500 mt-2 text-sm">Your space. No apologies.</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur p-8">

          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#c084fc' }} />
              <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
              <p className="text-sm text-zinc-500 mb-6">
                We sent a password reset link to{' '}
                <span className="text-white">{email}</span>.
                It expires in 1 hour.
              </p>
              <p className="text-xs text-zinc-600 mb-6">
                Didn't get it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Reset password</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-zinc-400">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send reset link'}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}