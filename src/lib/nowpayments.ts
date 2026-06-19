const BASE_URL = 'https://api.nowpayments.io/v1'
const API_KEY = process.env.NOWPAYMENTS_API_KEY!

export async function createPaymentInvoice({
  orderId,
  priceUsd,
  description,
  successUrl,
  cancelUrl,
}: {
  orderId: string
  priceUsd: number
  description: string
  successUrl: string
  cancelUrl: string
}) {
  const res = await fetch(`${BASE_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_amount: priceUsd,
      price_currency: 'usd',
      order_id: orderId,
      order_description: description,
      success_url: successUrl,
      cancel_url: cancelUrl,
      is_fixed_rate: true,
      is_fee_paid_by_user: false,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'NOWPayments invoice creation failed')
  }

  return res.json() as Promise<{
    id: string
    invoice_url: string
    order_id: string
  }>
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET!
  const encoder = new TextEncoder()

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )

  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const hex = Array.from(new Uint8Array(mac))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return hex === signature
}