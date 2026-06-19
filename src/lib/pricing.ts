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


export const BOOST_TIERS = {
  small: {
    label: 'Small boost',
    price_usd: 2.99,
    boost_points: 50,
    description: 'Give your post a nudge',
  },
  medium: {
    label: 'Medium boost',
    price_usd: 7.99,
    boost_points: 150,
    description: 'Push your post to the top',
  },
  large: {
    label: 'Large boost',
    price_usd: 14.99,
    boost_points: 350,
    description: 'Dominate the feed all day',
  },
} as const

export type BoostTier = keyof typeof BOOST_TIERS