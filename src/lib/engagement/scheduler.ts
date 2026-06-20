import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Wave timing in minutes from post approval
const WAVES = [
  { wave: 1, minMin: 5,   maxMin: 20,  commentCount: [1, 2], reactionCount: [2, 4] },
  { wave: 2, minMin: 25,  maxMin: 60,  commentCount: [2, 4], reactionCount: [4, 8] },
  { wave: 3, minMin: 70,  maxMin: 150, commentCount: [3, 6], reactionCount: [6, 12] },
  { wave: 4, minMin: 160, maxMin: 240, commentCount: [2, 4], reactionCount: [4, 8] },
  { wave: 5, minMin: 260, maxMin: 360, commentCount: [1, 2], reactionCount: [2, 5] },
]

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function scheduleEngagement(postId: string) {
  // Fetch active bots
  const { data: bots } = await supabase
    .from('bot_profiles')
    .select('id, persona')
    .eq('is_active', true)
    .limit(600)

  if (!bots || bots.length === 0) return

  // Fetch comment templates
  const { data: templates } = await supabase
    .from('bot_comment_templates')
    .select('id, content, persona')

  if (!templates || templates.length === 0) return

  const now = new Date()
  const usedBotIds = new Set<string>()
  const commentQueue: object[] = []
  const reactionQueue: object[] = []

  for (const wave of WAVES) {
    const commentCount = randomBetween(wave.commentCount[0], wave.commentCount[1])
    const reactionCount = randomBetween(wave.reactionCount[0], wave.reactionCount[1])

    // Pick unique bots for comments
    const availableBots = bots.filter(b => !usedBotIds.has(b.id))
    if (availableBots.length === 0) break

    for (let i = 0; i < commentCount; i++) {
      if (availableBots.length === 0) break
      const botIndex = Math.floor(Math.random() * availableBots.length)
      const bot = availableBots.splice(botIndex, 1)[0]
      usedBotIds.add(bot.id)

      // Pick a template matching persona or general
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

    // Pick bots for reactions (can overlap with comment bots)
    const reactionBots = bots
      .sort(() => Math.random() - 0.5)
      .slice(0, reactionCount)

    for (const bot of reactionBots) {
      const scheduledFor = new Date(now)
      // Reactions start after first comments
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
  await Promise.all([
    commentQueue.length > 0
      ? supabase.from('bot_comment_queue').insert(commentQueue)
      : Promise.resolve(),
    reactionQueue.length > 0
      ? supabase.from('bot_reaction_queue').insert(reactionQueue)
      : Promise.resolve(),
  ])

  console.log(
    `Scheduled ${commentQueue.length} comments and ${reactionQueue.length} reactions for post ${postId}`
  )
}