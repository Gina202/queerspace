import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/post-card'
import type { Post } from '@/lib/types'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .eq('status', 'approved')
    .returns<Post[]>()
    .single()

  if (!post) notFound()

  let userReaction = null
  if (user) {
    const { data: reaction } = await supabase
      .from('reactions')
      .select('emoji')
      .eq('user_id', user.id)
      .eq('post_id', post.id)
      .single()
    userReaction = reaction ? { emoji: reaction.emoji } : null
  }

  const postWithReaction = { ...post, user_reaction: userReaction }

  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <a href="/feed" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
          ← Back to feed
        </a>
      </div>
      <PostCard post={postWithReaction} currentUserId={user?.id ?? null} />
    </div>
  )
}