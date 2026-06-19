'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Ban, CheckCircle, Loader2 } from 'lucide-react'
import { banUser, unbanUser } from '../actions'
import type { Profile } from '@/lib/types'

export function UserRow({ user }: { user: Profile }) {
  const [banned, setBanned] = useState(user.is_banned)
  const [loading, setLoading] = useState(false)

  async function handleToggleBan() {
    setLoading(true)
    if (banned) {
      await unbanUser(user.id)
      setBanned(false)
    } else {
      await banUser(user.id)
      setBanned(true)
    }
    setLoading(false)
  }

  return (
    <tr className="hover:bg-zinc-900/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-purple-400">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-white font-medium">@{user.username}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${
          user.role === 'admin'
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : user.role === 'moderator'
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            : 'bg-zinc-800 text-zinc-500 border-zinc-700'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs ${user.is_premium ? 'text-purple-400' : 'text-zinc-600'}`}>
          {user.is_premium ? '✓ Premium' : '—'}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs ${banned ? 'text-red-400' : 'text-green-400'}`}>
          {banned ? 'Banned' : 'Active'}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-zinc-600">
        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
      </td>
      <td className="px-4 py-3">
        {user.role !== 'admin' && (
          <button
            onClick={handleToggleBan}
            disabled={loading}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
              banned
                ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            {loading
              ? <Loader2 size={11} className="animate-spin" />
              : banned ? <CheckCircle size={11} /> : <Ban size={11} />
            }
            {banned ? 'Unban' : 'Ban'}
          </button>
        )}
      </td>
    </tr>
  )
}