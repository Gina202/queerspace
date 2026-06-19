'use client'

import { useState, useRef, useTransition } from 'react'
import { Camera, Loader2, Check, AlertCircle, FileText, Flame, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { updateProfile, updateAvatar } from './actions'
import type { Profile } from '@/lib/types'
import { BoostButton } from './boost-button'
type PostSummary = {
  id: string
  content: string
  image_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  reaction_count: number
  comment_count: number
  created_at: string
}

export function ProfileForm({
  profile,
  posts,
}: {
  profile: Profile
  posts: PostSummary[]
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [avatarPending, setAvatarPending] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'posts'>('edit')

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview immediately
    const preview = URL.createObjectURL(file)
    setAvatarUrl(preview)
    setAvatarPending(true)

    const formData = new FormData()
    formData.append('avatar', file)
    const result = await updateAvatar(formData)

    if (result.error) {
      setAvatarUrl(profile.avatar_url)
      setMessage({ type: 'error', text: result.error })
    } else {
      if (result.avatar_url) setAvatarUrl(result.avatar_url)
      setMessage({ type: 'success', text: 'Avatar updated' })
    }
    setAvatarPending(false)
  }

  async function handleProfileUpdate(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Profile updated' })
      }
    })
  }

  const statusColor = {
    approved: 'text-green-500',
    pending: 'text-yellow-500',
    rejected: 'text-red-500',
  }

  const statusLabel = {
    approved: 'Live',
    pending: 'In review',
    rejected: 'Rejected',
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 ring-4 ring-purple-500">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold"
                style={{ color: '#c084fc' }}>
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Camera button */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={avatarPending}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-zinc-950 transition"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            {avatarPending
              ? <Loader2 size={13} className="animate-spin text-white" />
              : <Camera size={13} className="text-white" />
            }
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-white">@{profile.username}</p>
          {profile.is_premium && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)', color: 'white' }}>
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2.5 text-sm font-medium transition border-b-2 ${
            activeTab === 'edit'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Edit profile
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2.5 text-sm font-medium transition border-b-2 ${
            activeTab === 'posts'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          My posts ({posts.length})
        </button>
      </div>

      {/* Edit tab */}
      {activeTab === 'edit' && (
        <form action={handleProfileUpdate} className="space-y-4">

          {message && (
            <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border border-green-900 bg-green-950/50 text-green-400'
                : 'border border-red-900 bg-red-950/50 text-red-400'
            }`}>
              {message.type === 'success'
                ? <Check size={15} />
                : <AlertCircle size={15} />
              }
              {message.text}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400">Username</label>
            <input
              name="username"
              defaultValue={profile.username}
              required
              minLength={3}
              maxLength={30}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <p className="text-xs text-zinc-600">Letters, numbers and underscores only</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400">Bio</label>
            <textarea
              name="bio"
              defaultValue={profile.bio ?? ''}
              maxLength={160}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition active:scale-95"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </span>
            ) : 'Save changes'}
          </button>

        </form>
      )}

      {/* Posts tab */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={32} className="mx-auto text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-600">No posts yet</p>
            </div>
          ) : (
            posts.map(post => (
              <a key={post.id}
  href={post.status === 'approved' ? `/p/${post.id}` : undefined}
  className={`block rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2 transition ${
    post.status === 'approved' && 
    <BoostButton postId={post.id} />
      ? 'hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer'
      : 'cursor-default'
  }`}>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${statusColor[post.status]}`}>
                    ● {statusLabel[post.status]}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 line-clamp-2">{post.content}</p>

                {post.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.image_url}
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                  <span className="flex items-center gap-1 text-xs text-zinc-600">
                    <Flame size={12} /> {post.reaction_count}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-600">
                    <MessageCircle size={12} /> {post.comment_count}
                  </span>
                </div>

              </a>
            ))
          )}
        </div>
      )}

    </div>
  )
}