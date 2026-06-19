'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'

export async function moderatePost(postId: string, status: 'approved' | 'rejected') {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function deletePost(postId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteComment(commentId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function banUser(userId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: true })
    .eq('id', userId)

  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function unbanUser(userId: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: false })
    .eq('id', userId)

  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}