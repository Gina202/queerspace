'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#080808' }}
    >
      <div className="text-center max-w-sm">
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-500 mb-6">
          We hit an unexpected error. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            Try again
          </button>
          <Link
            href="/feed"
            className="rounded-lg px-5 py-2 text-sm font-semibold border border-zinc-700 text-zinc-400 hover:text-white transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}