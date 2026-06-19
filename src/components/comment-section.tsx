'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Flame, Loader2, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Comment } from '@/lib/types'

export function CommentSection({
  postId,
  currentUserId,
  onCommentAdded,
}: {
  postId: string
  currentUserId: string | null
  onCommentAdded: () => void
}) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reactions, setReactions] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchComments()
  }, [postId])

  async function fetchComments() {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .returns<Comment[]>()

    setComments(data ?? [])

    // Load user's comment reactions
    if (currentUserId && data?.length) {
      const ids = data.map(c => c.id)
      const { data: reactionData } = await supabase
        .from('reactions')
        .select('comment_id, emoji')
        .eq('user_id', currentUserId)
        .in('comment_id', ids)

      if (reactionData) {
        setReactions(Object.fromEntries(
          reactionData.map(r => [r.comment_id, r.emoji])
        ))
      }
    }

    setLoading(false)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !currentUserId) return
    setSubmitting(true)

    const { data: newComment } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: currentUserId, content: text.trim() })
      .select('*, profiles(username, avatar_url)')
      .returns<Comment[]>()
      .single()

    if (newComment) {
      // Update comment count on post
      await supabase.rpc('increment_comment_count', { post_id: postId })
      setComments(c => [...c, newComment])
      onCommentAdded()
    }

    setText('')
    setSubmitting(false)
  }

  async function handleReactComment(commentId: string) {
  if (!currentUserId) return

  if (reactions[commentId]) {
    await supabase
      .from('reactions')
      .delete()
      .eq('user_id', currentUserId)
      .eq('comment_id', commentId)

    await supabase.rpc('decrement_comment_reaction', { p_comment_id: commentId })

    setReactions(r => {
      const copy = { ...r }
      delete copy[commentId]
      return copy
    })
    setComments(c =>
      c.map(cm => cm.id === commentId
        ? { ...cm, reaction_count: Math.max(cm.reaction_count - 1, 0) }
        : cm)
    )
  } else {
    await supabase
      .from('reactions')
      .insert({ user_id: currentUserId, comment_id: commentId, emoji: '🔥' })

    await supabase.rpc('increment_comment_reaction', { p_comment_id: commentId })

    setReactions(r => ({ ...r, [commentId]: '🔥' }))
    setComments(c =>
      c.map(cm => cm.id === commentId
        ? { ...cm, reaction_count: cm.reaction_count + 1 }
        : cm)
    )
  }
}

  return (
    <div className="mt-4 border-t border-zinc-900 pt-4">

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={16} className="animate-spin text-zinc-600" />
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.length === 0 && (
            <p className="text-xs text-zinc-700 text-center py-2">No comments yet</p>
          )}
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                {comment.profiles?.avatar_url ? (
                  <img src={comment.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-purple-400">
                    {comment.profiles?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="rounded-xl bg-zinc-900 px-3 py-2">
                  <span className="text-xs font-semibold text-purple-400 mr-2">
                    @{comment.profiles?.username}
                  </span>
                  <span className="text-xs text-zinc-300">{comment.content}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 pl-2">
                  <span className="text-[10px] text-zinc-700">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  <button
                    onClick={() => handleReactComment(comment.id)}
                    disabled={!currentUserId}
                    className={`flex items-center gap-1 text-[10px] transition ${
                      reactions[comment.id]
                        ? 'text-orange-400'
                        : 'text-zinc-600 hover:text-orange-400'
                    }`}
                  >
                    <Flame size={11} />
                    {comment.reaction_count > 0 && comment.reaction_count}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment input */}
      {currentUserId && (
        <form onSubmit={handleComment} className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={500}
            className="flex-1 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-30 transition"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            {submitting
              ? <Loader2 size={13} className="animate-spin text-white" />
              : <Send size={13} className="text-white" />
            }
          </button>
        </form>
      )}

    </div>
  )
}