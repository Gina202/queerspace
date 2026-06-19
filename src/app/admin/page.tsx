import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'
import { ModerationCard } from './moderation-card'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: pending } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .returns<Post[]>()

  const { data: recent } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .in('status', ['approved', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(20)
    .returns<Post[]>()

  const pendingCount = pending?.length ?? 0

  return (
    <div className="space-y-8">

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending review', value: pendingCount, color: 'text-yellow-400' },
          { label: 'Approved today', value: recent?.filter(p => p.status === 'approved').length ?? 0, color: 'text-green-400' },
          { label: 'Rejected today', value: recent?.filter(p => p.status === 'rejected').length ?? 0, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending queue */}
      <section>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          Pending review
          {pendingCount > 0 && (
            <span className="rounded-full bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5">
              {pendingCount}
            </span>
          )}
        </h2>

        {pendingCount === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
            <p className="text-zinc-600 text-sm">Queue is clear ✓</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending!.map(post => (
              <ModerationCard key={post.id} post={post} mode="pending" />
            ))}
          </div>
        )}
      </section>

      {/* Recently moderated */}
      <section>
        <h2 className="text-sm font-semibold text-white mb-4">Recently moderated</h2>
        <div className="space-y-3">
          {recent?.map(post => (
            <ModerationCard key={post.id} post={post} mode="reviewed" />
          ))}
        </div>
      </section>

    </div>
  )
}