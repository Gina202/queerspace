import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_until')
    .eq('id', user?.id ?? '')
    .single()

  const isPremium = profile?.is_premium && profile?.premium_until
    ? new Date(profile.premium_until) > new Date()
    : false

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles ( username, avatar_url )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20)
    .returns<Post[]>()

  // Get current user's reactions to these posts
  let userReactions: Record<string, string> = {}
  if (user && posts?.length) {
    const postIds = posts.map(p => p.id)
    const { data: reactions } = await supabase
      .from('reactions')
      .select('post_id, emoji')
      .eq('user_id', user.id)
      .in('post_id', postIds)

    if (reactions) {
      userReactions = Object.fromEntries(
        reactions.map(r => [r.post_id, r.emoji])
      )
    }
  }

  const postsWithReactions = posts?.map(post => ({
    ...post,
    user_reaction: userReactions[post.id] ? { emoji: userReactions[post.id] } : null,
  })) ?? []

  return (
    <div className="py-4">
      {postsWithReactions.length === 0 ? (
        <div className="px-4 py-20 text-center">
          <p className="text-zinc-600 text-sm">No posts yet.</p>
          <p className="text-zinc-700 text-xs mt-1">Be the first to post something 🔥</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-900">
          {postsWithReactions.map(post => (
            <PostCard key={post.id} post={post} currentUserId={user?.id ?? null} isPremium={isPremium} />
          ))}
        </div>
      )}
    </div>
  )
}