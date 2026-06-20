import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  const navLinks = [
    { href: '/admin', label: 'Moderation' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/analytics', label: 'Analytics' },
    {href:  '/admin/engagement', label: 'Engagement'},
]

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      <header className="border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-red-400 tracking-widest uppercase">
              Admin
            </span>
            <nav className="flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/feed" className="text-xs text-zinc-600 hover:text-zinc-400 transition">
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}