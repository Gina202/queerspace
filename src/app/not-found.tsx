import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#080808' }}
    >
      <div className="text-center max-w-sm">
        <h1 className="text-6xl font-black mb-4" style={{ color: '#c084fc' }}>404</h1>
        <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-sm text-zinc-500 mb-8">
          This page doesn't exist or has been removed.
        </p>
        <Link
          href="/feed"
          className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition"
          style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
        >
          Back to feed
        </Link>
      </div>
    </div>
  )
}