import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'
import { Home, PlusSquare, User, Zap } from 'lucide-react'
import { NotificationBell } from '@/components/notification-bell'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Only redirect non-users away from protected sub-routes
  // Feed is allowed for guests — middleware handles the rest

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/feed">
            <span className="text-lg font-bold tracking-tight" style={{ color: '#c084fc' }}>
              QueerSpace
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/feed" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
              <Home size={20} />
            </Link>

            {user ? (
              <>
                <Link href="/post/create" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
                  <PlusSquare size={20} />
                </Link>
                <NotificationBell userId={user.id} />
                <Link href="/profile" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
                  <User size={20} />
                </Link>
                <Link href="/premium" className="p-2 rounded-lg transition" style={{ color: '#c084fc' }}>
                  <Zap size={20} />
                </Link>
                <form action={logout} className="ml-1">
                  <button type="submit" className="text-xs text-zinc-600 hover:text-zinc-400 transition px-2 py-1">
                    out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition px-3 py-1.5">
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white rounded-lg px-3 py-1.5 transition"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
                >
                  Join free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-14 pb-20 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom nav — mobile — only for logged in users */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-8">
            <Link href="/feed" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-purple-400 transition">
              <Home size={22} />
              <span className="text-[10px]">Home</span>
            </Link>
            <Link href="/post/create" className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-4 shadow-lg shadow-purple-900/50"
                style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}
              >
                <PlusSquare size={22} className="text-white" />
              </div>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-purple-400 transition">
              <User size={22} />
              <span className="text-[10px]">Profile</span>
            </Link>
          </div>
        </nav>
      )}

    </div>
  )
}