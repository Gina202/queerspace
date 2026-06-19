export const PLANS = {
  monthly: {
    label: 'Monthly',
    price_usd: 9.99,
    duration_days: 30,
    description: 'Billed every month',
  },
  yearly: {
    label: 'Yearly',
    price_usd: 59.99,
    duration_days: 365,
    description: 'Save 50% — billed once a year',
  },
} as const

export type PlanKey = keyof typeof PLANS