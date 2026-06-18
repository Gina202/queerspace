'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, Loader2 } from 'lucide-react'

export default function CreatePostPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImage(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let image_url: string | null = null

      if (image) {
        const ext = image.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(path, image, { contentType: image.type })
        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(path)
        image_url = urlData.publicUrl
      }

      const { error: postError } = await supabase.from('posts').insert({
        content: content.trim(),
        image_url,
        user_id: user.id,
        status: 'pending',
      })

      if (postError) throw postError

      router.push('/feed')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-white mb-6">New post</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={1000}
          rows={5}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
        />

        <div className="flex items-center justify-between text-xs text-zinc-600">
          <span>{content.length}/1000</span>
        </div>

        {/* Image preview */}
        {preview && (
          <div className="relative rounded-xl overflow-hidden">
            <img src={preview} alt="Preview" className="w-full max-h-80 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black transition">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-400 transition">
            <ImagePlus size={18} />
            Add photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="rounded-lg px-6 py-2 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95"
            style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Posting...
              </span>
            ) : 'Post'}
          </button>
        </div>

      </form>

      <p className="mt-6 text-xs text-zinc-600 text-center">
        Posts are reviewed before appearing publicly.
      </p>
    </div>
  )
}