import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const personas = [
  'Dom', 'Twink', 'Bear', 'Daddy', 'Jock',
  'Verbose', 'ShortMean', 'Submissive', 'Humiliator',
]

const regions = [
  'US', 'UK', 'CA', 'AU', 'DE',
  'FR', 'NL', 'BE', 'SE', 'NO',
  'DK', 'ES', 'IT',
]

const adjectives = [
  'dark', 'wild', 'naughty', 'bold', 'fierce',
  'sultry', 'cheeky', 'raw', 'sinful', 'hot',
  'slick', 'rough', 'smooth', 'kinky', 'deep',
  'dirty', 'sweet', 'thick', 'tight', 'hard',
]

const nouns = [
  'wolf', 'cub', 'daddy', 'pup', 'bear',
  'fox', 'bull', 'king', 'rebel', 'hunter',
  'rogue', 'prince', 'beast', 'rider', 'ghost',
  'shadow', 'demon', 'angel', 'viper', 'storm',
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUsername(index: number): string {
  const adj = randomItem(adjectives)
  const noun = randomItem(nouns)
  const num = Math.floor(Math.random() * 999)
  return `${adj}_${noun}${num}`
}

async function seedBots() {
  console.log('Seeding 600 bot profiles...')

  const bots = Array.from({ length: 600 }, (_, i) => ({
    username: generateUsername(i),
    persona: randomItem(personas),
    region: randomItem(regions),
    activity_score: Math.floor(Math.random() * 80) + 20,
    is_active: true,
  }))

  // Insert in batches of 100
  for (let i = 0; i < bots.length; i += 100) {
    const batch = bots.slice(i, i + 100)

    // Insert into bot_profiles
    const { data: inserted, error } = await supabase
      .from('bot_profiles')
      .insert(batch)
      .select('id, username')

    if (error) {
      // Skip duplicate usernames
      if (error.code !== '23505') 
        console.error('Error inserting batch:', error.message)
     continue
    }

    // Create matchng profile rows so comments render with username
    if (inserted) {
        const profileRows = inserted.map(b => ({
            id: b.id,
            username: b.username,
            is_bot: true,
        }))

        const { error: profileError} = await supabase
            .from('profiles')
            .insert(profileRows)
        
        if (profileError) console.error('Profile insert error:', profileError.message)           
    }
    
    console.log(`Inserted bots ${i + 1}-${i + batch.length}`)
  }

  console.log('Done seeding bots.')
}

seedBots()