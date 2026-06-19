'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { startCheckout } from './actions'
import type { PlanKey } from '@/lib/pricing'

export function CheckoutButton({ plan }: { plan: PlanKey }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)

    const result = await startCheckout(plan)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.url) {
      window.location.href = result.url
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 transition active:scale-95 whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
      >
        {loading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" />
            Loading...
          </span>
        ) : 'Subscribe'}
      </button>
      {error && (
        <span className="text-[11px] text-red-400">{error}</span>
      )}
    </div>
  )
}