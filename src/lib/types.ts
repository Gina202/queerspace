export type Profile = {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  is_premium: boolean
  role: 'user' | 'admin' | 'moderator'
  is_banned: boolean
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  content: string
  image_url: string | null
  image_urls: string[]
  status: 'pending' | 'approved' | 'rejected'
  boost_score: number
  reaction_count: number
  comment_count: number
  created_at: string
  profiles: Pick<Profile, 'username' | 'avatar_url'>
  user_reaction?: { emoji: string } | null
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  content: string
  reaction_count: number
  created_at: string
  profiles: Pick<Profile, 'username' | 'avatar_url'>
  user_reaction?: { emoji: string } | null
}

export type Reaction = {
  id: string
  user_id: string
  post_id: string | null
  comment_id: string | null
  emoji: string
  created_at: string
}