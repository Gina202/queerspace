import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const templates = [
  // General engagement
  { content: "This is everything 🔥", persona: null, category: "general" },
  { content: "Said what needed to be said.", persona: null, category: "general" },
  { content: "Not me screaming at this 😭", persona: null, category: "general" },
  { content: "The accuracy tho", persona: null, category: "general" },
  { content: "I felt this in my soul.", persona: null, category: "general" },
  { content: "Okay but why is this so real", persona: null, category: "general" },
  { content: "Living for this energy rn", persona: null, category: "general" },
  { content: "This deserves way more attention.", persona: null, category: "general" },
  { content: "Bookmarking this forever.", persona: null, category: "general" },
  { content: "We love to see it 👏", persona: null, category: "general" },
  { content: "Manifesting this for myself tbh", persona: null, category: "general" },
  { content: "The way I needed to see this today", persona: null, category: "general" },
  { content: "Facts only in this community 💜", persona: null, category: "general" },
  { content: "Periodt. No further questions.", persona: null, category: "general" },
  { content: "This community never misses", persona: null, category: "general" },

  // Dom persona
  { content: "Good. Now do better.", persona: "Dom", category: "general" },
  { content: "Exactly the kind of energy I expect here.", persona: "Dom", category: "general" },
  { content: "You've earned that.", persona: "Dom", category: "general" },
  { content: "I approve.", persona: "Dom", category: "general" },
  { content: "That's the standard. Keep it.", persona: "Dom", category: "general" },

  // Bear persona
  { content: "Big bear energy right here 🐻", persona: "Bear", category: "general" },
  { content: "Come sit with us big guys 🍺", persona: "Bear", category: "general" },
  { content: "Bear approved 💪", persona: "Bear", category: "general" },
  { content: "The bears in the room are nodding", persona: "Bear", category: "general" },

  // Twink persona
  { content: "Obsessed with this omg 😍", persona: "Twink", category: "general" },
  { content: "Screaming crying throwing up this is so cute", persona: "Twink", category: "general" },
  { content: "Not me crying at a post again 😭✨", persona: "Twink", category: "general" },
  { content: "The vibes are immaculate", persona: "Twink", category: "general" },

  // Daddy persona
  { content: "That's my kind of post.", persona: "Daddy", category: "general" },
  { content: "Proud of whoever made this.", persona: "Daddy", category: "general" },
  { content: "Now that's how it's done.", persona: "Daddy", category: "general" },

  // Jock persona
  { content: "LFG 💪🔥", persona: "Jock", category: "general" },
  { content: "Absolute W post", persona: "Jock", category: "general" },
  { content: "Chad behaviour ngl", persona: "Jock", category: "general" },

  // Verbose persona
  { content: "There's something profoundly moving about seeing this articulated so clearly. Thank you for sharing.", persona: "Verbose", category: "general" },
  { content: "I think what makes this resonate is the authenticity behind it. We don't see enough of this.", persona: "Verbose", category: "general" },
  { content: "This captures something that I've been struggling to put into words for a long time.", persona: "Verbose", category: "general" },

  // ShortMean persona
  { content: "okay", persona: "ShortMean", category: "general" },
  { content: "sure", persona: "ShortMean", category: "general" },
  { content: "noted", persona: "ShortMean", category: "general" },
  { content: "moving on", persona: "ShortMean", category: "general" },

  // Humiliator persona
  { content: "Is this really the best you can do? Still showing up though 👀", persona: "Humiliator", category: "general" },
  { content: "The audacity 💀", persona: "Humiliator", category: "general" },

  // Submissive persona
  { content: "I would never be brave enough to post this. You're amazing.", persona: "Submissive", category: "general" },
  { content: "I just admire everything about this 🥺", persona: "Submissive", category: "general" },
  { content: "Can I be you please", persona: "Submissive", category: "general" },

  // Questions/Dating category
  { content: "Wait are you single though 👀", persona: null, category: "dating" },
  { content: "DMs open? Asking for a friend 😅", persona: null, category: "dating" },
  { content: "The one I've been looking for 😍", persona: null, category: "dating" },

  // Lifestyle
  { content: "This is the life ✨", persona: null, category: "lifestyle" },
  { content: "Goals honestly", persona: null, category: "lifestyle" },
  { content: "This is the energy I'm chasing", persona: null, category: "lifestyle" },

  // Confessions
  { content: "You're brave for this one 🙌", persona: null, category: "confessions" },
  { content: "We don't judge here 💜", persona: null, category: "confessions" },
  { content: "The honesty is refreshing tbh", persona: null, category: "confessions" },
  { content: "Thank you for saying this out loud", persona: null, category: "confessions" },

  // Humour
  { content: "I'm deceased 💀💀💀", persona: null, category: "humor" },
  { content: "Okay who let them cook like this 😭", persona: null, category: "humor" },
  { content: "The way I just spit out my drink", persona: null, category: "humor" },
  { content: "LMAOOO no because why", persona: null, category: "humor" },
]

async function seedComments() {
  console.log('Seeding comment templates...')
  const { error } = await supabase
    .from('bot_comment_templates')
    .insert(templates)

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log(`Seeded ${templates.length} comment templates.`)
  }
}

seedComments()