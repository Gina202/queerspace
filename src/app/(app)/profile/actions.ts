'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const username = (formData.get('username') as string).trim()
  const bio = (formData.get('bio') as string).trim()

  if (!username || username.length < 3) {
    return { error: 'Username must be at least 3 characters' }
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: 'Username can only contain letters, numbers and underscores' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username, bio, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'Username already taken' }
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { error: 'No file selected' }
  if (file.size > 5 * 1024 * 1024) return { error: 'Image must be under 5MB' }
  if (!file.type.startsWith('image/')) return { error: 'File must be an image' }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/avatar.${ext}`

  // Remove old avatar if exists
  await supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`])

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { contentType: file.type, upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Add cache-busting so browser loads fresh image
  const avatar_url = `${urlData.publicUrl}?t=${Date.now()}`

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/profile')
  return { success: true, avatar_url }
}