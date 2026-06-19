import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'
import { UserRow } from './user-row'
import { UsersTable } from './users-table'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Profile[]>()

  return (
    <div className="space-y-4">
      <UsersTable users={users ?? []} />
    </div>
  )
}