import { createClient as createServiceClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function EngagementPage() {
  await requireAdmin()

  const [
    { count: totalBots },
    { count: activeBots },
    { count: pendingComments },
    { count: doneComments },
    { count: pendingReactions },
    { count: doneReactions },
    { count: templates },
  ] = await Promise.all([
    supabase.from('bot_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('bot_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('bot_comment_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bot_comment_queue').select('*', { count: 'exact', head: true }).eq('status', 'done'),
    supabase.from('bot_reaction_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bot_reaction_queue').select('*', { count: 'exact', head: true }).eq('status', 'done'),
    supabase.from('bot_comment_templates').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total bots', value: totalBots ?? 0, color: 'text-purple-400' },
    { label: 'Active bots', value: activeBots ?? 0, color: 'text-green-400' },
    { label: 'Comment templates', value: templates ?? 0, color: 'text-blue-400' },
    { label: 'Comments queued', value: pendingComments ?? 0, color: 'text-yellow-400' },
    { label: 'Comments sent', value: doneComments ?? 0, color: 'text-teal-400' },
    { label: 'Reactions queued', value: pendingReactions ?? 0, color: 'text-orange-400' },
    { label: 'Reactions sent', value: doneReactions ?? 0, color: 'text-pink-400' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold text-white">Engagement engine</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h3 className="text-sm font-semibold text-white mb-3">How it works</h3>
        <ul className="space-y-2 text-xs text-zinc-500">
          <li>→ When a post is approved, the wave scheduler picks bots and schedules comments and reactions over 1–6 hours</li>
          <li>→ Comments follow a slow start → growth → peak → decay curve across 5 waves</li>
          <li>→ Reactions are scheduled independently, slightly after comments begin</li>
          <li>→ Vercel cron runs every minute and processes due queue items</li>
          <li>→ Each bot comments only once per post, using its persona-matched template</li>
        </ul>
      </div>
    </div>
  )
}