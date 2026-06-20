'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validSession, setValidSession] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Supabase puts the token in the URL hash — exchange it for a session
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true)
      }
      setChecking(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)

    // Redirect to feed after 2 seconds
    setTimeout(() => router.push('/feed'), 2000)
  }

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 70%)' }}
      >
        <Loader2 size={24} className="animate-spin" style={{ color: '#c084fc' }} />
      </div>
    )
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
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur p-8">

          {done ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#c084fc' }} />
              <h2 className="text-lg font-semibold text-white mb-2">Password updated</h2>
              <p className="text-sm text-zinc-500">
                Redirecting you to the feed...
              </p>
            </div>
          ) : !validSession ? (
            <div className="text-center py-4">
              <AlertCircle size={40} className="mx-auto mb-4 text-red-400" />
              <h2 className="text-lg font-semibold text-white mb-2">Invalid or expired link</h2>
              <p className="text-sm text-zinc-500 mb-6">
                This reset link is no longer valid. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition"
                style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
              >
                Request new link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Set new password</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-zinc-400">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-zinc-400">Confirm password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repeat your password"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                {/* Password strength indicator */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all"
                          style={{
                            background: getStrengthColor(password, level),
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-600">
                      {getStrengthLabel(password)}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Updating...
                    </span>
                  ) : 'Update password'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++
  return score
}

function getStrengthColor(password: string, level: number): string {
  const strength = getPasswordStrength(password)
  if (strength < level) return '#27272a'
  if (strength <= 1) return '#ef4444'
  if (strength <= 2) return '#f97316'
  if (strength <= 3) return '#eab308'
  return '#22c55e'
}

function getStrengthLabel(password: string): string {
  const strength = getPasswordStrength(password)
  if (strength <= 1) return 'Weak'
  if (strength <= 2) return 'Fair'
  if (strength <= 3) return 'Good'
  return 'Strong'
}