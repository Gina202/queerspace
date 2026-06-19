import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{ background: 'linear-gradient(135deg, #9333ea22, #c026d322)', border: '1px solid #9333ea44' }}>
          <CheckCircle size={32} style={{ color: '#c084fc' }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment received</h1>
        <p className="text-zinc-500 text-sm mb-2">
          Your payment is being confirmed on the blockchain. Premium will activate automatically within a few minutes.
        </p>
        <p className="text-zinc-600 text-xs mb-8">
          You will see your Premium badge on your profile once confirmed.
        </p>
        <Link href="/feed"
          className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition active:scale-95"
          style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}>
          Back to feed
        </Link>
      </div>
    </div>
  )
}