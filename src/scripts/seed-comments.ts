import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const templates = [
  // ==================== GENERAL ====================
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

  // 20 NEW GENERAL
  { content: "This one hit different 🔥", persona: null, category: "general" },
  { content: "No notes. Perfect.", persona: null, category: "general" },
  { content: "Saving this for later", persona: null, category: "general" },
  { content: "The vibe is immaculate", persona: null, category: "general" },
  { content: "This is why I come here", persona: null, category: "general" },
  { content: "Big agree energy", persona: null, category: "general" },
  { content: "Can't stop coming back to this", persona: null, category: "general" },
  { content: "This post ate and left no crumbs", persona: null, category: "general" },
  { content: "Finally some good fucking content", persona: null, category: "general" },
  { content: "The way this made my day", persona: null, category: "general" },
  { content: "Underrated af", persona: null, category: "general" },
  { content: "This is elite", persona: null, category: "general" },
  { content: "I'm here for it", persona: null, category: "general" },
  { content: "Yes yes yes", persona: null, category: "general" },
  { content: "This one cooked", persona: null, category: "general" },
  { content: "Actually obsessed with this", persona: null, category: "general" },
  { content: "The standard has been raised", persona: null, category: "general" },
  { content: "We eating good today", persona: null, category: "general" },
  { content: "This slaps so hard", persona: null, category: "general" },
  { content: "No skips, only bangers", persona: null, category: "general" },
  { content: "This is sending me", persona: null, category: "general" },
  { content: "Peak content right here", persona: null, category: "general" },

  // ==================== DOM ====================
  { content: "Good. Now do better.", persona: "Dom", category: "general" },
  { content: "Exactly the kind of energy I expect here.", persona: "Dom", category: "general" },
  { content: "You've earned that.", persona: "Dom", category: "general" },
  { content: "I approve.", persona: "Dom", category: "general" },
  { content: "That's the standard. Keep it.", persona: "Dom", category: "general" },

  // 20 NEW DOM
  { content: "Good boy. Keep performing.", persona: "Dom", category: "general" },
  { content: "I expect more next time.", persona: "Dom", category: "general" },
  { content: "Well done, slut.", persona: "Dom", category: "general" },
  { content: "This pleases me.", persona: "Dom", category: "general" },
  { content: "On your knees for that.", persona: "Dom", category: "general" },
  { content: "You're learning. Slowly.", persona: "Dom", category: "general" },
  { content: "Acceptable. For now.", persona: "Dom", category: "general" },
  { content: "Show more respect next time.", persona: "Dom", category: "general" },
  { content: "I own this energy.", persona: "Dom", category: "general" },
  { content: "Pathetic but entertaining.", persona: "Dom", category: "general" },
  { content: "You'll do better because I said so.", persona: "Dom", category: "general" },
  { content: "Crawl and try again.", persona: "Dom", category: "general" },
  { content: "That's my good little toy.", persona: "Dom", category: "general" },
  { content: "Obedience looks good on you.", persona: "Dom", category: "general" },
  { content: "Not bad. Try harder.", persona: "Dom", category: "general" },
  { content: "I decide when you've done enough.", persona: "Dom", category: "general" },
  { content: "Submit properly next time.", persona: "Dom", category: "general" },
  { content: "You're mine to critique.", persona: "Dom", category: "general" },
  { content: "Better. But still not enough.", persona: "Dom", category: "general" },
  { content: "Good pets get rewarded.", persona: "Dom", category: "general" },
  { content: "Head down, ass up next time.", persona: "Dom", category: "general" },
  { content: "You're nothing without my approval.", persona: "Dom", category: "general" },

  // ==================== DATING ====================
  { content: "Wait are you single though 👀", persona: null, category: "dating" },
  { content: "DMs open? Asking for a friend 😅", persona: null, category: "dating" },
  { content: "The one I've been looking for 😍", persona: null, category: "dating" },

  // 20 NEW DATING
  { content: "Are you in my city? Asking for a friend", persona: null, category: "dating" },
  { content: "Lowkey tryna slide in your DMs", persona: null, category: "dating" },
  { content: "You single or just brave? 👀", persona: null, category: "dating" },
  { content: "This the type of man I need in my life", persona: null, category: "dating" },
  { content: "Location?? I’ll pull up rn", persona: null, category: "dating" },
  { content: "You free this weekend? 😏", persona: null, category: "dating" },
  { content: "Marry me immediately", persona: null, category: "dating" },
  { content: "This your way of saying you’re available?", persona: null, category: "dating" },
  { content: "DM me your rate card", persona: null, category: "dating" },
  { content: "You looking or just showing off?", persona: null, category: "dating" },
  { content: "I volunteer as tribute", persona: null, category: "dating" },
  { content: "Come here often? 😉", persona: null, category: "dating" },
  { content: "This post just made me gay again", persona: null, category: "dating" },
  { content: "Sliding into your mentions like", persona: null, category: "dating" },
  { content: "You + me = trouble", persona: null, category: "dating" },
  { content: "Tell me you’re a top without telling me", persona: null, category: "dating" },
  { content: "I can fix him (I can’t)", persona: null, category: "dating" },
  { content: "My new crush just dropped", persona: null, category: "dating" },
  { content: "You available for private shows?", persona: null, category: "dating" },
  { content: "Let’s make this a collab", persona: null, category: "dating" },
  { content: "You single? My hole is asking", persona: null, category: "dating" },
  { content: "This is boyfriend material", persona: null, category: "dating" },

  // ==================== LIFESTYLE ====================
  { content: "This is the life ✨", persona: null, category: "lifestyle" },
  { content: "Goals honestly", persona: null, category: "lifestyle" },
  { content: "This is the energy I'm chasing", persona: null, category: "lifestyle" },

  // 20 NEW LIFESTYLE
  { content: "Living my best exposed life", persona: null, category: "lifestyle" },
  { content: "This but unapologetically", persona: null, category: "lifestyle" },
  { content: "Main character energy", persona: null, category: "lifestyle" },
  { content: "The confidence I aspire to", persona: null, category: "lifestyle" },
  { content: "Serving looks and zero fucks", persona: null, category: "lifestyle" },
  { content: "This is peak freedom", persona: null, category: "lifestyle" },
  { content: "Unbothered era activated", persona: null, category: "lifestyle" },
  { content: "Living rent free in my head", persona: null, category: "lifestyle" },
  { content: "This is self-care", persona: null, category: "lifestyle" },
  { content: "The glow up we all needed", persona: null, category: "lifestyle" },
  { content: "Exposed and thriving", persona: null, category: "lifestyle" },
  { content: "This is how you own it", persona: null, category: "lifestyle" },
  { content: "Zero regrets era", persona: null, category: "lifestyle" },
  { content: "Living deliciously", persona: null, category: "lifestyle" },
  { content: "This is liberation", persona: null, category: "lifestyle" },
  { content: "Serving cunt and confidence", persona: null, category: "lifestyle" },
  { content: "The fantasy we all want", persona: null, category: "lifestyle" },
  { content: "This is the vibe", persona: null, category: "lifestyle" },
  { content: "Unapologetic king energy", persona: null, category: "lifestyle" },
  { content: "This is how you win", persona: null, category: "lifestyle" },

  // ==================== HUMOR ====================
  { content: "I'm deceased 💀💀💀", persona: null, category: "humor" },
  { content: "Okay who let them cook like this 😭", persona: null, category: "humor" },
  { content: "The way I just spit out my drink", persona: null, category: "humor" },
  { content: "LMAOOO no because why", persona: null, category: "humor" },

  // 20 NEW HUMOR
  { content: "I'm crying in the club rn 😭", persona: null, category: "humor" },
  { content: "This is sending me to the shadow realm", persona: null, category: "humor" },
  { content: "Not me on the floor", persona: null, category: "humor" },
  { content: "The audacity is sending me", persona: null, category: "humor" },
  { content: "I wasn't ready for this today", persona: null, category: "humor" },
  { content: "Wheezing at 3am", persona: null, category: "humor" },
  { content: "This is comedy gold", persona: null, category: "humor" },
  { content: "I'm weak", persona: null, category: "humor" },
  { content: "No way this is real 💀", persona: null, category: "humor" },
  { content: "My sides are gone", persona: null, category: "humor" },

  // ==================== NEW CATEGORIES (COMMENTED OUT FOR NOW) ====================

  // === MEAN / ROAST ===
  // { content: "Trash.", persona: "Mean", category: "roast" },
  // { content: "Pathetic.", persona: "Mean", category: "roast" },
  // ... (add your 150+ mean ones here later)

  // === COCK TEMPLATES ===
  // { content: "Small cock energy on full display.", persona: null, category: "cock" },
  // ... (your cock templates)

  // === ASS TEMPLATES ===
  // { content: "Fat ass, perfect for roasting. 🍑", persona: null, category: "ass" },
  // ... 

  // === DOM (Advanced) ===
  // ... your full dom list

  // === THIRSTY / SUBMISSIVE ===
  // ... your thirsty templates

  // === HUMILIATOR ===
  // ... your humiliator templates with spelling errors

  // === REGION SPECIFIC ===
  // UK, US, DE, FR, etc.
];

async function seedComments() {
  console.log('Seeding comment templates...')

  // Optional: Clear old templates first
  // await supabase.from('bot_comment_templates').delete().neq('id', 0)

  const { error } = await supabase
    .from('bot_comment_templates')
    .insert(templates)

  if (error) {
    console.error('Error seeding templates:', error.message)
  } else {
    console.log(`Successfully seeded ${templates.length} comment templates.`)
  }
}

seedComments()