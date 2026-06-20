import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/post-card'
import type { Post, Profile } from '@/lib/types'
import { Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single<Profile>()

  if (!profile || profile.is_banned || profile.is_bot) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('user_id', profile.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .returns<Post[]>()

  let userReactions: Record<string, string> = {}
  if (currentUser && posts?.length) {
    const postIds = posts.map(p => p.id)
    const { data: reactions } = await supabase
      .from('reactions')
      .select('post_id, emoji')
      .eq('user_id', currentUser.id)
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

  const isOwnProfile = currentUser?.id === profile.id
  const joinedAgo = formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })
  const totalReactions = postsWithReactions.reduce((sum, p) => sum + p.reaction_count, 0)
  const totalComments = postsWithReactions.reduce((sum, p) => sum + p.comment_count, 0)

  return (
    <div>
      <div className="px-4 pt-4 mb-2">
        <Link href="/feed" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
          ← Back to feed
        </Link>
      </div>

      <div className="px-4 py-6 border-b border-zinc-900">
        <div className="flex items-start gap-4">

          <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: '#c084fc' }}>
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-white">@{profile.username}</h1>
              {profile.is_premium && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)', color: 'white' }}>
                  Premium
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-600">
              <Calendar size={11} />
              <span>Joined {joinedAgo}</span>
            </div>
          </div>

          {isOwnProfile && (
            <Link href="/profile" className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition flex-shrink-0">
              Edit profile
            </Link>
          )}

        </div>

        <div className="flex items-center gap-6 mt-5">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{postsWithReactions.length}</p>
            <p className="text-xs text-zinc-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{totalReactions}</p>
            <p className="text-xs text-zinc-600">Reactions</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{totalComments}</p>
            <p className="text-xs text-zinc-600">Comments</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-zinc-900">
        {postsWithReactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-600">No posts yet</p>
          </div>
        ) : (
          postsWithReactions.map(post => (
            <PostCard key={post.id} post={post} currentUserId={currentUser?.id ?? null} />
          ))
        )}
      </div>
    </div>
  )
}