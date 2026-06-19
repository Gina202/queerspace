import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLANS } from '@/lib/pricing'
import { CheckoutButton } from './checkout-button'
import { Check, Zap } from 'lucide-react'

export default async function PremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_until')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium && profile?.premium_until
    ? new Date(profile.premium_until) > new Date()
    : false

  const freeFeatures = [
    'Create unlimited posts',
    'React to posts and comments',
    'View first 20 comments',
    'Basic profile',
  ]

  const premiumFeatures = [
    'Everything in free',
    'View all comments',
    'Premium badge on profile',
    'Priority support',
    'Early access to new features',
  ]

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, #9333ea22, #c026d322)', border: '1px solid #9333ea44' }}>
          <Zap size={24} style={{ color: '#c084fc' }} />
        </div>
        <h1 className="text-2xl font-bold text-white">Go Premium</h1>
        <p className="text-zinc-500 text-sm mt-2">Unlock the full experience</p>
      </div>

      {/* Already premium */}
      {isPremium && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 mb-6 text-center">
          <p className="text-sm text-purple-300 font-medium">
            ✓ You are a Premium member
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Active until {new Date(profile!.premium_until!).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Feature comparison */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Free</p>
          <ul className="space-y-2">
            {freeFeatures.map(f => (
              <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                <Check size={12} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0a2e, #0f0520)', border: '1px solid #9333ea44' }}>
          <div className="absolute top-0 right-0 text-[10px] font-bold px-2 py-1 rounded-bl-lg"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)', color: 'white' }}>
            PREMIUM
          </div>
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Premium</p>
          <ul className="space-y-2">
            {premiumFeatures.map(f => (
              <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                <Check size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#c084fc' }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Plans */}
      {!isPremium && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 text-center mb-4">Pay with crypto via NOWPayments</p>

          {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
            <div key={key}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{plan.label}</p>
                  {key === 'yearly' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: '#16a34a22', color: '#4ade80', border: '1px solid #16a34a44' }}>
                      SAVE 50%
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{plan.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">${plan.price_usd}</span>
                <CheckoutButton plan={key} />
              </div>
            </div>
          ))}

          <p className="text-[11px] text-zinc-700 text-center pt-2">
            Payments processed securely by NOWPayments. Crypto only.
          </p>
        </div>
      )}

    </div>
  )
}