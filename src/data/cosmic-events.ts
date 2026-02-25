export interface TransitEvent {
  id: string;
  name: string;
  type:
    | "mercury_retrograde"
    | "full_moon"
    | "new_moon"
    | "eclipse"
    | "equinox"
    | "solstice"
    | "venus_retrograde"
    | "jupiter_transit";
  startDate: string; // ISO date
  endDate: string;
  description: string;
  affectedSigns: string[]; // western zodiac signs most affected
  severity: "low" | "medium" | "high";
  advice: string;
  icon: string; // emoji
}

export const transitEvents: TransitEvent[] = [
  // --- Mercury Retrogrades ---
  {
    id: "mercury-retro-mar-2026",
    name: "Mercury Retrograde in Pisces",
    type: "mercury_retrograde",
    startDate: "2026-03-02",
    endDate: "2026-03-25",
    description:
      "Mercury stations retrograde in Pisces, blurring communication boundaries and amplifying intuition. Expect emotional misunderstandings and resurfacing connections from the past.",
    affectedSigns: ["Pisces", "Virgo", "Gemini", "Sagittarius"],
    severity: "high",
    advice:
      "Avoid signing contracts or starting new relationships. Double-check messages before sending. Lean into journaling and reflective practices.",
    icon: "\u263F",
  },
  {
    id: "mercury-retro-jul-2026",
    name: "Mercury Retrograde in Leo",
    type: "mercury_retrograde",
    startDate: "2026-07-18",
    endDate: "2026-08-11",
    description:
      "Mercury reverses through bold Leo, challenging self-expression and creative projects. Miscommunications may flare in romantic contexts.",
    affectedSigns: ["Leo", "Aquarius", "Scorpio", "Taurus"],
    severity: "high",
    advice:
      "Revisit creative work rather than launching new projects. Be mindful of ego-driven arguments. Reconnect with old passions.",
    icon: "\u263F",
  },
  {
    id: "mercury-retro-nov-2026",
    name: "Mercury Retrograde in Sagittarius",
    type: "mercury_retrograde",
    startDate: "2026-11-09",
    endDate: "2026-11-29",
    description:
      "Mercury retrogrades through philosophical Sagittarius, disrupting travel plans and causing ideological clashes. Long-distance connections may feel strained.",
    affectedSigns: ["Sagittarius", "Gemini", "Pisces", "Virgo"],
    severity: "high",
    advice:
      "Confirm all travel arrangements twice. Avoid heated debates about beliefs. Use the period to broaden your perspective through reading.",
    icon: "\u263F",
  },

  // --- Full Moons ---
  {
    id: "full-moon-mar-2026",
    name: "Full Moon in Virgo",
    type: "full_moon",
    startDate: "2026-03-11",
    endDate: "2026-03-12",
    description:
      "A Full Moon in analytical Virgo illuminates details you may have overlooked. Health routines and daily rituals come into focus.",
    affectedSigns: ["Virgo", "Pisces", "Gemini", "Sagittarius"],
    severity: "medium",
    advice:
      "Organize and declutter your space. Release perfectionist tendencies. Pay attention to body signals.",
    icon: "\uD83C\uDF15",
  },
  {
    id: "full-moon-apr-2026",
    name: "Full Moon in Libra",
    type: "full_moon",
    startDate: "2026-04-09",
    endDate: "2026-04-10",
    description:
      "The Libra Full Moon highlights partnerships and the balance of give-and-take. Relationship dynamics come to a head.",
    affectedSigns: ["Libra", "Aries", "Cancer", "Capricorn"],
    severity: "medium",
    advice:
      "Have honest conversations with partners. Seek harmony but do not compromise your core values. Beautify your surroundings.",
    icon: "\uD83C\uDF15",
  },
  {
    id: "full-moon-jun-2026",
    name: "Full Moon in Sagittarius",
    type: "full_moon",
    startDate: "2026-06-07",
    endDate: "2026-06-08",
    description:
      "A fiery Sagittarius Full Moon ignites wanderlust and the desire for deeper meaning. Adventure beckons and restlessness peaks.",
    affectedSigns: ["Sagittarius", "Gemini", "Pisces", "Virgo"],
    severity: "medium",
    advice:
      "Plan a spontaneous trip or explore a new philosophical perspective. Channel restless energy into physical activity.",
    icon: "\uD83C\uDF15",
  },
  {
    id: "full-moon-sep-2026",
    name: "Full Moon in Pisces",
    type: "full_moon",
    startDate: "2026-09-03",
    endDate: "2026-09-04",
    description:
      "The Pisces Full Moon dissolves boundaries and heightens psychic sensitivity. Dreams carry meaningful messages during this transit.",
    affectedSigns: ["Pisces", "Virgo", "Cancer", "Scorpio"],
    severity: "medium",
    advice:
      "Keep a dream journal. Practice grounding exercises. Allow yourself to feel without judgment.",
    icon: "\uD83C\uDF15",
  },

  // --- New Moons ---
  {
    id: "new-moon-apr-2026",
    name: "New Moon in Aries",
    type: "new_moon",
    startDate: "2026-04-24",
    endDate: "2026-04-25",
    description:
      "The Aries New Moon ignites fresh starts and bold initiatives. This is the cosmic green light to begin new chapters.",
    affectedSigns: ["Aries", "Leo", "Sagittarius", "Libra"],
    severity: "low",
    advice:
      "Set powerful intentions for the next six months. Start a new fitness routine or personal project. Be courageous.",
    icon: "\uD83C\uDF11",
  },
  {
    id: "new-moon-jul-2026",
    name: "New Moon in Cancer",
    type: "new_moon",
    startDate: "2026-07-04",
    endDate: "2026-07-05",
    description:
      "A nurturing Cancer New Moon emphasizes home, family, and emotional security. Plant seeds for domestic harmony.",
    affectedSigns: ["Cancer", "Capricorn", "Scorpio", "Pisces"],
    severity: "low",
    advice:
      "Redecorate your living space. Reach out to family members. Create a cozy sanctuary for yourself.",
    icon: "\uD83C\uDF11",
  },
  {
    id: "new-moon-oct-2026",
    name: "New Moon in Libra",
    type: "new_moon",
    startDate: "2026-10-22",
    endDate: "2026-10-23",
    description:
      "The Libra New Moon invites new partnerships and commitments. Beauty, diplomacy, and social connections are favored.",
    affectedSigns: ["Libra", "Aries", "Aquarius", "Gemini"],
    severity: "low",
    advice:
      "Open yourself to new partnerships. Attend social events. Invest in art, music, or aesthetic pursuits.",
    icon: "\uD83C\uDF11",
  },

  // --- Eclipses ---
  {
    id: "solar-eclipse-mar-2026",
    name: "Total Solar Eclipse in Aries",
    type: "eclipse",
    startDate: "2026-03-29",
    endDate: "2026-03-30",
    description:
      "A powerful Total Solar Eclipse in Aries catalyzes radical personal transformation. Identity shifts and new beginnings arrive with intensity.",
    affectedSigns: ["Aries", "Libra", "Cancer", "Capricorn"],
    severity: "high",
    advice:
      "Expect the unexpected. Avoid making permanent decisions during eclipse season. Allow transformations to unfold naturally.",
    icon: "\uD83C\uDF11",
  },
  {
    id: "lunar-eclipse-sep-2026",
    name: "Partial Lunar Eclipse in Pisces",
    type: "eclipse",
    startDate: "2026-09-17",
    endDate: "2026-09-18",
    description:
      "A Partial Lunar Eclipse in Pisces brings emotional revelations and spiritual breakthroughs. Hidden truths rise to the surface.",
    affectedSigns: ["Pisces", "Virgo", "Sagittarius", "Gemini"],
    severity: "high",
    advice:
      "Honor your emotions without acting impulsively. Meditate or spend time near water. Release what no longer serves your growth.",
    icon: "\uD83C\uDF15",
  },

  // --- Equinoxes ---
  {
    id: "vernal-equinox-2026",
    name: "Vernal Equinox — Sun enters Aries",
    type: "equinox",
    startDate: "2026-03-20",
    endDate: "2026-03-21",
    description:
      "The astrological new year begins as the Sun crosses into Aries. Day and night reach perfect balance before light takes the lead.",
    affectedSigns: ["Aries", "Libra", "Cancer", "Capricorn"],
    severity: "low",
    advice:
      "Set intentions for the astrological year. Clean and refresh your home. Embrace new beginnings with optimism.",
    icon: "\uD83C\uDF31",
  },
  {
    id: "autumnal-equinox-2026",
    name: "Autumnal Equinox — Sun enters Libra",
    type: "equinox",
    startDate: "2026-09-22",
    endDate: "2026-09-23",
    description:
      "Balance returns as the Sun enters Libra. The harvest season invites reflection on what you have cultivated this year.",
    affectedSigns: ["Libra", "Aries", "Cancer", "Capricorn"],
    severity: "low",
    advice:
      "Take stock of your achievements. Restore work-life balance. Focus on partnerships and social harmony.",
    icon: "\uD83C\uDF42",
  },

  // --- Solstices ---
  {
    id: "summer-solstice-2026",
    name: "Summer Solstice — Sun enters Cancer",
    type: "solstice",
    startDate: "2026-06-21",
    endDate: "2026-06-22",
    description:
      "The longest day of the year ushers in Cancer season. Solar energy peaks, amplifying emotional awareness and family bonds.",
    affectedSigns: ["Cancer", "Capricorn", "Aries", "Libra"],
    severity: "low",
    advice:
      "Celebrate your achievements so far this year. Spend time outdoors. Nurture your closest relationships.",
    icon: "\u2600\uFE0F",
  },
  {
    id: "winter-solstice-2026",
    name: "Winter Solstice — Sun enters Capricorn",
    type: "solstice",
    startDate: "2026-12-21",
    endDate: "2026-12-22",
    description:
      "The shortest day marks the Sun's entry into Capricorn. A time for introspection, goal-setting, and honoring the darkness before the return of light.",
    affectedSigns: ["Capricorn", "Cancer", "Aries", "Libra"],
    severity: "low",
    advice:
      "Reflect on the past year. Set disciplined goals for the future. Rest and recharge before the new cycle.",
    icon: "\u2744\uFE0F",
  },

  // --- Venus Retrograde ---
  {
    id: "venus-retro-may-2026",
    name: "Venus Retrograde in Gemini",
    type: "venus_retrograde",
    startDate: "2026-05-12",
    endDate: "2026-06-23",
    description:
      "Venus stations retrograde in communicative Gemini, challenging romantic connections and creative expression. Ex-partners and unresolved feelings may resurface.",
    affectedSigns: ["Gemini", "Sagittarius", "Virgo", "Pisces"],
    severity: "high",
    advice:
      "Avoid major relationship decisions or cosmetic procedures. Reassess your values and desires. Journal about what you truly want in love.",
    icon: "\u2640",
  },

  // --- Jupiter Transit ---
  {
    id: "jupiter-cancer-2026",
    name: "Jupiter enters Cancer",
    type: "jupiter_transit",
    startDate: "2026-06-09",
    endDate: "2026-12-31",
    description:
      "Jupiter, the planet of abundance, enters nurturing Cancer for the first time in 12 years. Family blessings, real estate opportunities, and emotional growth expand dramatically.",
    affectedSigns: ["Cancer", "Scorpio", "Pisces", "Taurus", "Virgo"],
    severity: "medium",
    advice:
      "Invest in home and family. Expand your emotional intelligence. Water signs experience a once-in-a-decade growth period.",
    icon: "\u2643",
  },
];
