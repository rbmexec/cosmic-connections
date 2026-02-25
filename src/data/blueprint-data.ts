import type {
  LifePathBlueprint,
  ZodiacBlueprint,
  ChineseAnimalBlueprint,
  ChineseElementBlueprint,
} from "@/types/blueprint";

// ═══════════════════════════════════════════════════════════════
// LIFE PATH BLUEPRINTS (1-9, 11, 22, 33)
// ═══════════════════════════════════════════════════════════════

export const lifePathBlueprints: Record<number, LifePathBlueprint> = {
  1: {
    coreTheme: "Independence & Leadership",
    dual: {
      realized: {
        traits: ["Visionary leader", "Self-reliant pioneer", "Courageous initiator", "Decisive action-taker", "Original thinker"],
        energy: "You walk into a room and people sense a quiet authority — someone who doesn't need permission to lead.",
      },
      unrealized: {
        traits: ["Domineering controller", "Isolated loner", "Aggressive competitor", "Stubborn egotist", "Impatient dictator"],
        energy: "When disconnected, you push people away and mistake loneliness for strength.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Fiercely loyal partner", "Inspires independence in others", "Leads with devotion"],
        unrealized: ["Emotionally unavailable", "Refuses to compromise", "Makes partner feel invisible"],
        lesson: "Love is not weakness — true strength is vulnerability.",
      },
      business: {
        realized: ["Natural entrepreneur", "Bold decision maker", "Creates from nothing"],
        unrealized: ["Refuses to delegate", "Burns bridges", "Takes credit alone"],
        lanes: ["Founder/CEO", "Solo consultant", "Inventor", "Brand creator"],
        lesson: "The best leaders build others up, not just themselves.",
      },
      shadow: ["Fear of dependence", "Ego-driven decisions", "Inability to ask for help"],
      growthKeys: ["Practice receiving", "Collaborate without controlling", "Let others lead sometimes"],
      masculineHigh: ["Protective provider", "Decisive leader", "Pioneering spirit"],
      masculineShadow: ["Dominating bully", "Cold authority", "Win-at-all-costs mentality"],
      feminineHigh: ["Independent queen energy", "Self-sourced confidence", "Inspired creator"],
      feminineShadow: ["Walls up emotionally", "Rejects nurturing", "Hyper-independence as armor"],
      highTimeline: ["Respected visionary", "Beloved leader", "Legacy builder", "Inspires generations"],
      lowTimeline: ["Isolated tyrant", "Burned-out loner", "Feared but not loved", "Dies with regrets of connection"],
    },
  },
  2: {
    coreTheme: "Partnership & Diplomacy",
    dual: {
      realized: {
        traits: ["Master mediator", "Emotionally intelligent", "Deep listener", "Harmonizing presence", "Intuitive counselor"],
        energy: "You feel what others can't say — your presence alone calms the room.",
      },
      unrealized: {
        traits: ["Codependent people-pleaser", "Passive-aggressive manipulator", "Doormat energy", "Indecisive avoider", "Overly sensitive reactor"],
        energy: "When unbalanced, you lose yourself in others and resent them for it.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Deeply devoted partner", "Creates emotional safety", "Understands unspoken needs"],
        unrealized: ["Loses identity in relationships", "Keeps score secretly", "Avoids confrontation until explosion"],
        lesson: "You can hold space for others without losing yourself.",
      },
      business: {
        realized: ["Brilliant negotiator", "Team builder", "Client relationship master"],
        unrealized: ["Avoids leadership", "Undercharges for value", "Takes on others' workload"],
        lanes: ["Mediator/Counselor", "HR leadership", "Partnership roles", "Diplomacy"],
        lesson: "Your sensitivity is a superpower in business — own it.",
      },
      shadow: ["Fear of abandonment", "Conflict avoidance", "Self-erasure for approval"],
      growthKeys: ["Set boundaries without guilt", "Voice your needs directly", "Choose yourself first sometimes"],
      masculineHigh: ["Gentle protector", "Emotionally available leader", "Wise counselor"],
      masculineShadow: ["Passive pushover", "Avoids responsibility", "People-pleasing mask"],
      feminineHigh: ["Intuitive healer", "Nurturing presence", "Emotional anchor"],
      feminineShadow: ["Martyr complex", "Codependent caretaker", "Loses self in service"],
      highTimeline: ["Beloved peacemaker", "Trusted advisor", "Deep lasting partnerships", "Emotional legacy of love"],
      lowTimeline: ["Resentful doormat", "Alone despite trying", "Bitter from giving too much", "Never truly seen"],
    },
  },
  3: {
    coreTheme: "Creative Expression & Joy",
    dual: {
      realized: {
        traits: ["Magnetic communicator", "Joyful creator", "Social catalyst", "Inspiring artist", "Effortless charm"],
        energy: "You light up any room — people are drawn to your energy like moths to a flame.",
      },
      unrealized: {
        traits: ["Scattered dilettante", "Superficial entertainer", "Gossip and drama creator", "Emotionally avoidant comedian", "Unfocused dreamer"],
        energy: "When ungrounded, you use humor to hide and charm to manipulate.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Romantic and playful partner", "Keeps love exciting", "Communicates feelings beautifully"],
        unrealized: ["Avoids depth through humor", "Flirtatious to the point of betrayal", "Bored easily"],
        lesson: "True intimacy requires showing the parts of you that aren't performing.",
      },
      business: {
        realized: ["Natural entertainer/influencer", "Creative visionary", "Inspiring presenter"],
        unrealized: ["Starts everything, finishes nothing", "All style, no substance", "Avoids the boring work"],
        lanes: ["Content creator", "Artist/performer", "Marketing/branding", "Public speaking"],
        lesson: "Discipline is the bridge between your talent and your success.",
      },
      shadow: ["Fear of being ordinary", "Emotional avoidance through performance", "Scattered energy"],
      growthKeys: ["Finish what you start", "Sit with uncomfortable emotions", "Create for yourself, not applause"],
      masculineHigh: ["Charismatic leader", "Inspiring communicator", "Creative visionary"],
      masculineShadow: ["Class clown avoiding responsibility", "Charming manipulator", "Surface-level connections"],
      feminineHigh: ["Radiant muse", "Emotional expressiveness", "Creative flow state"],
      feminineShadow: ["Drama queen energy", "Attention addiction", "Emotional volatility"],
      highTimeline: ["Celebrated artist", "Inspiring millions", "Joyful legacy", "Authentic creative force"],
      lowTimeline: ["Wasted talent", "Known but not respected", "Shallow connections", "Bitter about unfulfilled potential"],
    },
  },
  4: {
    coreTheme: "Structure & Foundation",
    dual: {
      realized: {
        traits: ["Master builder", "Reliable rock", "Disciplined achiever", "Methodical planner", "Loyal to the core"],
        energy: "You are the person everyone trusts when things fall apart — steady, strong, unshakable.",
      },
      unrealized: {
        traits: ["Rigid perfectionist", "Workaholic without joy", "Resistant to change", "Controlling micromanager", "Emotionally repressed"],
        energy: "When imbalanced, you build walls instead of foundations and mistake rigidity for strength.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Devoted and stable partner", "Builds lasting relationship foundations", "Shows love through actions"],
        unrealized: ["Emotionally unavailable provider", "Controls through stability", "Sees vulnerability as weakness"],
        lesson: "Love needs flexibility — you can't build a relationship like you build a business.",
      },
      business: {
        realized: ["Exceptional project manager", "Turns chaos into order", "Builds empires brick by brick"],
        unrealized: ["Micromanages everything", "Burns out from overwork", "Can't adapt to market changes"],
        lanes: ["Real estate", "Engineering", "Operations management", "Financial planning"],
        lesson: "Systems serve people, not the other way around.",
      },
      shadow: ["Fear of instability", "Control as coping mechanism", "Emotional suppression"],
      growthKeys: ["Allow spontaneity", "Express emotions openly", "Trust the process without controlling it"],
      masculineHigh: ["Steady provider", "Protective builder", "Disciplined patriarch"],
      masculineShadow: ["Cold workhorse", "Emotionally shut down", "Values productivity over connection"],
      feminineHigh: ["Grounded mother energy", "Creates safe containers", "Patient nurturer"],
      feminineShadow: ["Rigid rule-follower", "Joy-resistant", "Sacrifices pleasure for duty"],
      highTimeline: ["Empire builder", "Generational wealth creator", "Trusted pillar", "Legacy of stability"],
      lowTimeline: ["Overworked and underappreciated", "Rigid and alone", "All structure, no soul", "Missed life while building"],
    },
  },
  5: {
    coreTheme: "Freedom & Adventure",
    dual: {
      realized: {
        traits: ["Fearless explorer", "Magnetic storyteller", "Adaptable genius", "Sensory connoisseur", "Change catalyst"],
        energy: "You make everyone around you feel more alive — your energy is pure electricity.",
      },
      unrealized: {
        traits: ["Reckless escapist", "Commitment-phobic drifter", "Addictive personality", "Irresponsible thrill-seeker", "Restless and never satisfied"],
        energy: "When ungrounded, you confuse running away with freedom.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Exciting and passionate lover", "Keeps relationship adventurous", "Deeply present in the moment"],
        unrealized: ["Fears commitment like death", "Always looking for the next thrill", "Emotionally unreliable"],
        lesson: "Real freedom is choosing to stay — not because you have to, but because you want to.",
      },
      business: {
        realized: ["Trend spotter", "Multi-industry connector", "Sales genius"],
        unrealized: ["Can't stick with one thing", "Burns through opportunities", "All talk, no follow-through"],
        lanes: ["Travel industry", "Sales/marketing", "Media/journalism", "Entrepreneurial ventures"],
        lesson: "Focus is freedom — mastering one thing opens more doors than dabbling in everything.",
      },
      shadow: ["Fear of being trapped", "Addiction to stimulation", "Inability to commit"],
      growthKeys: ["Find freedom within structure", "Practice stillness", "Commit to one thing deeply"],
      masculineHigh: ["Adventurous protector", "Worldly wisdom", "Exciting provider"],
      masculineShadow: ["Peter Pan syndrome", "Unreliable wanderer", "Avoids responsibility"],
      feminineHigh: ["Free-spirited goddess", "Sensual aliveness", "Magnetic presence"],
      feminineShadow: ["Chaotic energy", "Uses freedom as excuse for selfishness", "Can't be pinned down"],
      highTimeline: ["World traveler with purpose", "Inspiring adventurer", "Freedom with roots", "Lives a story worth telling"],
      lowTimeline: ["Homeless drifter", "Addicted and lost", "No roots, no legacy", "Exciting but empty"],
    },
  },
  6: {
    coreTheme: "Love & Responsibility",
    dual: {
      realized: {
        traits: ["Devoted caretaker", "Harmonizing force", "Beautiful creator", "Community builder", "Unconditional lover"],
        energy: "You make everywhere you go feel like home — people heal just by being near you.",
      },
      unrealized: {
        traits: ["Smothering controller", "Self-righteous judge", "Martyr who keeps score", "Perfectionist parent", "Guilt manipulator"],
        energy: "When imbalanced, your love comes with strings attached and invisible contracts.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Creates a beautiful home life", "Deeply nurturing partner", "Loves unconditionally"],
        unrealized: ["Smothers partner with care", "Uses guilt as a weapon", "Needs to be needed"],
        lesson: "The highest love sets people free — including yourself.",
      },
      business: {
        realized: ["Creates beautiful environments", "Team nurturer", "Customer care excellence"],
        unrealized: ["Takes on everyone's problems", "Can't say no", "Burns out from over-giving"],
        lanes: ["Interior design", "Healthcare", "Education", "Hospitality"],
        lesson: "You can serve without sacrificing yourself.",
      },
      shadow: ["Fear of being unneeded", "Control through caregiving", "Self-neglect"],
      growthKeys: ["Give without expecting return", "Let others solve their own problems", "Nurture yourself first"],
      masculineHigh: ["Devoted father energy", "Protective without controlling", "Community leader"],
      masculineShadow: ["Overbearing patriarch", "Guilt-tripping provider", "Judgmental moralist"],
      feminineHigh: ["Divine mother energy", "Healing presence", "Creates beauty everywhere"],
      feminineShadow: ["Martyr complex", "Smothering love", "Self-abandonment"],
      highTimeline: ["Beloved matriarch/patriarch", "Community pillar", "Legacy of love and beauty", "Family dynasty creator"],
      lowTimeline: ["Resentful caretaker", "Burned out and bitter", "Gave everything, received nothing", "Controlling through love"],
    },
  },
  7: {
    coreTheme: "Wisdom & Inner Truth",
    dual: {
      realized: {
        traits: ["Profound truth-seeker", "Spiritual sage", "Analytical genius", "Mystical researcher", "Inner peace radiator"],
        energy: "You carry a depth that most people sense but can't name — an old soul wisdom.",
      },
      unrealized: {
        traits: ["Paranoid skeptic", "Cold intellectual", "Socially withdrawn hermit", "Suspicious of everyone", "Spiritually bypassing"],
        energy: "When closed off, you use knowledge as a wall and solitude as a prison.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Deep soul-level connection", "Respects partner's inner world", "Intimate beyond physical"],
        unrealized: ["Emotionally distant analyzer", "Tests partner constantly", "Walls up, trust down"],
        lesson: "Not everything needs to be understood — some things just need to be felt.",
      },
      business: {
        realized: ["Research genius", "Strategic advisor", "Quality over quantity"],
        unrealized: ["Analysis paralysis", "Too theoretical to execute", "Distrusts collaboration"],
        lanes: ["Research/academia", "Technology", "Psychology", "Spiritual teaching"],
        lesson: "Knowledge without application is just mental hoarding.",
      },
      shadow: ["Fear of being fooled", "Emotional detachment", "Overthinking as avoidance"],
      growthKeys: ["Trust your heart, not just your mind", "Open up to one person deeply", "Embrace mystery"],
      masculineHigh: ["Wise teacher", "Calm strategist", "Spiritual warrior"],
      masculineShadow: ["Cold analyst", "Emotionally unavailable sage", "Ivory tower hermit"],
      feminineHigh: ["Mystical intuitive", "Deep inner knowing", "Sacred feminine wisdom"],
      feminineShadow: ["Paranoid witch energy", "Uses intuition to manipulate", "Isolated priestess"],
      highTimeline: ["Respected sage", "Spiritual teacher", "Discoverer of truth", "Peaceful, fulfilled life"],
      lowTimeline: ["Lonely intellectual", "Paranoid recluse", "Smart but miserable", "Died with secrets no one heard"],
    },
  },
  8: {
    coreTheme: "Power & Abundance",
    dual: {
      realized: {
        traits: ["Magnetic authority", "Abundant manifestor", "Strategic empire builder", "Powerful executor", "Karmic balancer"],
        energy: "You walk with the energy of someone who was born to command empires and redistribute wealth.",
      },
      unrealized: {
        traits: ["Power-hungry tyrant", "Materialistic void-filler", "Ruthless climber", "Workaholic machine", "Karmic debtor"],
        energy: "When shadow-driven, you confuse net worth with self-worth.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Generous provider", "Powerful protector", "Creates luxury and safety"],
        unrealized: ["Treats relationships like transactions", "Measures love in dollars", "Neglects family for ambition"],
        lesson: "The richest life is measured by the love you give, not the empire you build.",
      },
      business: {
        realized: ["Born CEO energy", "Wealth magnet", "Turns vision into empires"],
        unrealized: ["Ruthless at any cost", "Burns people for profit", "Addicted to status"],
        lanes: ["Finance/investment", "Corporate leadership", "Real estate magnate", "Power brokering"],
        lesson: "True power serves — false power takes.",
      },
      shadow: ["Fear of powerlessness", "Money as identity", "Karmic debt cycles"],
      growthKeys: ["Give generously without agenda", "Value people over profit", "Use power to uplift"],
      masculineHigh: ["Benevolent king", "Generous patriarch", "Strategic protector"],
      masculineShadow: ["Ruthless tyrant", "Cold calculator", "Power at all costs"],
      feminineHigh: ["Empress energy", "Abundant creator", "Luxury with purpose"],
      feminineShadow: ["Gold-digger energy", "Manipulates through resources", "Status-obsessed"],
      highTimeline: ["Philanthropic mogul", "Generational wealth builder", "Respected leader", "Karmic balance achieved"],
      lowTimeline: ["Rich but empty", "Feared and alone", "Karmic debt collector", "Lost everything chasing more"],
    },
  },
  9: {
    coreTheme: "Humanitarianism & Completion",
    dual: {
      realized: {
        traits: ["Compassionate world-server", "Wise old soul", "Creative humanitarian", "Universal lover", "Completion master"],
        energy: "You carry the wisdom of all numbers — you've been here before, and you came back to serve.",
      },
      unrealized: {
        traits: ["Self-righteous savior", "Resentful martyr", "Emotionally scattered", "Can't let go of the past", "Holier-than-thou judge"],
        energy: "When unhealed, you try to save the world while ignoring your own wounds.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Loves without conditions", "Sees the best in everyone", "Healing presence in relationships"],
        unrealized: ["Attracts broken people to fix", "Gives too much, receives too little", "Can't set boundaries in love"],
        lesson: "You can't pour from an empty cup — heal yourself first.",
      },
      business: {
        realized: ["Nonprofit visionary", "Healing arts master", "Global impact creator"],
        unrealized: ["Can't charge what they're worth", "Burns out saving others", "Neglects finances for mission"],
        lanes: ["Nonprofit leadership", "Healing/therapy", "Social enterprise", "Global advocacy"],
        lesson: "Abundance and service are not opposites — fund your mission.",
      },
      shadow: ["Savior complex", "Inability to receive", "Past-life attachment"],
      growthKeys: ["Let go gracefully", "Accept help without guilt", "Complete your own cycles before starting new ones"],
      masculineHigh: ["Wise sage", "Compassionate warrior", "Selfless leader"],
      masculineShadow: ["Burnt-out martyr", "Resentful savior", "Self-righteous preacher"],
      feminineHigh: ["Divine healer", "Universal mother", "Completion goddess"],
      feminineShadow: ["Victim-savior cycle", "Gives until empty", "Spiritual bypassing"],
      highTimeline: ["World changer", "Beloved humanitarian", "Peaceful completion", "Legacy of service and love"],
      lowTimeline: ["Burnt-out savior", "Resentful and unappreciated", "Never finished their own healing", "Died mid-mission"],
    },
  },
  11: {
    coreTheme: "Spiritual Illumination",
    dual: {
      realized: {
        traits: ["Master intuitive", "Spiritual channel", "Visionary leader", "Illuminating teacher", "Bridge between worlds"],
        energy: "You are a lightning rod for divine inspiration — your presence alone raises consciousness.",
      },
      unrealized: {
        traits: ["Anxious overthinker", "Paralyzed by sensitivity", "Delusional visionary", "Nervous energy without direction", "Spiritual superiority complex"],
        energy: "When ungrounded, your gift of sensitivity becomes a curse of overwhelm.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Deeply psychic connection", "Spiritually bonded partnership", "Inspires partner's evolution"],
        unrealized: ["Overwhelmed by partner's emotions", "Expects psychic connection from everyone", "Too idealistic about love"],
        lesson: "Ground your visions in human reality — heaven needs earth to exist.",
      },
      business: {
        realized: ["Visionary entrepreneur", "Inspirational speaker", "Spiritual business pioneer"],
        unrealized: ["Too visionary to execute", "Overwhelmed by the material world", "Can't handle business details"],
        lanes: ["Spiritual teaching", "Inspirational leadership", "Innovation", "Visionary art"],
        lesson: "Master the mundane to deliver the extraordinary.",
      },
      shadow: ["Anxiety from heightened sensitivity", "Spiritual ego", "Overwhelm paralysis"],
      growthKeys: ["Ground your visions in action", "Protect your energy daily", "Embrace the human experience"],
      masculineHigh: ["Prophetic leader", "Inspired visionary", "Spiritual warrior"],
      masculineShadow: ["Anxious wreck", "Paralyzed by possibility", "Lost in visions"],
      feminineHigh: ["Divine channel", "Psychic healer", "Illuminating presence"],
      feminineShadow: ["Overwhelmed empath", "Spiritual bypasser", "Lost between worlds"],
      highTimeline: ["Enlightened teacher", "Spiritual pioneer", "Changed collective consciousness", "Transcendent legacy"],
      lowTimeline: ["Anxious and unfulfilled", "Wasted psychic gifts", "Couldn't handle the sensitivity", "Brilliant but broken"],
    },
  },
  22: {
    coreTheme: "Master Building & Legacy",
    dual: {
      realized: {
        traits: ["Master architect of reality", "Turns impossible dreams into structures", "Legacy builder", "Practical visionary", "Global impact creator"],
        energy: "You are here to build things that outlast you — structures, systems, and institutions that change the world.",
      },
      unrealized: {
        traits: ["Paralyzed by the size of the vision", "Workaholic destroyer", "Controls everything obsessively", "Crushed by pressure", "Builds empires on shaky foundations"],
        energy: "When shadow-driven, the weight of your potential becomes a prison of pressure.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Builds an unshakable partnership", "Creates generational family legacy", "Devoted empire co-creator"],
        unrealized: ["Neglects love for the mission", "Too busy building to connect", "Expects partner to serve the vision"],
        lesson: "The greatest thing you'll ever build is a relationship that stands the test of time.",
      },
      business: {
        realized: ["Master architect of systems", "Turns vision into global reality", "Creates lasting institutions"],
        unrealized: ["Crushed by perfectionism", "Burns out chasing impossible standards", "Builds without considering human cost"],
        lanes: ["Architecture/engineering", "Global enterprise", "Infrastructure", "Government/policy"],
        lesson: "Build with people, not over them.",
      },
      shadow: ["Perfectionism paralysis", "Pressure from potential", "Workaholism"],
      growthKeys: ["Start imperfect", "Rest is productive", "Build for joy, not just legacy"],
      masculineHigh: ["Master builder king", "Visionary architect", "Legacy patriarch"],
      masculineShadow: ["Workaholic tyrant", "Perfectionist controller", "Crushed by expectations"],
      feminineHigh: ["Grand designer", "Institutional mother", "Builds beauty that lasts"],
      feminineShadow: ["Perfectionist destroyer", "Never satisfied", "Sacrifices joy for output"],
      highTimeline: ["Built something that changed the world", "Generational legacy", "Master builder fulfilled", "Institutions standing centuries later"],
      lowTimeline: ["Crushed by own potential", "Built empires that crumbled", "Worked to death", "Vision died with them"],
    },
  },
  33: {
    coreTheme: "Master Teaching & Healing",
    dual: {
      realized: {
        traits: ["Master healer-teacher", "Unconditional love embodied", "Uplifts entire communities", "Selfless service master", "Divine compassion channel"],
        energy: "You are here to teach through love — your very existence heals those around you.",
      },
      unrealized: {
        traits: ["Crushed by responsibility", "Martyr without boundaries", "Savior complex on steroids", "Emotionally drained shell", "Self-sacrifice to the point of destruction"],
        energy: "When depleted, you give until there's nothing left and resent the world for taking.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Love that heals generations", "Selfless devotion", "Creates sanctuary in partnership"],
        unrealized: ["Loves so hard it hurts", "Attracts those who drain", "Can't stop giving even when empty"],
        lesson: "You teach best by example — show others what self-love looks like.",
      },
      business: {
        realized: ["Transformative educator", "Community healer", "Builds healing institutions"],
        unrealized: ["Gives away everything for free", "Can't sustain the mission financially", "Burns out from compassion fatigue"],
        lanes: ["Education leadership", "Healing institutions", "Spiritual community building", "Nonprofit visionary"],
        lesson: "Sustainable service requires self-preservation.",
      },
      shadow: ["Savior complex to the extreme", "Complete self-neglect", "Compassion fatigue"],
      growthKeys: ["Receive as much as you give", "Set loving boundaries", "Heal yourself to heal others"],
      masculineHigh: ["Master teacher", "Compassionate patriarch", "Selfless servant-leader"],
      masculineShadow: ["Crushed by responsibility", "Martyred father", "Self-righteous teacher"],
      feminineHigh: ["Divine mother healer", "Unconditional love embodied", "Community matriarch"],
      feminineShadow: ["Depleted caretaker", "Boundaryless giver", "Resentful saint"],
      highTimeline: ["Healed thousands", "Built lasting healing legacy", "Loved unconditionally", "Remembered as a saint"],
      lowTimeline: ["Gave until death", "Never received", "Resentful and exhausted", "Healing others, never healed self"],
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// WESTERN ZODIAC BLUEPRINTS (12 signs)
// ═══════════════════════════════════════════════════════════════

export const zodiacBlueprints: Record<string, ZodiacBlueprint> = {
  Aries: {
    coreTheme: "Initiation & Courage",
    dual: {
      realized: {
        traits: ["Fearless trailblazer", "Passionate warrior", "Honest and direct", "Energetic motivator", "Born leader"],
        energy: "You charge forward where others hesitate — your courage is contagious.",
      },
      unrealized: {
        traits: ["Reckless hot-head", "Selfish competitor", "Impatient bully", "Anger-driven reactor", "Burns bridges fast"],
        energy: "When reactive, you destroy what you could build with that same fire.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Passionate and exciting lover", "Fiercely protective of partner", "Direct about feelings"],
        unrealized: ["Rushes into love too fast", "Competitive with partner", "Explosive arguments"],
        lesson: "Slow down — the best love is a marathon, not a sprint.",
      },
      business: {
        realized: ["First to market", "Fearless pitch maker", "Startup energy"],
        unrealized: ["Burns out quickly", "Fights with partners", "No patience for growth phase"],
        lanes: ["Startup founder", "Sports/fitness", "Military/first responder", "Competitive sales"],
        lesson: "Starting is your superpower — learn to also sustain.",
      },
      shadow: ["Unchecked anger", "Impatience with process", "Fear of being second"],
      growthKeys: ["Count to ten before reacting", "Celebrate others' wins", "Finish before starting new things"],
      masculineHigh: ["Noble warrior", "Protective champion", "Courageous pioneer"],
      masculineShadow: ["Aggressive bully", "Violent temper", "Dominates through force"],
      feminineHigh: ["Fierce goddess", "Passionate creator", "Bold feminine leader"],
      feminineShadow: ["Combative energy", "Pushes love away", "Angry at vulnerability"],
      highTimeline: ["Legendary pioneer", "Respected warrior", "Opened doors for many", "Courageous legacy"],
      lowTimeline: ["Burned every bridge", "Alone from aggression", "Unfulfilled rage", "Started everything, finished nothing"],
    },
  },
  Taurus: {
    coreTheme: "Stability & Sensuality",
    dual: {
      realized: {
        traits: ["Grounded earth anchor", "Sensual pleasure master", "Patient wealth builder", "Loyal to the end", "Beauty creator"],
        energy: "You embody the art of living well — pleasure, patience, and permanence.",
      },
      unrealized: {
        traits: ["Stubborn unmovable force", "Materialistic hoarder", "Possessive lover", "Lazy comfort seeker", "Resistant to all change"],
        energy: "When stuck, you confuse comfort with happiness and possession with love.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Deeply sensual partner", "Loyal and devoted", "Creates beautiful shared life"],
        unrealized: ["Possessive and jealous", "Refuses to grow or change", "Smothers with comfort"],
        lesson: "Love is not ownership — hold gently what you cherish most.",
      },
      business: {
        realized: ["Patient investor", "Luxury brand builder", "Steady growth master"],
        unrealized: ["Misses opportunities from caution", "Hoards resources", "Too slow to adapt"],
        lanes: ["Finance/banking", "Luxury goods", "Agriculture/food", "Real estate"],
        lesson: "Patience is power, but paralysis is not patience.",
      },
      shadow: ["Possessiveness", "Resistance to change", "Comfort addiction"],
      growthKeys: ["Embrace change as growth", "Share generously", "Find security within, not without"],
      masculineHigh: ["Steady provider", "Sensual protector", "Patient builder"],
      masculineShadow: ["Possessive controller", "Lazy king", "Stubborn tyrant"],
      feminineHigh: ["Venus goddess", "Abundant creator", "Sensual earth mother"],
      feminineShadow: ["Material girl", "Possessive lover", "Comfort-addicted queen"],
      highTimeline: ["Wealthy in every sense", "Beloved partner", "Beautiful legacy", "Generational abundance"],
      lowTimeline: ["Stuck in comfort zone", "Missed life from stubbornness", "Rich but rigid", "Alone from possessiveness"],
    },
  },
  Gemini: {
    coreTheme: "Communication & Duality",
    dual: {
      realized: {
        traits: ["Brilliant communicator", "Quick-witted connector", "Versatile genius", "Social butterfly", "Information alchemist"],
        energy: "You think faster than most people can talk — your mind is your greatest asset.",
      },
      unrealized: {
        traits: ["Two-faced manipulator", "Shallow gossip", "Commitment-phobic butterfly", "Nervous overthinker", "Scattered in all directions"],
        energy: "When fragmented, you become all surface and no depth — talking without saying anything.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Intellectually stimulating partner", "Keeps love fresh and exciting", "Great communicator in relationships"],
        unrealized: ["Gets bored quickly", "Flirtatious beyond boundaries", "Two different people to partner"],
        lesson: "Depth is not boring — let someone truly know you.",
      },
      business: {
        realized: ["Master networker", "Content genius", "Multi-platform communicator"],
        unrealized: ["Too many projects at once", "Can't be pinned down", "Promises more than delivers"],
        lanes: ["Media/journalism", "Marketing/PR", "Teaching", "Technology/social media"],
        lesson: "Your versatility is a gift — focus it like a laser, not a flashlight.",
      },
      shadow: ["Fear of depth", "Identity fragmentation", "Chronic restlessness"],
      growthKeys: ["Go deep on one thing", "Practice silence", "Integrate your dual nature"],
      masculineHigh: ["Clever strategist", "Witty leader", "Intellectual warrior"],
      masculineShadow: ["Manipulative trickster", "Commitment avoider", "All talk, no action"],
      feminineHigh: ["Quick-witted enchantress", "Social connector", "Mercury's daughter"],
      feminineShadow: ["Gossip queen", "Emotionally scattered", "Two-faced friend"],
      highTimeline: ["Legendary communicator", "Connected millions", "Bridge between worlds", "Intellectual legacy"],
      lowTimeline: ["Known but not trusted", "Jack of all trades, master of none", "Talked a lot, said nothing", "Never committed to anything"],
    },
  },
  Cancer: {
    coreTheme: "Nurturing & Emotional Depth",
    dual: {
      realized: {
        traits: ["Deep emotional intelligence", "Nurturing protector", "Intuitive healer", "Family-first devotion", "Safe space creator"],
        energy: "You make people feel at home in your presence — your love is a sanctuary.",
      },
      unrealized: {
        traits: ["Moody manipulator", "Clingy controller", "Passive-aggressive punisher", "Victim mentality", "Smothering parent energy"],
        energy: "When wounded, you use emotions as weapons and guilt as currency.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Creates deep emotional bond", "Nurturing and protective", "Remembers every detail about partner"],
        unrealized: ["Clingy and possessive", "Uses emotions to control", "Withdraws into shell"],
        lesson: "You can be strong and soft at the same time — vulnerability is not weakness.",
      },
      business: {
        realized: ["Creates family-like teams", "Intuitive about customer needs", "Builds loyal client relationships"],
        unrealized: ["Takes business personally", "Can't handle criticism", "Too emotional to make hard decisions"],
        lanes: ["Hospitality", "Real estate", "Food/restaurant", "Childcare/family services"],
        lesson: "Business requires boundaries — not everyone is family.",
      },
      shadow: ["Emotional manipulation", "Fear of abandonment", "Living in the past"],
      growthKeys: ["Release the past", "Set emotional boundaries", "Trust that love won't leave"],
      masculineHigh: ["Protective father", "Emotionally available leader", "Home builder"],
      masculineShadow: ["Moody tyrant", "Guilt-tripping patriarch", "Emotionally controlling"],
      feminineHigh: ["Divine mother", "Emotional healer", "Intuitive nurturer"],
      feminineShadow: ["Smothering mother", "Manipulative caretaker", "Martyr"],
      highTimeline: ["Beloved family leader", "Created lasting home legacy", "Emotionally healed generations", "Deep love legacy"],
      lowTimeline: ["Bitter from past wounds", "Drove people away", "Lonely in a full house", "Emotionally draining to all"],
    },
  },
  Leo: {
    coreTheme: "Creative Power & Heart Leadership",
    dual: {
      realized: {
        traits: ["Radiant heart leader", "Generous creator", "Confident performer", "Warm protector", "Loyal sovereign"],
        energy: "You are the Sun personified — everything orbits your warmth and light.",
      },
      unrealized: {
        traits: ["Narcissistic attention seeker", "Drama king/queen", "Arrogant ruler", "Wounded ego reactor", "Needs constant validation"],
        energy: "When insecure, you demand the spotlight because you can't shine from within.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Generous and romantic lover", "Makes partner feel like royalty", "Fiercely loyal"],
        unrealized: ["Needs to be center of attention", "Competitive in relationships", "Dramatic about everything"],
        lesson: "True royalty lifts others up — crown your partner too.",
      },
      business: {
        realized: ["Natural CEO presence", "Inspires teams", "Creative brand builder"],
        unrealized: ["Can't share spotlight", "Takes all credit", "Wounded by any criticism"],
        lanes: ["Entertainment", "Leadership/management", "Luxury brands", "Creative direction"],
        lesson: "The best leaders make others feel like stars.",
      },
      shadow: ["Need for validation", "Fear of irrelevance", "Wounded pride"],
      growthKeys: ["Validate yourself from within", "Celebrate others genuinely", "Lead through service, not spectacle"],
      masculineHigh: ["Noble king", "Generous protector", "Heart-centered leader"],
      masculineShadow: ["Tyrant ruler", "Egomaniac", "Demands worship"],
      feminineHigh: ["Radiant queen", "Generous heart", "Creative fire goddess"],
      feminineShadow: ["Drama queen", "Attention-addicted diva", "Jealous of others' shine"],
      highTimeline: ["Beloved leader", "Left a radiant legacy", "Generous beyond measure", "Remembered with love"],
      lowTimeline: ["Forgotten performer", "Ego destroyed relationships", "All show, no substance", "Needed applause to feel alive"],
    },
  },
  Virgo: {
    coreTheme: "Service & Perfection",
    dual: {
      realized: {
        traits: ["Precision craftsperson", "Healing servant", "Analytical genius", "Devoted helper", "Health-conscious warrior"],
        energy: "You see what everyone misses — your attention to detail is a form of love.",
      },
      unrealized: {
        traits: ["Obsessive critic", "Anxiety-driven perfectionist", "Judgmental nit-picker", "Health hypochondriac", "Worrier who can't rest"],
        energy: "When anxious, you pick apart everything including yourself.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Shows love through acts of service", "Reliable and thoughtful partner", "Remembers the little things"],
        unrealized: ["Criticizes partner constantly", "Never satisfied with what is", "Withholds love waiting for perfection"],
        lesson: "Imperfection is where love lives — let it be messy.",
      },
      business: {
        realized: ["Quality control master", "Systems optimizer", "Healthcare excellence"],
        unrealized: ["Micromanages obsessively", "Can't launch until perfect", "Critical of all team members"],
        lanes: ["Healthcare", "Quality assurance", "Data analysis", "Nutrition/wellness"],
        lesson: "Done is better than perfect — ship it, then refine.",
      },
      shadow: ["Perfectionism paralysis", "Self-criticism spiral", "Judgment of others"],
      growthKeys: ["Embrace good enough", "Practice self-compassion", "See the forest, not just the trees"],
      masculineHigh: ["Precise craftsman", "Devoted servant-leader", "Health warrior"],
      masculineShadow: ["Critical judge", "Anxious controller", "Never satisfied"],
      feminineHigh: ["Healing priestess", "Earth goddess of service", "Detail-oriented creator"],
      feminineShadow: ["Anxious perfectionist", "Self-critical to the bone", "Judgmental helper"],
      highTimeline: ["Master healer", "Perfected their craft", "Served with excellence", "Left systems that last"],
      lowTimeline: ["Paralyzed by perfectionism", "Criticized everyone away", "Anxious and unfulfilled", "Never good enough for themselves"],
    },
  },
  Libra: {
    coreTheme: "Balance & Beauty",
    dual: {
      realized: {
        traits: ["Harmony creator", "Aesthetic visionary", "Fair judge", "Diplomatic peacemaker", "Partnership master"],
        energy: "You bring balance wherever you go — your presence creates beauty and fairness.",
      },
      unrealized: {
        traits: ["Indecisive people-pleaser", "Avoids conflict at all costs", "Codependent partner", "Superficially charming", "Fence-sitter"],
        energy: "When unbalanced, you lose yourself trying to keep everyone happy.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Creates harmonious partnership", "Romantic and attentive", "Fair and balanced in love"],
        unrealized: ["Loses identity in relationship", "Can't make decisions alone", "Avoids necessary conflicts"],
        lesson: "Real harmony sometimes requires honest confrontation.",
      },
      business: {
        realized: ["Exceptional negotiator", "Aesthetic brand builder", "Partnership specialist"],
        unrealized: ["Can't make hard decisions", "Avoids necessary confrontations", "Too focused on appearance"],
        lanes: ["Law/mediation", "Design/fashion", "Diplomacy", "Art curation"],
        lesson: "Making a decision, even imperfect, is better than making none.",
      },
      shadow: ["Indecisiveness", "Conflict avoidance", "Identity loss in relationships"],
      growthKeys: ["Make decisions faster", "Embrace healthy conflict", "Find your own center first"],
      masculineHigh: ["Just ruler", "Diplomatic leader", "Fair arbitrator"],
      masculineShadow: ["Weak-willed people-pleaser", "Can't take a stand", "Charming but empty"],
      feminineHigh: ["Venus-ruled beauty", "Harmonious creator", "Partnership goddess"],
      feminineShadow: ["Codependent lover", "Can't be alone", "Loses self in others"],
      highTimeline: ["Brought justice and beauty", "Legendary peacemaker", "Created harmony in chaos", "Beloved by all"],
      lowTimeline: ["Never chose a side", "Lost in others' lives", "Beautiful but empty", "Avoided all hard truths"],
    },
  },
  Scorpio: {
    coreTheme: "Transformation & Power",
    dual: {
      realized: {
        traits: ["Transformational force", "Deeply loyal protector", "Intuitive truth-seer", "Resurrection master", "Magnetic presence"],
        energy: "You see through all masks — your depth is both your power and your weapon.",
      },
      unrealized: {
        traits: ["Manipulative controller", "Vengeful destroyer", "Obsessive stalker", "Power-hungry schemer", "Secretive liar"],
        energy: "When wounded, you use your insight to destroy rather than transform.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Deeply passionate bond", "Transformative love", "Loyal beyond measure"],
        unrealized: ["Possessive and jealous", "Tests partner constantly", "Destroys what threatens them"],
        lesson: "Trust is a choice — you can't control your way to love.",
      },
      business: {
        realized: ["Crisis management genius", "Due diligence master", "Transformational leader"],
        unrealized: ["Hoards information as power", "Manipulates office politics", "Trusts no one"],
        lanes: ["Psychology/therapy", "Investigation/forensics", "Finance/investment", "Crisis management"],
        lesson: "True power is transparent — secrets are a prison.",
      },
      shadow: ["Control through secrets", "Vengeance cycles", "Trust issues"],
      growthKeys: ["Choose trust over control", "Forgive without forgetting the lesson", "Transform pain into wisdom"],
      masculineHigh: ["Powerful protector", "Transformational leader", "Deep masculine truth"],
      masculineShadow: ["Manipulative destroyer", "Vengeful tyrant", "Controls through fear"],
      feminineHigh: ["Dark goddess power", "Intuitive sorceress", "Death-and-rebirth feminine"],
      feminineShadow: ["Obsessive lover", "Manipulative enchantress", "Destroys from the shadows"],
      highTimeline: ["Transformed thousands of lives", "Master of reinvention", "Deep legacy of truth", "Powerful and beloved"],
      lowTimeline: ["Destroyed by own venom", "Alone from betrayals", "Powerful but feared", "Couldn't let go of anything"],
    },
  },
  Sagittarius: {
    coreTheme: "Expansion & Truth-Seeking",
    dual: {
      realized: {
        traits: ["Adventurous philosopher", "Optimistic visionary", "Truth-speaking teacher", "Global explorer", "Freedom fighter"],
        energy: "You make the world feel smaller and bigger at the same time — infinite possibility is your default.",
      },
      unrealized: {
        traits: ["Reckless gambler", "Preachy know-it-all", "Commitment-phobic runner", "Tactlessly blunt", "Irresponsible optimist"],
        energy: "When ungrounded, you run from depth and call it adventure.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Adventurous partner", "Growth-oriented relationship", "Honest and open communication"],
        unrealized: ["Can't settle down", "Brutally honest without filter", "Always looking at the horizon"],
        lesson: "The greatest adventure is building a life with someone — stop running.",
      },
      business: {
        realized: ["Global business builder", "Inspiring educator", "Publishing/media visionary"],
        unrealized: ["Over-promises, under-delivers", "Gambles recklessly", "Can't handle details"],
        lanes: ["Travel/tourism", "Education/publishing", "Philosophy/coaching", "International business"],
        lesson: "Vision without execution is just a dream — ground your fire.",
      },
      shadow: ["Fear of limitation", "Tactless truth-telling", "Irresponsible optimism"],
      growthKeys: ["Ground your visions", "Consider others' feelings", "Commit to something long-term"],
      masculineHigh: ["Wise explorer", "Philosophical king", "Adventurous protector"],
      masculineShadow: ["Irresponsible wanderer", "Preachy professor", "Commitment-phobic"],
      feminineHigh: ["Wild free goddess", "Truth-speaking priestess", "Adventurous muse"],
      feminineShadow: ["Reckless free spirit", "Burns bridges for freedom", "Can't be tamed or held"],
      highTimeline: ["Explored the world", "Taught timeless wisdom", "Freedom with purpose", "Inspiring legacy of truth"],
      lowTimeline: ["Ran from everything real", "Never built anything lasting", "Preachy but unwise", "Freedom that was actually loneliness"],
    },
  },
  Capricorn: {
    coreTheme: "Mastery & Authority",
    dual: {
      realized: {
        traits: ["Disciplined master", "Patient achiever", "Strategic climber", "Responsible authority", "Time-tested builder"],
        energy: "You age like fine wine — every year you become more powerful, more respected, more yourself.",
      },
      unrealized: {
        traits: ["Cold-hearted climber", "Status-obsessed workaholic", "Emotionally repressed ruler", "Pessimistic realist", "Uses people as stepping stones"],
        energy: "When hardened, you achieve everything but enjoy nothing.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Steady and reliable partner", "Builds lasting partnership", "Provides security and stability"],
        unrealized: ["Puts career before love", "Emotionally distant", "Measures relationships by utility"],
        lesson: "Success means nothing if you have no one to share it with.",
      },
      business: {
        realized: ["Strategic long-game player", "Corporate leader", "Builds lasting institutions"],
        unrealized: ["Ruthless climber", "Cold boss", "All work, no humanity"],
        lanes: ["Corporate leadership", "Government", "Finance", "Architecture"],
        lesson: "The top is lonely if you climbed over people to get there.",
      },
      shadow: ["Emotional suppression", "Status addiction", "Fear of vulnerability"],
      growthKeys: ["Show emotion as strength", "Value relationships over achievements", "Learn to play and rest"],
      masculineHigh: ["Distinguished leader", "Patient patriarch", "Self-made authority"],
      masculineShadow: ["Cold patriarch", "Status machine", "Emotionally frozen boss"],
      feminineHigh: ["Boss queen", "Elegant authority", "Time-tested goddess"],
      feminineShadow: ["Ice queen", "Career over everything", "Unapproachable authority"],
      highTimeline: ["Respected elder", "Built lasting empire", "Earned every achievement", "Legacy of discipline and wisdom"],
      lowTimeline: ["Successful but empty", "Reached the top alone", "Respected but not loved", "All achievement, no joy"],
    },
  },
  Aquarius: {
    coreTheme: "Innovation & Humanitarianism",
    dual: {
      realized: {
        traits: ["Visionary innovator", "Humanitarian leader", "Original thinker", "Community builder", "Future-seer"],
        energy: "You see tomorrow before it arrives — your ideas are ahead of their time.",
      },
      unrealized: {
        traits: ["Emotionally detached rebel", "Contrarian for the sake of it", "Aloof intellectual", "Distant and cold", "Rejects intimacy for ideology"],
        energy: "When disconnected, you love humanity but can't connect with actual humans.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Intellectually stimulating partner", "Gives partner freedom", "Loves uniquely and authentically"],
        unrealized: ["Emotionally unavailable", "Values ideas over feelings", "Too independent for partnership"],
        lesson: "You can change the world and still hold someone's hand.",
      },
      business: {
        realized: ["Tech innovator", "Social enterprise builder", "Community organizer"],
        unrealized: ["Too ahead of the market", "Can't connect with customers emotionally", "Rebels against all structure"],
        lanes: ["Technology", "Social enterprise", "NGO leadership", "Innovation/R&D"],
        lesson: "Innovation needs structure — rebellion alone builds nothing.",
      },
      shadow: ["Emotional detachment", "Superiority complex", "Intimacy avoidance"],
      growthKeys: ["Connect emotionally, not just intellectually", "Let people in", "Ground ideas in reality"],
      masculineHigh: ["Revolutionary leader", "Visionary inventor", "Humanitarian king"],
      masculineShadow: ["Cold intellectual", "Detached rebel", "Loves ideas more than people"],
      feminineHigh: ["Electric visionary", "Community goddess", "Innovative creator"],
      feminineShadow: ["Emotionally unavailable", "Eccentric loner", "Too weird to connect"],
      highTimeline: ["Changed the world", "Built the future", "Connected communities", "Visionary legacy that outlasted them"],
      lowTimeline: ["Brilliant but alone", "Too ahead of their time", "Ideas died with them", "Loved humanity, lost the humans"],
    },
  },
  Pisces: {
    coreTheme: "Mysticism & Compassion",
    dual: {
      realized: {
        traits: ["Mystical dreamer", "Compassionate healer", "Artistic visionary", "Spiritual channel", "Empathic soul"],
        energy: "You feel what others can't — your connection to the unseen world is your greatest gift.",
      },
      unrealized: {
        traits: ["Escapist fantasizer", "Victim mentality", "Addiction-prone", "Delusional dreamer", "Boundary-less absorber"],
        energy: "When overwhelmed, you dissolve into fantasy because reality hurts too much.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Soul-deep love connection", "Intuitively knows partner's needs", "Romantic and devoted"],
        unrealized: ["Loves the idea of love", "Gets lost in partner", "Attracts narcissists"],
        lesson: "Love with your eyes open — fantasy is not the same as reality.",
      },
      business: {
        realized: ["Creative genius", "Healing arts master", "Music/film visionary"],
        unrealized: ["Can't handle business details", "Taken advantage of financially", "Loses focus constantly"],
        lanes: ["Music/film/art", "Healing/therapy", "Spiritual business", "Photography"],
        lesson: "Ground your dreams in structure — art needs business to survive.",
      },
      shadow: ["Escapism tendency", "Victim consciousness", "Boundary dissolution"],
      growthKeys: ["Stay grounded in reality", "Set firm boundaries", "Channel sensitivity into art"],
      masculineHigh: ["Sensitive poet warrior", "Compassionate healer", "Mystical sage"],
      masculineShadow: ["Escapist dreamer", "Passive victim", "Addictive personality"],
      feminineHigh: ["Mystical goddess", "Empathic healer", "Dream weaver"],
      feminineShadow: ["Lost in fantasy", "Boundaryless empath", "Addicted to escape"],
      highTimeline: ["Created transcendent art", "Healed through beauty", "Connected to the divine", "Left a mystical legacy"],
      lowTimeline: ["Lost in addiction", "Beautiful but broken", "Never manifested the dream", "Drowned in other people's pain"],
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// CHINESE ANIMAL BLUEPRINTS (12 animals)
// ═══════════════════════════════════════════════════════════════

export const chineseAnimalBlueprints: Record<string, ChineseAnimalBlueprint> = {
  Rat: {
    description: "The resourceful strategist who thrives through wit, charm, and adaptability.",
    dual: {
      realized: {
        traits: ["Clever strategist", "Resourceful survivor", "Charming connector", "Quick problem-solver", "Opportunity spotter"],
        energy: "You find a way when there is no way — your resourcefulness is legendary.",
      },
      unrealized: {
        traits: ["Manipulative schemer", "Hoarding miser", "Gossip spreader", "Anxious worrier", "Exploitative opportunist"],
        energy: "When fearful, you hoard and manipulate instead of trusting abundance.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Charming and attentive partner", "Creates clever romance", "Loyal once committed"],
        unrealized: ["Manipulates through charm", "Hoards affection", "Tests partner's loyalty obsessively"],
        lesson: "Trust love enough to stop testing it.",
      },
      business: {
        realized: ["Resourceful entrepreneur", "Finds hidden opportunities", "Clever negotiator"],
        unrealized: ["Cuts corners for profit", "Hoards information", "Manipulates deals"],
        lanes: ["Entrepreneurship", "Finance/trading", "Intelligence/research", "Event planning"],
        lesson: "Integrity is the only sustainable business strategy.",
      },
      shadow: ["Hoarding mentality", "Manipulative tendencies", "Anxiety about scarcity"],
      growthKeys: ["Practice generosity", "Trust in abundance", "Be transparent in dealings"],
      masculineHigh: ["Clever provider", "Strategic protector", "Charming leader"],
      masculineShadow: ["Scheming manipulator", "Hoarding patriarch", "Trust no one energy"],
      feminineHigh: ["Witty enchantress", "Resourceful mother", "Social connector"],
      feminineShadow: ["Gossip queen", "Manipulative charm", "Anxious controller"],
      highTimeline: ["Wealthy through cleverness", "Connected powerful network", "Thrived in every situation", "Legacy of resourcefulness"],
      lowTimeline: ["Rich but mistrusted", "Manipulated everyone away", "Hoarded to the grave", "Clever but alone"],
    },
  },
  Ox: {
    description: "The steadfast worker who achieves through determination, patience, and unwavering reliability.",
    dual: {
      realized: {
        traits: ["Tireless worker", "Dependable anchor", "Patient achiever", "Strong and steady", "Honest to the core"],
        energy: "You are the mountain — unmovable, reliable, and eternally strong.",
      },
      unrealized: {
        traits: ["Stubborn beyond reason", "Inflexible conservative", "Workaholic without joy", "Resentful silent sufferer", "Authoritarian boss"],
        energy: "When rigid, you become an immovable obstacle in your own path.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Steady and reliable partner", "Shows love through dedication", "Creates stable home"],
        unrealized: ["Emotionally unexpressive", "Stubborn in arguments", "Expects partner to just know"],
        lesson: "Strength includes softness — say what you feel.",
      },
      business: {
        realized: ["Tireless builder", "Reliable executor", "Long-term strategist"],
        unrealized: ["Resistant to innovation", "Burns out silently", "Demands too much from team"],
        lanes: ["Agriculture/farming", "Engineering", "Banking", "Government administration"],
        lesson: "Flexibility is not weakness — adapt to thrive.",
      },
      shadow: ["Stubbornness as identity", "Silent resentment", "Joy suppression"],
      growthKeys: ["Express feelings verbally", "Allow play into your life", "Bend before you break"],
      masculineHigh: ["Unshakable patriarch", "Reliable provider", "Patient builder"],
      masculineShadow: ["Silent tyrant", "Stubborn dictator", "Works himself to death"],
      feminineHigh: ["Steady earth mother", "Patient nurturer", "Reliable anchor"],
      feminineShadow: ["Martyred workhorse", "Emotionally suppressed", "Resentful caretaker"],
      highTimeline: ["Built lasting legacy", "Respected for integrity", "Achieved through patience", "Generational foundation layer"],
      lowTimeline: ["Worked to death", "Too stubborn to change", "Reliable but resentful", "Strong but joyless"],
    },
  },
  Tiger: {
    description: "The bold warrior who leads through courage, passion, and raw magnetic power.",
    dual: {
      realized: {
        traits: ["Fearless leader", "Magnetic warrior", "Passionate protector", "Bold risk-taker", "Natural authority"],
        energy: "You walk with the confidence of someone who has already won — your presence commands respect.",
      },
      unrealized: {
        traits: ["Reckless aggressor", "Ego-driven dictator", "Impulsive destroyer", "Hot-tempered bully", "Authority rebel"],
        energy: "When unchecked, your power becomes destruction and your courage becomes recklessness.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Passionate and exciting partner", "Fiercely protective", "Brave in expressing feelings"],
        unrealized: ["Dominating in relationships", "Jealous and territorial", "Burns hot and cold"],
        lesson: "Love requires vulnerability, not just strength.",
      },
      business: {
        realized: ["Bold decision maker", "Inspires teams to greatness", "Fearless innovator"],
        unrealized: ["Too aggressive for partnerships", "Reckless with resources", "Can't share power"],
        lanes: ["Military/security", "Competitive sports", "Startup leadership", "Adventure industry"],
        lesson: "The strongest leaders know when to step back.",
      },
      shadow: ["Unchecked aggression", "Ego-driven decisions", "Authority issues"],
      growthKeys: ["Channel aggression constructively", "Practice humility", "Listen before acting"],
      masculineHigh: ["Noble warrior", "Courageous leader", "Protective guardian"],
      masculineShadow: ["Aggressive bully", "Power-hungry tyrant", "Reckless destroyer"],
      feminineHigh: ["Fierce goddess", "Protective mother tiger", "Passionate creator"],
      feminineShadow: ["Aggressive diva", "Controls through intimidation", "Burns relationships down"],
      highTimeline: ["Legendary warrior-leader", "Protected many", "Bold legacy of courage", "Feared and respected"],
      lowTimeline: ["Destroyed by own aggression", "Burned every bridge", "Powerful but alone", "Courage without wisdom"],
    },
  },
  Rabbit: {
    description: "The gentle diplomat who succeeds through elegance, sensitivity, and quiet intelligence.",
    dual: {
      realized: {
        traits: ["Elegant diplomat", "Gentle peacemaker", "Refined aesthetic eye", "Quietly brilliant", "Graceful under pressure"],
        energy: "You navigate life with an elegance that others admire — soft power is your superpower.",
      },
      unrealized: {
        traits: ["Conflict-avoidant escapist", "Passive-aggressive manipulator", "Oversensitive victim", "Indecisive worrier", "Superficially pleasant"],
        energy: "When fearful, you hide behind pleasantness and avoid everything uncomfortable.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Tender and romantic partner", "Creates beautiful home environment", "Attentive to partner's needs"],
        unrealized: ["Avoids all conflict", "Passive-aggressive when unhappy", "Runs from emotional intensity"],
        lesson: "Peace at the cost of truth is not real peace.",
      },
      business: {
        realized: ["Tasteful brand builder", "Diplomatic negotiator", "Elegant presenter"],
        unrealized: ["Avoids tough business decisions", "Too worried about being liked", "Passive in negotiations"],
        lanes: ["Fashion/design", "Art curation", "Diplomacy", "Luxury hospitality"],
        lesson: "Grace and assertiveness can coexist — use both.",
      },
      shadow: ["Conflict avoidance", "Passive aggression", "Oversensitivity"],
      growthKeys: ["Face conflict directly", "Express displeasure openly", "Build resilience through challenge"],
      masculineHigh: ["Gentle gentleman", "Diplomatic leader", "Refined strategist"],
      masculineShadow: ["Passive pushover", "Avoids confrontation", "Weak under pressure"],
      feminineHigh: ["Elegant queen", "Graceful creator", "Refined beauty"],
      feminineShadow: ["People-pleasing princess", "Avoids reality", "Fragile and defensive"],
      highTimeline: ["Created lasting beauty", "Brought peace to conflict", "Elegant legacy", "Loved for their grace"],
      lowTimeline: ["Avoided life's hard truths", "Pretty but powerless", "Ran from everything real", "Pleasant but unfulfilled"],
    },
  },
  Dragon: {
    description: "The legendary force who commands through charisma, ambition, and larger-than-life energy.",
    dual: {
      realized: {
        traits: ["Charismatic powerhouse", "Visionary leader", "Magnetic presence", "Ambitious achiever", "Lucky and blessed"],
        energy: "You are the mythical force in human form — people either follow you or get out of your way.",
      },
      unrealized: {
        traits: ["Arrogant tyrant", "Narcissistic emperor", "Demanding dictator", "Can't accept criticism", "Lonely at the top"],
        energy: "When ego-driven, your power becomes isolation and your ambition becomes tyranny.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Grand romantic gestures", "Protective and generous", "Makes partner feel chosen"],
        unrealized: ["Demands worship from partner", "Competitive in relationships", "Needs to be the alpha always"],
        lesson: "Even dragons need to be held — let someone see your softness.",
      },
      business: {
        realized: ["Empire builder", "Inspires massive teams", "Attracts luck and resources"],
        unrealized: ["Micromanages from ego", "Demands loyalty like a king", "Burns through employees"],
        lanes: ["Corporate empire building", "Entertainment", "Politics", "Venture capital"],
        lesson: "Empires built on ego crumble — build on purpose instead.",
      },
      shadow: ["Narcissistic tendencies", "Inability to be vulnerable", "Loneliness of power"],
      growthKeys: ["Show vulnerability as strength", "Listen more than you command", "Share power generously"],
      masculineHigh: ["Emperor energy", "Benevolent ruler", "Visionary conqueror"],
      masculineShadow: ["Tyrannical emperor", "Narcissistic king", "Demands worship"],
      feminineHigh: ["Dragon empress", "Magnetic queen", "Powerful creator"],
      feminineShadow: ["Diva energy", "Demands center stage", "Uses power to control"],
      highTimeline: ["Built legendary empire", "Led with vision", "Changed the landscape", "Mythical legacy"],
      lowTimeline: ["Lonely emperor", "Feared but not loved", "All power, no connection", "Empire crumbled without heart"],
    },
  },
  Snake: {
    description: "The wise strategist who achieves through intuition, patience, and calculated moves.",
    dual: {
      realized: {
        traits: ["Wise intuitive", "Patient strategist", "Elegant and mysterious", "Deep thinker", "Transformational healer"],
        energy: "You move through life like water — quiet, powerful, and impossible to contain.",
      },
      unrealized: {
        traits: ["Cunning manipulator", "Jealous possessor", "Secretive schemer", "Cold-blooded calculator", "Vengeful when crossed"],
        energy: "When wounded, you strike from the shadows and call it self-defense.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Deeply intuitive partner", "Mysterious and captivating", "Loyal and transformative love"],
        unrealized: ["Possessive and jealous", "Keeps secrets from partner", "Manipulates through silence"],
        lesson: "Transparency is intimacy — let someone see all of you.",
      },
      business: {
        realized: ["Brilliant strategist", "Patient investor", "Intuitive market reader"],
        unrealized: ["Manipulates behind the scenes", "Hoards secrets as leverage", "Cold in negotiations"],
        lanes: ["Strategy consulting", "Research/investigation", "Medicine/psychology", "Finance/investing"],
        lesson: "The wisest strategy is integrity — it never needs defending.",
      },
      shadow: ["Jealousy and possessiveness", "Secret-keeping as control", "Cold calculation"],
      growthKeys: ["Be transparent with intentions", "Release jealousy through self-worth", "Share knowledge freely"],
      masculineHigh: ["Wise counselor", "Patient protector", "Strategic guardian"],
      masculineShadow: ["Cold manipulator", "Secretive controller", "Vengeful schemer"],
      feminineHigh: ["Mystical enchantress", "Wise healer", "Intuitive goddess"],
      feminineShadow: ["Jealous temptress", "Manipulative seductress", "Cold and calculating"],
      highTimeline: ["Wise and wealthy", "Transformed many lives", "Strategic legacy", "Respected for depth"],
      lowTimeline: ["Manipulated everyone away", "Rich but mistrusted", "Died with secrets", "Wise but alone"],
    },
  },
  Horse: {
    description: "The dynamic achiever who lives through action, passion, and unstoppable forward motion.",
    dual: {
      realized: {
        traits: ["Energetic achiever", "Passionate adventurer", "Independent spirit", "Magnetic personality", "Action-oriented leader"],
        energy: "You live with an intensity that makes others feel more alive — your energy is contagious.",
      },
      unrealized: {
        traits: ["Restless and impatient", "Self-centered performer", "Commitment-phobic runner", "Hot-tempered reactor", "Abandons when bored"],
        energy: "When ungrounded, you gallop away from everything that requires stillness.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Passionate and exciting lover", "Brings adventure to relationship", "Loyal when truly matched"],
        unrealized: ["Gets bored quickly", "Runs from emotional depth", "Prioritizes freedom over partner"],
        lesson: "The wildest freedom is choosing to stay — gallop together, not away.",
      },
      business: {
        realized: ["High-energy executor", "Charismatic salesperson", "Industry disruptor"],
        unrealized: ["Burns out from overwork", "Impatient with slow progress", "Switches jobs too often"],
        lanes: ["Sports/athletics", "Sales leadership", "Travel/adventure", "Performance/entertainment"],
        lesson: "Endurance wins the race, not just speed.",
      },
      shadow: ["Restlessness as identity", "Fear of being trapped", "Impatience with process"],
      growthKeys: ["Practice stillness daily", "Commit to depth over breadth", "Channel energy sustainably"],
      masculineHigh: ["Adventurous warrior", "Passionate protector", "Free-spirited leader"],
      masculineShadow: ["Restless wanderer", "Hot-tempered cowboy", "Can't be domesticated"],
      feminineHigh: ["Wild free spirit", "Passionate goddess", "Magnetic adventurer"],
      feminineShadow: ["Runs from love", "Self-centered performer", "Burns relationships fast"],
      highTimeline: ["Lived fully and freely", "Achieved through passion", "Adventurous legacy", "Inspired others to live boldly"],
      lowTimeline: ["Ran from everything real", "Exhausted and alone", "Fast but going nowhere", "Freedom that was actually isolation"],
    },
  },
  Goat: {
    description: "The gentle artist who creates through sensitivity, creativity, and deep emotional awareness.",
    dual: {
      realized: {
        traits: ["Gentle creative", "Compassionate healer", "Artistic visionary", "Peace-loving harmonizer", "Naturally aesthetic"],
        energy: "You see beauty where others see nothing — your sensitivity is your art.",
      },
      unrealized: {
        traits: ["Dependent and needy", "Whiny complainer", "Insecure and anxious", "Passive follower", "Emotionally manipulative"],
        energy: "When unmoored, you rely on others for everything and resent them for it.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Tender and romantic partner", "Creates beautiful emotional world", "Deeply empathetic lover"],
        unrealized: ["Clingy and dependent", "Uses emotions to guilt", "Can't function alone"],
        lesson: "You are whole on your own — love from fullness, not neediness.",
      },
      business: {
        realized: ["Creative artist/designer", "Therapeutic healer", "Aesthetic brand builder"],
        unrealized: ["Can't handle business pressure", "Needs constant reassurance", "Avoids financial responsibility"],
        lanes: ["Art/design", "Therapy/counseling", "Music/performance", "Interior design"],
        lesson: "Your creativity has monetary value — charge for your gift.",
      },
      shadow: ["Dependence on others", "Emotional manipulation", "Insecurity as identity"],
      growthKeys: ["Build self-reliance", "Create without needing approval", "Find inner strength"],
      masculineHigh: ["Sensitive artist", "Compassionate creator", "Gentle protector"],
      masculineShadow: ["Dependent follower", "Emotionally needy", "Can't stand on own"],
      feminineHigh: ["Creative goddess", "Empathetic healer", "Beautiful creator"],
      feminineShadow: ["Needy princess", "Uses tears as tools", "Helpless without support"],
      highTimeline: ["Created lasting art", "Healed through beauty", "Gentle legacy", "Remembered for compassion"],
      lowTimeline: ["Never became independent", "Talent wasted on insecurity", "Beautiful but dependent", "Lived through others"],
    },
  },
  Monkey: {
    description: "The brilliant inventor who succeeds through wit, innovation, and irresistible charm.",
    dual: {
      realized: {
        traits: ["Brilliant problem-solver", "Quick-witted innovator", "Charming socialite", "Versatile genius", "Playful strategist"],
        energy: "You outthink everyone in the room while making them laugh — genius wrapped in charm.",
      },
      unrealized: {
        traits: ["Tricky manipulator", "Superficial entertainer", "Deceptive con artist", "Scattered and unfocused", "Arrogant know-it-all"],
        energy: "When misusing your gifts, you con people instead of connecting with them.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Fun and exciting partner", "Keeps love playful", "Intelligent conversation companion"],
        unrealized: ["Plays mind games", "Gets bored with routine", "Uses charm to avoid depth"],
        lesson: "Real love isn't a game — put the tricks away and be real.",
      },
      business: {
        realized: ["Innovative problem-solver", "Tech genius", "Creative entrepreneur"],
        unrealized: ["Shortcuts everything", "Too clever for own good", "Tricks instead of builds"],
        lanes: ["Technology", "Invention/innovation", "Comedy/entertainment", "Strategy consulting"],
        lesson: "Cleverness is a tool — use it to build, not to trick.",
      },
      shadow: ["Manipulative cleverness", "Superficiality", "Inability to be serious"],
      growthKeys: ["Use wit for good", "Go deep on relationships", "Build something lasting"],
      masculineHigh: ["Brilliant inventor", "Charming leader", "Quick-witted hero"],
      masculineShadow: ["Con man energy", "Tricks everyone", "Too smart for sincerity"],
      feminineHigh: ["Witty enchantress", "Playful creator", "Innovative goddess"],
      feminineShadow: ["Manipulative charmer", "Plays everyone", "All surface sparkle"],
      highTimeline: ["Invented something revolutionary", "Charmed the world", "Brilliant legacy", "Made the world smarter"],
      lowTimeline: ["Outsmarted themselves", "Too clever to be trusted", "Brilliant but alone", "All tricks, no substance"],
    },
  },
  Rooster: {
    description: "The meticulous achiever who succeeds through precision, hard work, and unflinching honesty.",
    dual: {
      realized: {
        traits: ["Precise perfectionist", "Hardworking achiever", "Brutally honest", "Organized leader", "Observant analyst"],
        energy: "You see every detail others miss — your standards elevate everyone around you.",
      },
      unrealized: {
        traits: ["Critical nit-picker", "Boastful show-off", "Argumentative debater", "Inflexible rule-follower", "Judgmental observer"],
        energy: "When imbalanced, you use your sharp eye to tear down instead of build up.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Devoted and reliable partner", "Honest communicator", "Creates organized home"],
        unrealized: ["Criticizes partner's every flaw", "Argumentative about small things", "Needs to be right always"],
        lesson: "Love sees flaws and chooses to stay — not to fix.",
      },
      business: {
        realized: ["Quality control expert", "Efficient operations manager", "Detail-oriented leader"],
        unrealized: ["Micromanages obsessively", "Alienates team with criticism", "Boasts about achievements"],
        lanes: ["Quality assurance", "Military/law enforcement", "Accounting/auditing", "Journalism"],
        lesson: "Excellence inspires more than criticism ever will.",
      },
      shadow: ["Hypercritical nature", "Need to be right", "Boastfulness as insecurity"],
      growthKeys: ["Praise before critiquing", "Accept imperfection in others", "Be confident without boasting"],
      masculineHigh: ["Precise warrior", "Honest leader", "Disciplined achiever"],
      masculineShadow: ["Harsh critic", "Boastful ego", "Rigid rule-enforcer"],
      feminineHigh: ["Elegant organizer", "Honest queen", "Detail-oriented creator"],
      feminineShadow: ["Nagging perfectionist", "Judgmental observer", "Cold critic"],
      highTimeline: ["Achieved excellence", "Known for integrity", "Precise legacy", "Set standards others follow"],
      lowTimeline: ["Criticized everyone away", "Right but alone", "Perfect but joyless", "Standards no one could meet"],
    },
  },
  Dog: {
    description: "The loyal guardian who protects through faithfulness, justice, and unwavering devotion.",
    dual: {
      realized: {
        traits: ["Fiercely loyal protector", "Just and fair", "Honest and trustworthy", "Devoted companion", "Moral compass"],
        energy: "You are the one people call at 3am — your loyalty is legendary and your word is bond.",
      },
      unrealized: {
        traits: ["Anxious worrier", "Pessimistic doomsayer", "Stubborn defender of lost causes", "Judgmental moralist", "Suspicious of everyone"],
        energy: "When fearful, your loyalty becomes suspicion and your justice becomes judgment.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Loyal beyond measure", "Protective and devoted", "Creates safe loving space"],
        unrealized: ["Anxious and suspicious", "Tests partner's loyalty", "Pessimistic about love"],
        lesson: "Trust is a muscle — strengthen it by using it.",
      },
      business: {
        realized: ["Trustworthy leader", "Fair manager", "Loyal business partner"],
        unrealized: ["Too cautious for growth", "Pessimistic about opportunities", "Judges colleagues harshly"],
        lanes: ["Law/justice", "Social work", "Security/protection", "Nonprofit leadership"],
        lesson: "Optimism is not naivety — it's strategic courage.",
      },
      shadow: ["Chronic anxiety", "Trust issues", "Moral rigidity"],
      growthKeys: ["Trust more easily", "Practice optimism daily", "Let go of needing to protect everyone"],
      masculineHigh: ["Loyal guardian", "Just protector", "Devoted father"],
      masculineShadow: ["Anxious watchdog", "Judgmental cop", "Suspicious of all"],
      feminineHigh: ["Devoted protector", "Fair queen", "Loyal companion"],
      feminineShadow: ["Anxious mother hen", "Pessimistic worrier", "Judgmental friend"],
      highTimeline: ["Known for unwavering loyalty", "Created justice", "Trusted by all", "Legacy of devotion"],
      lowTimeline: ["Worried life away", "Suspicious and alone", "Loyal but pessimistic", "Judged everyone harshly"],
    },
  },
  Pig: {
    description: "The generous soul who thrives through kindness, abundance, and genuine warmth.",
    dual: {
      realized: {
        traits: ["Generous benefactor", "Warm-hearted host", "Honest and sincere", "Enjoys life fully", "Compassionate friend"],
        energy: "You make everyone feel welcome — your generosity creates abundance wherever you go.",
      },
      unrealized: {
        traits: ["Overindulgent pleasure-seeker", "Naive and easily deceived", "Lazy when comfortable", "Materialistic spender", "Gullible doormat"],
        energy: "When unguarded, your generosity becomes naivety and your love of pleasure becomes addiction.",
      },
    },
    lifeAreas: {
      love: {
        realized: ["Generous and loving partner", "Creates warm comfortable home", "Devoted and faithful"],
        unrealized: ["Too trusting of wrong people", "Overindulges partner to avoid conflict", "Naive about red flags"],
        lesson: "Kindness needs wisdom — not everyone deserves your trust.",
      },
      business: {
        realized: ["Generous employer", "Creates abundant work environments", "Honest business practices"],
        unrealized: ["Too generous with resources", "Easily taken advantage of", "Avoids hard business decisions"],
        lanes: ["Hospitality/food", "Philanthropy", "Luxury goods", "Entertainment"],
        lesson: "Generosity and business savvy are not opposites — combine them.",
      },
      shadow: ["Naivety about others' intentions", "Overindulgence", "Laziness in comfort"],
      growthKeys: ["Develop discernment", "Practice moderation", "Set boundaries with giving"],
      masculineHigh: ["Generous patriarch", "Warm provider", "Honest leader"],
      masculineShadow: ["Naive fool", "Lazy hedonist", "Gives away the farm"],
      feminineHigh: ["Warm earth mother", "Abundant hostess", "Sincere lover"],
      feminineShadow: ["Naive pushover", "Overindulgent pleasure-seeker", "Gullible romantic"],
      highTimeline: ["Lived abundantly", "Generous legacy", "Beloved by community", "Warm and wealthy"],
      lowTimeline: ["Taken advantage of", "Comfortable but used", "Generous to a fault", "Never learned discernment"],
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// CHINESE ELEMENT BLUEPRINTS (5 elements)
// ═══════════════════════════════════════════════════════════════

export const chineseElementBlueprints: Record<string, ChineseElementBlueprint> = {
  Metal: {
    description: "Precision, strength, and determination. Metal refines and cuts through illusion.",
    realizedTraits: ["Disciplined executor", "Clear boundary setter", "Precision-oriented", "Resilient under pressure", "Structured thinker"],
    unrealizedTraits: ["Rigid and inflexible", "Emotionally cold", "Overly controlling", "Cuts people off easily", "Harsh self-critic"],
  },
  Water: {
    description: "Wisdom, flow, and adaptability. Water finds a way through any obstacle.",
    realizedTraits: ["Emotionally intelligent", "Adaptable and flowing", "Deep thinker", "Intuitive wisdom", "Diplomatic communicator"],
    unrealizedTraits: ["Passive and directionless", "Overly emotional", "Indecisive and drifting", "Manipulates through emotion", "Fears confrontation"],
  },
  Wood: {
    description: "Growth, vision, and generosity. Wood pushes upward toward the light.",
    realizedTraits: ["Visionary growth seeker", "Generous collaborator", "Ethical leader", "Creative innovator", "Expansive thinker"],
    unrealizedTraits: ["Overextends recklessly", "Inflexible idealist", "Aggressive competitor", "Grows without direction", "Judgmental of those who don't grow"],
  },
  Fire: {
    description: "Passion, charisma, and transformation. Fire illuminates and transforms everything it touches.",
    realizedTraits: ["Passionate leader", "Charismatic influencer", "Warm and inspiring", "Action-oriented creator", "Transformational force"],
    unrealizedTraits: ["Burns too hot too fast", "Impulsive reactor", "Attention-seeking performer", "Destructive temper", "Burns out and crashes"],
  },
  Earth: {
    description: "Stability, nurturing, and grounding. Earth holds space and creates fertile ground.",
    realizedTraits: ["Grounding presence", "Nurturing caretaker", "Patient mediator", "Reliable foundation", "Community builder"],
    unrealizedTraits: ["Stagnant and stuck", "Overly cautious", "Worries excessively", "Smothers with care", "Resistant to change"],
  },
};
