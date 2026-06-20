import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const WAVES = [
  { wave: 1, minMin: 3,   maxMin: 15,  commentCount: [3, 6],   reactionCount: [8, 15] },
  { wave: 2, minMin: 18,  maxMin: 45,  commentCount: [6, 12],  reactionCount: [15, 25] },
  { wave: 3, minMin: 50,  maxMin: 120, commentCount: [10, 18], reactionCount: [25, 40] },
  { wave: 4, minMin: 130, maxMin: 210, commentCount: [8, 14],  reactionCount: [20, 35] },
  { wave: 5, minMin: 220, maxMin: 300, commentCount: [5, 10],  reactionCount: [15, 25] },
  { wave: 6, minMin: 310, maxMin: 360, commentCount: [3, 6],   reactionCount: [10, 20] },
]

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function scheduleEngagement(postId: string) {
  const { data: bots } = await supabase
    .from('bot_profiles')
    .select('id, persona')
    .eq('is_active', true)
    .limit(600)

  if (!bots || bots.length === 0) {
    console.log('No active bots found')
    return
  }

  const { data: templates } = await supabase
    .from('bot_comment_templates')
    .select('id, content, persona')

  if (!templates || templates.length === 0) {
    console.log('No comment templates found')
    return
  }

  const now = new Date()
  const usedBotIds = new Set<string>()
  const usedReactionBotIds = new Set<string>()
  const commentQueue: object[] = []
  const reactionQueue: object[] = []

  for (const wave of WAVES) {
    const commentCount = randomBetween(wave.commentCount[0], wave.commentCount[1])

    // Pick unique bots for comments
    const availableCommentBots = bots.filter(b => !usedBotIds.has(b.id))
    if (availableCommentBots.length === 0) break

    for (let i = 0; i < commentCount; i++) {
      if (availableCommentBots.length === 0) break

      const botIndex = Math.floor(Math.random() * availableCommentBots.length)
      const bot = availableCommentBots.splice(botIndex, 1)[0]
      usedBotIds.add(bot.id)

      const matching = templates.filter(
        t => t.persona === bot.persona || t.persona === null
      )
      const template = randomItem(matching.length > 0 ? matching : templates)

      const scheduledFor = new Date(now)
      scheduledFor.setMinutes(
        scheduledFor.getMinutes() + randomBetween(wave.minMin, wave.maxMin)
      )

      commentQueue.push({
        post_id: postId,
        bot_id: bot.id,
        content: template.content,
        scheduled_for: scheduledFor.toISOString(),
        wave: wave.wave,
        status: 'pending',
      })
    }

    // Pick unique bots for reactions — each bot reacts only once per post
    const reactionCount = randomBetween(wave.reactionCount[0], wave.reactionCount[1])
    const availableReactionBots = bots.filter(b => !usedReactionBotIds.has(b.id))
    const selectedReactionBots = availableReactionBots
      .sort(() => Math.random() - 0.5)
      .slice(0, reactionCount)

    for (const bot of selectedReactionBots) {
      usedReactionBotIds.add(bot.id)

      const scheduledFor = new Date(now)
      scheduledFor.setMinutes(
        scheduledFor.getMinutes() + randomBetween(wave.minMin + 5, wave.maxMin + 10)
      )

      reactionQueue.push({
        post_id: postId,
        bot_id: bot.id,
        emoji: '🔥',
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending',
      })
    }
  }

  // Insert queues in parallel
  const results = await Promise.all([
    commentQueue.length > 0
      ? supabase.from('bot_comment_queue').insert(commentQueue)
      : Promise.resolve({ error: null }),
    reactionQueue.length > 0
      ? supabase.from('bot_reaction_queue').insert(reactionQueue)
      : Promise.resolve({ error: null }),
  ])

  results.forEach(({ error }) => {
    if (error) console.error('Queue insert error:', error.message)
  })

//   console.log(
//     `Scheduled ${commentQueue.length} comments and ${reactionQueue.length} reactions for post ${postId}`
//   )
}