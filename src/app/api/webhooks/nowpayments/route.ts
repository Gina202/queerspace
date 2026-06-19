import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature } from '@/lib/nowpayments'
import { PLANS, BOOST_TIERS } from '@/lib/pricing'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-nowpayments-sig') ?? ''

  const isValid = await verifyWebhookSignature(body, signature)
  if (!isValid) {
    console.error('Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const { payment_id, order_id, payment_status } = payload

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('nowpayments_order_id', order_id)
    .single()

  if (!payment) {
    console.error('Payment not found:', order_id)
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  // Update payment status
  await supabase
    .from('payments')
    .update({
      nowpayments_payment_id: payment_id,
      status: payment_status,
      updated_at: new Date().toISOString(),
    })
    .eq('nowpayments_order_id', order_id)

  if (payment_status === 'finished') {

    // Handle subscription
    if (payment.payment_type === 'subscription') {
      const plan = PLANS[payment.plan as keyof typeof PLANS]
      const premiumUntil = new Date()
      premiumUntil.setDate(premiumUntil.getDate() + plan.duration_days)

      await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_until: premiumUntil.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.user_id)
    }

    // Handle boost
    if (payment.payment_type === 'boost' && payment.post_id) {
      const tier = BOOST_TIERS[payment.plan as keyof typeof BOOST_TIERS]

      await supabase
        .from('posts')
        .update({
          boost_score: supabase.rpc('increment_boost', {
            p_post_id: payment.post_id,
            p_points: tier.boost_points,
          }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.post_id)
    }
  }

  // Handle refunded subscription
  if (payment_status === 'refunded' && payment.payment_type === 'subscription') {
    await supabase
      .from('profiles')
      .update({
        is_premium: false,
        premium_until: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.user_id)
  }

  return NextResponse.json({ received: true })
}