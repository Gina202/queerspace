'use client'

import { useState } from 'react'
import { Zap, Loader2, X } from 'lucide-react'
import { startBoost } from '../boost/actions'
import { BOOST_TIERS, type BoostTier } from '@/lib/pricing'

export function BoostButton({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<BoostTier | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleBoost(tier: BoostTier) {
    setLoading(tier)
    setError(null)
    const result = await startBoost(postId, tier)
    if (result.error) {
      setError(result.error)
      setLoading(null)
      return
    }
    if (result.url) window.location.href = result.url
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-purple-400 hover:border-purple-500/50 transition"
      >
        <Zap size={11} />
        Boost
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">Boost this post</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Push it higher in the feed</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              {(Object.entries(BOOST_TIERS) as [BoostTier, typeof BOOST_TIERS[BoostTier]][]).map(([key, tier]) => (
                <button
                  key={key}
                  onClick={() => handleBoost(key)}
                  disabled={!!loading}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between hover:border-purple-500/40 hover:bg-zinc-900 transition disabled:opacity-50 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{tier.label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{tier.description}</p>
                    <p className="text-xs text-purple-400 mt-1">+{tier.boost_points} boost points</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className="text-base font-bold text-white">${tier.price_usd}</span>
                    {loading === key && <Loader2 size={14} className="animate-spin text-purple-400" />}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-zinc-700 text-center mt-4">
              Paid via NOWPayments · Crypto only
            </p>

          </div>
        </div>
      )}
    </>
  )
}