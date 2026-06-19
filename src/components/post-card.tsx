'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Flame, MessageCircle, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CommentSection } from '@/components/comment-section'
import type { Post } from '@/lib/types'

export function PostCard({
  post,
  currentUserId,
}: {
  post: Post
  currentUserId: string | null
}) {
  const supabase = createClient()
  const [reactionCount, setReactionCount] = useState(post.reaction_count)
  const [userReaction, setUserReaction] = useState(post.user_reaction?.emoji ?? null)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post.comment_count)

  async function handleReact() {
  if (!currentUserId) return

  if (userReaction) {
    await supabase
      .from('reactions')
      .delete()
      .eq('user_id', currentUserId)
      .eq('post_id', post.id)

    await supabase.rpc('decrement_post_reaction', { p_post_id: post.id })

    setReactionCount(c => Math.max(c - 1, 0))
    setUserReaction(null)
  } else {
    await supabase
      .from('reactions')
      .insert({ user_id: currentUserId, post_id: post.id, emoji: '🔥' })

    await supabase.rpc('increment_post_reaction', { p_post_id: post.id })

    setReactionCount(c => c + 1)
    setUserReaction('🔥')
  }
}

  const avatar = post.profiles?.avatar_url
  const username = post.profiles?.username ?? 'unknown'
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <article className="px-4 py-5 hover:bg-zinc-900/30 transition-colors">

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Link href={`/u/${username}`}>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 ring-2 ring-transparent hover:ring-purple-500 transition">
            {avatar ? (
              <img src={avatar} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-purple-400">
                {username[0].toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <div>
          <Link href={`/u/${username}`}>
            <span className="text-sm font-semibold text-white hover:text-purple-400 transition">
              @{username}
            </span>
          </Link>
          <p className="text-xs text-zinc-600">{timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap mb-3">
        {post.content}
      </p>

      {/* Image */}
      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-3 bg-zinc-900">
          <img
            src={post.image_url}
            alt="Post image"
            className="w-full max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">

        <button
          onClick={handleReact}
          disabled={!currentUserId}
          className={`flex items-center gap-1.5 text-sm transition ${
            userReaction
              ? 'text-orange-400'
              : 'text-zinc-500 hover:text-orange-400'
          } disabled:opacity-30`}
        >
          <Flame size={17} className={userReaction ? 'fill-orange-400' : ''} />
          <span>{reactionCount}</span>
        </button>

        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-purple-400 transition"
        >
          <MessageCircle size={17} />
          <span>{commentCount}</span>
        </button>

        <button
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-purple-400 transition ml-auto"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ url: `${window.location.origin}/p/${post.id}` })
            }
          }}
        >
          <Share2 size={16} />
        </button>

      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post.id}
          currentUserId={currentUserId}
          onCommentAdded={() => setCommentCount(c => c + 1)}
        />
      )}

    </article>
  )
}