'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Flame, MessageCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

type Notification = {
  id: string
  type: 'comment' | 'reaction'
  post_id: string
  comment_id: string | null
  is_read: boolean
  created_at: string
  actor: {
    username: string
    avatar_url: string | null
  } | null
}

export function NotificationBell({ userId }: { userId: string }) {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        id,
        type,
        post_id,
        comment_id,
        is_read,
        created_at,
        actor:actor_id (
          username,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Notification fetch error:', error.message)
      return
    }

    if (data) {
      setNotifications(data as unknown as Notification[])
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
  }, [userId])

  // Fetch on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }
  async function clearAll() {
  await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)

  setNotifications([])
  setUnreadCount(0)
}

  async function handleOpen() {
    const next = !open
    setOpen(next)
    if (next && unreadCount > 0) {
      await markAllRead()
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 z-50 overflow-hidden">

          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchNotifications}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition"
              >
                Refresh
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-600 hover:text-white transition"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={24} className="mx-auto text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-600">No notifications yet</p>
                <p className="text-xs text-zinc-700 mt-1">
                  Get comments and reactions to see them here
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href={`/p/${n.post_id}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-zinc-900 transition border-b border-zinc-900/50 ${
                    !n.is_read ? 'bg-purple-500/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden mt-0.5">
                    {n.actor?.avatar_url ? (
                      <img
                        src={n.actor.avatar_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-purple-400">
                        {n.actor?.username?.[0]?.toUpperCase() ?? '?'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <span className="font-semibold text-white">
                        @{n.actor?.username ?? 'someone'}
                      </span>
                      {' '}
                      {n.type === 'comment'
                        ? 'commented on your post'
                        : 'reacted to your post'
                      }
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  <div className="flex-shrink-0 mt-0.5">
                    {n.type === 'comment'
                      ? <MessageCircle size={13} className="text-purple-400" />
                      : <Flame size={13} className="text-orange-400" />
                    }
                  </div>
                </Link>
              ))
            )}
          </div>

          {notifications.length > 0 && (
  <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between">
    <button
      onClick={markAllRead}
      className="text-xs text-zinc-600 hover:text-zinc-400 transition"
    >
      Mark all read
    </button>
    <button
      onClick={clearAll}
      className="text-xs text-red-800 hover:text-red-500 transition"
    >
      Clear all
    </button>
  </div>
)}

        </div>
      )}
    </div>
  )
}