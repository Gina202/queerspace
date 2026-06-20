'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, Loader2 } from 'lucide-react'

const MAX_IMAGES = 3

export default function CreatePostPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = MAX_IMAGES - images.length
    const toAdd = files.slice(0, remaining)

    for (const file of toAdd) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be under 10MB')
        return
      }
    }

    setImages(prev => [...prev, ...toAdd])
    setPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))])
    setError(null)

    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const image_urls: string[] = []

      // Upload all images
      for (const image of images) {
        const ext = image.name.split('.').pop()
        const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(path, image, { contentType: image.type })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(path)

        image_urls.push(urlData.publicUrl)
      }

      const { error: postError } = await supabase.from('posts').insert({
        content: content.trim(),
        image_url: image_urls[0] ?? null,
        image_urls,
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
          <span>{images.length}/{MAX_IMAGES} photos</span>
        </div>

       {/* Image previews grid */}
{previews.length > 0 && (
  <div className={`grid gap-1.5 rounded-xl overflow-hidden ${
    previews.length === 1 ? 'grid-cols-1' :
    previews.length === 2 ? 'grid-cols-2' :
    'grid-cols-2'
  }`}>
    {previews.map((preview, i) => (
      <div
        key={i}
        className={`relative overflow-hidden bg-zinc-900 ${
          previews.length === 3 && i === 0 ? 'col-span-2' : ''
        }`}
        style={{
          height: previews.length === 1 ? '280px' :
                  previews.length === 2 ? '200px' :
                  i === 0 ? '200px' : '140px'
        }}
      >
        <img
          src={preview}
          alt={`Preview ${i + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={() => removeImage(i)}
          className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black transition"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-1.5 left-1.5 bg-black/50 rounded-md px-1.5 py-0.5 text-[10px] text-white">
          {i + 1}/{previews.length}
        </div>
      </div>
    ))}
  </div>
)}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {images.length < MAX_IMAGES ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-400 transition"
            >
              <ImagePlus size={18} />
              {images.length === 0 ? 'Add photos' : 'Add more'}
            </button>
          ) : (
            <span className="text-xs text-zinc-600">Max 3 photos</span>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
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