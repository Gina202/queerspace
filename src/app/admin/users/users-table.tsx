'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { UserRow } from './user-row'
import type { Profile } from '@/lib/types'

export function UsersTable({ users }: { users: Profile[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'banned' | 'premium' | 'admin'>('all')

  const filtered = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'active' ? !u.is_banned :
      filter === 'banned' ? u.is_banned :
      filter === 'premium' ? u.is_premium :
      filter === 'admin' ? u.role === 'admin' : true
    return matchesSearch && matchesFilter
  })

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'banned', label: 'Banned' },
    { key: 'premium', label: 'Premium' },
    { key: 'admin', label: 'Admin' },
  ]

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">
          All users
          <span className="ml-2 text-zinc-500 font-normal">
            ({filtered.length} of {users.length})
          </span>
        </h2>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by username..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        <div className="flex items-center gap-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                filter === f.key
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300 bg-transparent hover:bg-zinc-800'
              }`}
              style={filter === f.key
                ? { background: 'linear-gradient(135deg, #9333ea, #c026d3)' }
                : {}
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-600">
            No users match your search
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Premium</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(user => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}