'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { BoostModal } from '@/components/boost-modal'

export function BoostButton({ postId }: { postId: string }) {
  const [showBoost, setShowBoost] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowBoost(true)}
        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-purple-400 hover:border-purple-500/50 transition"
      >
        <Zap size={11} />
        Boost
      </button>

      {showBoost && (
        <BoostModal postId={postId} onClose={() => setShowBoost(false)} />
      )}
    </>
  )
}