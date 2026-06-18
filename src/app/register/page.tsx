import Link from 'next/link'
import { register } from '@/app/auth/actions'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 70%)' }}>
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight"
            style={{ color: '#c084fc' }}>
            QueerSpace
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">Your space. No apologies.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Create account</h2>

          <ErrorMessage searchParams={searchParams} />

          <form action={register} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={30}
                placeholder="e.g. darkprince"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* 18+ gate */}
            <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <input
                id="age_confirmed"
                name="age_confirmed"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-zinc-600 accent-purple-500 cursor-pointer"
              />
              <label htmlFor="age_confirmed" className="text-sm text-zinc-400 cursor-pointer">
                I confirm I am <span className="text-white font-medium">18 years of age or older</span> and agree to the Terms of Service
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition active:scale-95"
              style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
            >
              Create account
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  if (!params.error) return null
  return (
    <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
      {params.error}
    </div>
  )
}