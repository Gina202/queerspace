'use server'

import { createClient } from '@/lib/supabase/server'
import { createPaymentInvoice } from '@/lib/nowpayments'
import { BOOST_TIERS, type BoostTier } from '@/lib/pricing'

export async function startBoost(
  postId: string,
  tier: BoostTier
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify post belongs to user
  const { data: post } = await supabase
    .from('posts')
    .select('id, status, user_id')
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()

  if (!post) return { error: 'Post not found' }
  if (post.status !== 'approved') return { error: 'Only approved posts can be boosted' }

  const selectedTier = BOOST_TIERS[tier]
  const orderId = `boost_${user.id}_${postId}_${Date.now()}`
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const { error: insertError } = await supabase.from('payments').insert({
    user_id: user.id,
    nowpayments_order_id: orderId,
    plan: tier,
    amount_usd: selectedTier.price_usd,
    status: 'pending',
    payment_type: 'boost',
    post_id: postId,
  })

  if (insertError) return { error: insertError.message }

  try {
    const invoice = await createPaymentInvoice({
      orderId,
      priceUsd: selectedTier.price_usd,
      description: `QueerSpace Boost — ${selectedTier.label}`,
      successUrl: `${appUrl}/boost/success`,
      cancelUrl: `${appUrl}/profile`,
    })
    return { url: invoice.invoice_url }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Boost creation failed' }
  }
}