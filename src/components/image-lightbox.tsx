'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex)

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full p-2 bg-zinc-800/80 text-white hover:bg-zinc-700 transition"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-zinc-800/80 rounded-full px-3 py-1 text-xs text-white">
          {current + 1} / {images.length}
        </div>
      )}

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 z-10 rounded-full p-2 bg-zinc-800/80 text-white hover:bg-zinc-700 transition"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-screen w-full h-full flex items-center justify-center px-16 py-12"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg select-none"
          draggable={false}
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 z-10 rounded-full p-2 bg-zinc-800/80 text-white hover:bg-zinc-700 transition"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className={`rounded-md overflow-hidden transition border-2 ${
                i === current
                  ? 'border-purple-500 opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-75'
              }`}
              style={{ width: 48, height: 48 }}
            >
              <img
                src={img}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}