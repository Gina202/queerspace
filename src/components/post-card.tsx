'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Flame, MessageCircle, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CommentSection } from '@/components/comment-section'
import { ImageLightbox } from '@/components/image-lightbox'
import type { Post } from '@/lib/types'

export function PostCard({
  post,
  currentUserId,
  isPremium = false,
}: {
  post: Post
  currentUserId: string | null
  isPremium?: boolean
}) {
  const supabase = createClient()
  const [reactionCount, setReactionCount] = useState(post.reaction_count)
  const [userReaction, setUserReaction] = useState(post.user_reaction?.emoji ?? null)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post.comment_count)
  const [reacting, setReacting] = useState(false)
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  async function handleReact() {
    if (!currentUserId || reacting) return
    setReacting(true)

    if (userReaction) {
      setUserReaction(null)
      setReactionCount(c => Math.max(c - 1, 0))
      await supabase
        .from('reactions')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
    } else {
      setUserReaction('🔥')
      setReactionCount(c => c + 1)
      await supabase
        .from('reactions')
        .insert({ user_id: currentUserId, post_id: post.id, emoji: '🔥' })
    }

    const { data } = await supabase
      .from('posts')
      .select('reaction_count')
      .eq('id', post.id)
      .single()

    if (data) setReactionCount(data.reaction_count)
    setReacting(false)
  }

  // Resolve images — prefer image_urls array, fall back to image_url
  const images = post.image_urls?.length
    ? post.image_urls
    : post.image_url
    ? [post.image_url]
    : []

  const avatar = post.profiles?.avatar_url
  const username = post.profiles?.username ?? 'unknown'
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <>
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

        {/* Image grid */}
        {images.length > 0 && (
          <div
            className={`grid gap-1 mb-3 rounded-xl overflow-hidden ${
              images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {images.map((url, i) => {
              // 3 images: first spans full width
              const isWide = images.length === 3 && i === 0
              return (
                <div
                  key={i}
                  onClick={() => setLightbox({ images, index: i })}
                  className={`relative overflow-hidden bg-zinc-900 cursor-pointer group ${
                    isWide ? 'col-span-2' : ''
                  }`}
                  style={{
                    height: images.length === 1 ? '320px' :
                            images.length === 2 ? '220px' :
                            isWide ? '220px' : '150px'
                  }}
                >
                  <img
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-200" />
                </div>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleReact}
            disabled={!currentUserId || reacting}
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
            isPremium={isPremium}
          />
        )}

      </article>

      {/* Lightbox */}
      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}