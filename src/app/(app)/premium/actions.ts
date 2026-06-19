'use server'

import { createClient } from '@/lib/supabase/server'
import { createPaymentInvoice } from '@/lib/nowpayments'
import { PLANS, type PlanKey } from '@/lib/pricing'

export async function startCheckout(plan: PlanKey): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const selectedPlan = PLANS[plan]
  const orderId = `sub_${user.id}_${plan}_${Date.now()}`
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const { error: insertError } = await supabase.from('payments').insert({
    user_id: user.id,
    nowpayments_order_id: orderId,
    plan,
    amount_usd: selectedPlan.price_usd,
    status: 'pending',
    payment_type: 'subscription',
  })

  if (insertError) return { error: insertError.message }

  try {
    const invoice = await createPaymentInvoice({
      orderId,
      priceUsd: selectedPlan.price_usd,
      description: `QueerSpace ${selectedPlan.label} Premium`,
      successUrl: `${appUrl}/premium/success`,
      cancelUrl: `${appUrl}/premium`,
    })
    return { url: invoice.invoice_url }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Payment creation failed' }
  }
}