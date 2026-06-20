import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  // If no secret set, allow in development only
  if (!cronSecret) {
    return process.env.NODE_ENV === 'development'
  }
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date().toISOString()
  let commentsProcessed = 0
  let reactionsProcessed = 0
  const errors: string[] = []

  // Process due comments
  const { data: dueComments, error: commentFetchError } = await supabase
    .from('bot_comment_queue')
    .select('id, post_id, bot_id, content')
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .limit(50)

  if (commentFetchError) {
    errors.push(`Comment fetch error: ${commentFetchError.message}`)
  }

  if (dueComments && dueComments.length > 0) {
    for (const item of dueComments) {
      const { error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: item.post_id,
          user_id: item.bot_id,
          content: item.content,
        })

      if (!commentError) {
        await supabase
          .from('bot_comment_queue')
          .update({ status: 'done' })
          .eq('id', item.id)
        commentsProcessed++
      } else {
        errors.push(`Comment insert error: ${commentError.message}`)
        await supabase
          .from('bot_comment_queue')
          .update({ status: 'failed' })
          .eq('id', item.id)
      }
    }
  }

  // Process due reactions
  const { data: dueReactions, error: reactionFetchError } = await supabase
    .from('bot_reaction_queue')
    .select('id, post_id, bot_id, emoji')
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .limit(100)

  if (reactionFetchError) {
    errors.push(`Reaction fetch error: ${reactionFetchError.message}`)
  }

  if (dueReactions && dueReactions.length > 0) {
  for (const item of dueReactions) {

    // Check if already reacted
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', item.bot_id)
      .eq('post_id', item.post_id)
      .maybeSingle()

    if (existing) {
      // Already reacted — mark done silently, not failed
      await supabase
        .from('bot_reaction_queue')
        .update({ status: 'done' })
        .eq('id', item.id)
      continue
    }

    const { error: reactionError } = await supabase
      .from('reactions')
      .insert({
        post_id: item.post_id,
        user_id: item.bot_id,
        emoji: item.emoji,
      })

    if (!reactionError) {
      await supabase
        .from('bot_reaction_queue')
        .update({ status: 'done' })
        .eq('id', item.id)
      reactionsProcessed++
    } else {
      // Still a real error — mark done anyway to avoid retrying duplicates
      await supabase
        .from('bot_reaction_queue')
        .update({ status: 'done' })
        .eq('id', item.id)
      errors.push(`Reaction insert: ${reactionError.message}`)
    }
  }
}
  return NextResponse.json({
    ok: true,
    commentsProcessed,
    reactionsProcessed,
    errors,
    timestamp: now,
  })
}