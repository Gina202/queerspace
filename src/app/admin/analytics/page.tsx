import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: pendingPosts },
    { count: totalComments },
    { count: totalReactions },
    { count: premiumUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('reactions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
  ])

  const stats = [
    { label: 'Total users', value: totalUsers ?? 0, color: 'text-purple-400' },
    { label: 'Premium users', value: premiumUsers ?? 0, color: 'text-pink-400' },
    { label: 'Approved posts', value: totalPosts ?? 0, color: 'text-green-400' },
    { label: 'Pending posts', value: pendingPosts ?? 0, color: 'text-yellow-400' },
    { label: 'Total comments', value: totalComments ?? 0, color: 'text-blue-400' },
    { label: 'Total reactions', value: totalReactions ?? 0, color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-white">Platform analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-1.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center">
        <p className="text-xs text-zinc-600">
          Deeper analytics with charts and retention data coming in Phase 4.
        </p>
      </div>
    </div>
  )
}