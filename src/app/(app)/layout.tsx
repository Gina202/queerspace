import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth/actions'
import Link from 'next/link'
import { Home, PlusSquare, User, Zap } from 'lucide-react'
import { NotificationBell } from '@/components/notification-bell'
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* Top nav — desktop */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/feed">
            <span className="text-lg font-bold tracking-tight"
              style={{ color: '#c084fc' }}>
              QueerSpace
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/feed"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
              <Home size={20} />
            </Link>
            <Link href="/post/create"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
              <PlusSquare size={20} />
            </Link>
            {/* Notification bell */}
            <NotificationBell userId={user.id} />
            <Link href="/profile"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
              <User size={20} />
            </Link>
            <Link href="/premium" className="p-2 rounded-lg transition" style={{ color: '#c084fc' }}>
              <Zap size={20} />
            </Link>
            <form action={logout} className="ml-2">
              <button
                type="submit"
                className="text-xs text-zinc-600 hover:text-zinc-400 transition px-2 py-1">
                out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-14 pb-20 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-8">
          <Link href="/feed"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-purple-400 transition">
            <Home size={22} />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/post/create"
            className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-4 shadow-lg shadow-purple-900/50"
              style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)' }}>
              <PlusSquare size={22} className="text-white" />
            </div>
          </Link>
          <Link href="/profile"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-purple-400 transition">
            <User size={22} />
            <span className="text-[10px]">Profile</span>
          </Link>
          <Link href="/premium"
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-purple-400 transition">
            <Zap size={22} />
            <span className="text-[10px]">Premium</span>
          </Link>
        </div>
      </nav>

    </div>
  )
}