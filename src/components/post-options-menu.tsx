'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Trash2, Zap, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BoostModal } from './boost-modal'

export function PostOptionsMenu({
  postId,
  postStatus,
  isOwner,
}: {
  postId: string
  postStatus: 'pending' | 'approved' | 'rejected'
  isOwner: boolean
}) {
  const supabase = createClient()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showBoost, setShowBoost] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setDeleting(true)
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (!error) {
      router.refresh()
    }
    setDeleting(false)
    setOpen(false)
  }

  // Don't render if not owner and post isn't approved (nothing to show)
  if (!isOwner && postStatus !== 'approved') return null

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => { setOpen(v => !v); setConfirmDelete(false) }}
          className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition"
        >
          <MoreHorizontal size={16} />
        </button>

        {open && (
          <div className="absolute right-0 top-8 w-44 rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/50 z-50 overflow-hidden">

            {/* Boost — only for approved posts */}
            {postStatus === 'approved' && (
              <button
                onClick={() => { setOpen(false); setShowBoost(true) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition text-left"
              >
                <Zap size={14} style={{ color: '#c084fc' }} />
                Boost post
              </button>
            )}

            {/* Delete — only for owner */}
            {isOwner && (
              <>
                {postStatus === 'approved' && (
                  <div className="border-t border-zinc-800" />
                )}
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition text-left disabled:opacity-50 ${
                    confirmDelete
                      ? 'text-red-400 bg-red-950/30 hover:bg-red-950/50'
                      : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-900'
                  }`}
                >
                  {deleting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />
                  }
                  {confirmDelete ? 'Tap again to confirm' : 'Delete post'}
                </button>
              </>
            )}

          </div>
        )}
      </div>

      {/* Boost modal */}
      {showBoost && (
        <BoostModal postId={postId} onClose={() => setShowBoost(false)} />
      )}
    </>
  )
}