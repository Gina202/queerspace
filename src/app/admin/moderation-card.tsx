'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Check, X, Trash2, Loader2 } from 'lucide-react'
import { moderatePost, deletePost } from './actions'
import type { Post } from '@/lib/types'

export function ModerationCard({
  post,
  mode,
}: {
  post: Post
  mode: 'pending' | 'reviewed'
}) {
  const [loading, setLoading] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [done, setDone] = useState(false)

  if (done) return null

  async function handleAction(action: 'approve' | 'reject' | 'delete') {
    setLoading(action)
    if (action === 'delete') {
      await deletePost(post.id)
    } else {
      await moderatePost(post.id, action === 'approve' ? 'approved' : 'rejected')
    }
    setDone(true)
    setLoading(null)
  }

  const username = post.profiles?.username ?? 'unknown'
  const avatar = post.profiles?.avatar_url
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  const statusBadge = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-purple-400">
                {username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-white">@{username}</span>
            <span className="text-xs text-zinc-600 ml-2">{timeAgo}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge[post.status]}`}>
          {post.status}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-zinc-300 mb-3 leading-relaxed">{post.content}</p>

      {post.image_url && (
        <div className="rounded-lg overflow-hidden mb-3">
          <img
            src={post.image_url}
            alt=""
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {mode === 'pending' && (
          <>
            <button
              onClick={() => handleAction('approve')}
              disabled={!!loading}
              className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition disabled:opacity-50"
            >
              {loading === 'approve'
                ? <Loader2 size={12} className="animate-spin" />
                : <Check size={12} />
              }
              Approve
            </button>

            <button
              onClick={() => handleAction('reject')}
              disabled={!!loading}
              className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50"
            >
              {loading === 'reject'
                ? <Loader2 size={12} className="animate-spin" />
                : <X size={12} />
              }
              Reject
            </button>
          </>
        )}

        <button
          onClick={() => handleAction('delete')}
          disabled={!!loading}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50 ml-auto"
        >
          {loading === 'delete'
            ? <Loader2 size={12} className="animate-spin" />
            : <Trash2 size={12} />
          }
          Delete
        </button>
      </div>

    </div>
  )
}