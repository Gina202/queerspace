import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature } from '@/lib/nowpayments'
import { PLANS } from '@/lib/pricing'

// Use service role key here — bypasses RLS for webhook processing
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-nowpayments-sig') ?? ''

  // Verify webhook signature
  const isValid = await verifyWebhookSignature(body, signature)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const {
    payment_id,
    order_id,
    payment_status,
  } = payload

  // Find the payment record
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('nowpayments_order_id', order_id)
    .single()

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  // Update payment record
  await supabase
    .from('payments')
    .update({
      nowpayments_payment_id: payment_id,
      status: payment_status,
      updated_at: new Date().toISOString(),
    })
    .eq('nowpayments_order_id', order_id)

  // Activate premium on finished payment
  if (payment_status === 'finished' && payment.payment_type === 'subscription') {
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

  // Deactivate if refunded
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