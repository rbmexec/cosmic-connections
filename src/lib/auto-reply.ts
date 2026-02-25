import { sampleProfiles } from "@/data/profiles";

const profileReplies: Record<string, string[]> = {
  // Hana - UX Designer, Pisces, Fire Ox, Life Path 3
  "1": [
    "I love how the universe brought us together! The energy feels right.",
    "I'd love to sketch something inspired by our conversation.",
    "You know what? I think we'd have the best conversations over matcha.",
    "I just rearranged my entire studio because the vibe was off. Can you relate?",
    "Tell me something that made you smile today. I need design inspiration.",
    "I think good design is like a good relationship — invisible when it works perfectly.",
  ],
  // Marcus - Travel Photographer, Sagittarius, Water Rooster, Life Path 5
  "2": [
    "So... road trip? I know a spot with the best sunset views.",
    "I'd capture this moment if I could. Some connections are just meant to be.",
    "Let's get lost somewhere we've never been. Best stories start that way.",
    "I've been to 47 countries and somehow the most interesting thing is right here.",
    "The stars aligned for us — literally. What's your favorite constellation?",
    "I have a feeling you'd be the perfect travel buddy. Spontaneous energy is everything.",
  ],
  // Valentina - Dance Instructor, Cancer, Wood Pig, Life Path 11
  "3": [
    "I can already tell you've got rhythm in your soul.",
    "Want to dance? Even through text, I can feel the chemistry.",
    "The tango taught me something — you can't fake real connection.",
    "I'll cook you the best empanadas you've ever had. That's a promise.",
    "Comfortable silence with the right person is its own kind of dance.",
    "I believe the cosmos knew exactly what they were doing matching us.",
  ],
  // Ravi - Tech Founder, Capricorn, Metal Horse, Life Path 8
  "4": [
    "I appreciate people who challenge me. Got any hot takes?",
    "Let's grab coffee and talk about changing the world. Or at least our corner of it.",
    "The best partnerships start with aligned values. What matters most to you?",
    "I was already thinking about how to make your morning easier. That's just how I am.",
    "Third startup, but this connection feels like my best launch yet.",
    "You've got that independent energy I admire. Tell me about your passion project.",
  ],
  // Leila - Architect, Virgo, Fire Rat, Life Path 7
  "5": [
    "I can already tell you appreciate good structure — in buildings and in relationships.",
    "Every building is a love letter. I wonder what ours would look like.",
    "I just had the most interesting shower thought about sacred geometry. Want to hear it?",
    "Don't judge me, but I just critiqued our chat's layout. The flow is actually great.",
    "I think the universe has its own architecture. And we're part of the design.",
    "Let me sketch you something. What's your favorite kind of building?",
  ],
  // Luca - Executive Chef, Aries, Water Monkey, Life Path 1
  "6": [
    "I'd love to cook for you sometime. Fair warning — I expect your full attention.",
    "My nonna would approve of this match. That's the highest compliment I can give.",
    "The kitchen is where I feel most alive. Where's your happy place?",
    "I believe dining together is an act of trust. Are you ready for that?",
    "Every plate tells a story. I want to create one for you.",
    "You seem like someone who appreciates the difference between eating and dining.",
  ],
  // Mei Lin - Fashion Designer, Taurus, Earth Tiger, Life Path 6
  "7": [
    "I can tell you put thought into your choices. I notice these things.",
    "What you wear is the first sentence of your story. What's yours?",
    "Hidden speakeasy, deep conversation, city lights at night? I know just the place.",
    "I design every choice with intention. Including matching with you.",
    "Style isn't about money — it's about caring. And you clearly care.",
    "There's something about your energy that I'd love to translate into a design.",
  ],
  // Alejandro - Music Producer, Scorpio, Wood Dog, Life Path 9
  "8": [
    "I can already hear the melody of our conversation. It's got a good beat.",
    "I go deep or I don't go at all. Ready for that kind of intensity?",
    "I'd make you a playlist. If I make music with you in mind, that's everything.",
    "The ancestors meet the future in my studio. Want to come listen?",
    "Music is the only language that never needs translation. Neither is this connection.",
    "Some rhythms you feel before you hear them. This is one of those.",
  ],
  // Nadia - Art Curator, Aquarius, Wood Pig, Life Path 4
  "9": [
    "I could spend three hours in a gallery and still want to talk about what we saw over dinner.",
    "The best art makes you feel something. So does this conversation.",
    "I see beauty in unexpected places. Like this cosmic connection.",
    "Tell me about the last thing that made you stop and really look.",
    "There's poetry in everything if you know where to look. Even in matching.",
    "Byzantine mosaics or contemporary installations? Your answer tells me everything.",
  ],
  // Mateo - Marine Biologist, Libra, Metal Goat, Life Path 2
  "10": [
    "Fun fact: octopuses have three hearts. I think I just grew a fourth.",
    "I'd love to share a sunrise dive with you someday.",
    "Some connections are better shared in silence. But I also love a good conversation.",
    "The Mediterranean is full of secrets. Want to help me find some?",
    "Dolphins approach when they sense something genuine. I'm getting that same feeling.",
    "Ocean conservation is personal for me. What's your cause?",
  ],
  // Yuki - Photographer, Leo, Earth Rabbit, Life Path 3
  "11": [
    "I'd capture this moment if I could. Candid moments are where the truth lives.",
    "Don't be surprised if I photograph you when you're not looking. It's a compliment.",
    "I'm braver behind the camera, but you make me want to step in front.",
    "Be genuinely curious about the world — that's all I ask. You seem like you are.",
    "Some moments deserve to be framed. I think this is one of them.",
    "My dream is to take a photo that makes someone feel understood. Not just seen.",
  ],
  // Omar - Surgeon, Cancer, Earth Snake, Life Path 4
  "12": [
    "I show up for the people who matter. That's my definition of strength.",
    "Steady hands in the OR, gentle ones at home. That's who I am.",
    "I noticed you might need someone reliable. I'm that person.",
    "My love language is protection — the 'I brought your jacket' kind.",
    "I process heavy days through silence first, then talking. Thanks for understanding.",
    "Showing up consistently — that's the most romantic thing I can think of.",
  ],
  // Priya - Data Scientist, Virgo, Fire Ox, Life Path 7
  "13": [
    "I calculated the probability of this match and it's statistically significant.",
    "Don't hate me if I fact-check something mid-conversation. It's love, I promise.",
    "Want to go on a street food crawl? I know all the best spots in the old city.",
    "I'm building a model to test if chemistry can be quantified. You're my best data point.",
    "Bollywood plot holes and etymology — those are my love languages.",
    "What's the most random Wikipedia rabbit hole you've fallen into at 2am?",
  ],
  // Sebastian - Sustainability Consultant, Gemini, Wood Dog, Life Path 5
  "14": [
    "The planet doesn't need guilt — it needs better systems. And better conversations.",
    "Sauna, cold plunge, Northern Lights. That's my idea of a perfect evening. Yours?",
    "We can go from deep existential talk to laughing about something dumb? Perfect.",
    "I've cold-plunged in 14 countries. Want to make it 15 together?",
    "Sustainability is practical, not preachy. Like good relationships.",
    "The most alive I feel is right after a cold plunge. This conversation is a close second.",
  ],
  // Camila - Veterinarian, Taurus, Earth Tiger, Life Path 6
  "15": [
    "Fernando (my rescue dog) just approved of you. That's a big deal.",
    "Animals choose their humans. I think the cosmos chose us.",
    "Want to go on a hike? Dogs included, obviously.",
    "I believe every pet I've had found me first. Maybe you found me too.",
    "The way to my heart is through loving animals. You're already there.",
    "Empanadas from my favorite street vendor, sunset from the mountains. Interested?",
  ],
  // Jin - Film Director, Scorpio, Water Rooster, Life Path 9
  "16": [
    "Every story is about connection, really. Including ours.",
    "I'm on set at golden hour, the scene becomes something none of us planned. Like this.",
    "Korean cinema is the best in the world right now. Happy to debate over soju.",
    "I see the world in frames and stories. You'd make a great leading role.",
    "Some scripts write themselves. I think this conversation is one of them.",
    "I notice the way strangers interact on the subway. What do you notice?",
  ],
  // Sophia - Marine Archaeologist, Sagittarius, Fire Rat, Life Path 22
  "17": [
    "The Mediterranean is full of secrets waiting. Want to help me uncover them?",
    "I love adventure AND sitting in a library for five hours. Best of both worlds.",
    "Ancient sailors navigated by stars. I think the stars led me to you.",
    "I spend so much time in the past — but this conversation has me very present.",
    "Mythological maps and trade routes — sounds boring until I tell the stories. Trust me.",
    "My dream is finding a shipwreck no one's touched in a thousand years. Ambitious, right?",
  ],
  // Khalil - Civil Engineer, Capricorn, Metal Goat, Life Path 8
  "18": [
    "The best structures are the ones you don't notice. Like a solid connection.",
    "Let's design our dream home on a napkin at dinner. I'll handle the blueprints.",
    "Arabic coffee at sunrise — that's my happy place. What's yours?",
    "I value depth over speed. I'm not in a rush to build, I'm in a rush to build well.",
    "Trust is like a foundation — it needs to be perfectly level.",
    "Bridges, homes, trust. The best things are built to last.",
  ],
  // Isabella - Physical Therapist, Libra, Fire Ox, Life Path 2
  "19": [
    "I fix people for a living. Let me take care of you too.",
    "Beach run at dawn, acai bowl, then samba at sunset. That's my perfect day. Yours?",
    "I'll find the knot in your shoulder you didn't know existed. That's my superpower.",
    "Being comfortable with being taken care of — that's a green flag for me.",
    "I help people move without pain. The moment someone walks freely again — that's my high.",
    "Rio sunsets are incredible, but this conversation is giving them competition.",
  ],
  // Arjun - Venture Capitalist, Aries, Wood Pig, Life Path 1
  "20": [
    "The next unicorn isn't in Silicon Valley. Maybe it's in our conversation.",
    "Tell me about your random 2am Wikipedia rabbit hole. That's my green flag.",
    "Most hustle culture is just anxiety wearing a blazer. Real ambition knows when to rest.",
    "Hawker center crawl in Singapore? I'll argue about which one is the best.",
    "Intellectual curiosity is the most attractive quality. You've got it.",
    "I fund startups that solve real problems. Our match seems like a good investment.",
  ],
};

export function getAutoReply(profileId: string): string {
  const replies = profileReplies[profileId];
  if (!replies || replies.length === 0) {
    // Fallback for unknown profiles
    const profile = sampleProfiles.find((p) => p.id === profileId);
    if (profile) {
      return `That's really interesting! I'd love to hear more about that. - ${profile.name}`;
    }
    return "That's really interesting! Tell me more.";
  }
  return replies[Math.floor(Math.random() * replies.length)];
}
