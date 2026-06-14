// KAITO'S CURIOS — static game content & tuning.
//
// A cozy haggling roguelike: you're a travelling trader, Kaito runs the shop.
// Buy goods off his shelf (haggle the price DOWN), then sell them back to him
// (haggle UP) — he pays a premium for whatever the town WANTS that day. Survive
// an escalating daily rent. Deal fairly and his rapport climbs, unlocking perks
// and, between days, real pieces of who Kaito actually is.

// ---- tuning knobs -------------------------------------------------------------
export const CONFIG = {
  startGold: 140,
  startSlots: 6,
  baseRent: 45, // day 1 rent
  rentGrowth: 1.18, // rent *= this each day
  shelfMin: 5,
  shelfMax: 7,
  wantsMin: 2,
  wantsMax: 3,
  victoryDay: 9, // survive to the morning of this day (8 trading days) = you win
  basePatience: 3,
  dumpFactor: 0.62, // sell-to-Kaito ceiling for items he does NOT want today
  wantFactor: 1.6, // sell-to-Kaito ceiling for WANTED items (the premium)
};

// ---- rarity ------------------------------------------------------------------
// `greed` nudges Kaito's asking markup up for fancier goods; `jit` is the daily
// value jitter band. `tag`/`hue` drive the little rarity pip in the UI.
export const RARITY = {
  common: { label: "COMMON", greed: 0.0, jit: 0.1, hue: "#8a7a5c" },
  uncommon: { label: "UNCOMMON", greed: 0.05, jit: 0.14, hue: "#3c7a5e" },
  rare: { label: "RARE", greed: 0.1, jit: 0.18, hue: "#3f6f9e" },
  legendary: { label: "LEGENDARY", greed: 0.16, jit: 0.22, hue: "#6d4a87" },
};

// ---- item catalog ------------------------------------------------------------
// `base` is the item's reference value; the day's market scales it per category.
export const ITEMS = [
  { id: "health-potion", name: "Health Potion", category: "Potion", base: 28, rarity: "common", flavor: "Tastes like cherries and regret." },
  { id: "mana-elixir", name: "Mana Elixir", category: "Potion", base: 44, rarity: "common", flavor: "Fizzy. Do not shake." },
  { id: "luck-tonic", name: "Luck Tonic", category: "Potion", base: 95, rarity: "rare", flavor: "Bottled at a four-leaf clover farm." },
  { id: "silver-ring", name: "Silver Ring", category: "Trinket", base: 60, rarity: "common", flavor: "Slightly too big for everyone." },
  { id: "jade-pendant", name: "Jade Pendant", category: "Trinket", base: 115, rarity: "uncommon", flavor: "Cool to the touch, warm in value." },
  { id: "pocket-watch", name: "Pocket Watch", category: "Trinket", base: 150, rarity: "uncommon", flavor: "Always five minutes fast." },
  { id: "sapphire-amulet", name: "Sapphire Amulet", category: "Trinket", base: 205, rarity: "rare", flavor: "Worn by someone important, probably." },
  { id: "iron-dagger", name: "Iron Dagger", category: "Tool", base: 48, rarity: "common", flavor: "Good for letters and trouble." },
  { id: "hand-axe", name: "Hand Axe", category: "Tool", base: 54, rarity: "common", flavor: "Splits logs and arguments." },
  { id: "brass-compass", name: "Brass Compass", category: "Tool", base: 120, rarity: "uncommon", flavor: "Points home. Usually." },
  { id: "spell-scroll", name: "Spell Scroll", category: "Scroll", base: 85, rarity: "uncommon", flavor: "One use. Read carefully." },
  { id: "old-tome", name: "Old Tome", category: "Scroll", base: 135, rarity: "uncommon", flavor: "Smells of dust and secrets." },
  { id: "treasure-map", name: "Treasure Map", category: "Scroll", base: 165, rarity: "rare", flavor: "X marks a spot. Some spot." },
  { id: "ruby", name: "Ruby", category: "Gem", base: 230, rarity: "rare", flavor: "Red as a good day's profit." },
  { id: "sapphire", name: "Sapphire", category: "Gem", base: 215, rarity: "rare", flavor: "The ruby's cooler sibling." },
  { id: "ancient-coin", name: "Ancient Coin", category: "Relic", base: 90, rarity: "uncommon", flavor: "Currency of a forgotten king." },
  { id: "crystal-skull", name: "Crystal Skull", category: "Curio", base: 320, rarity: "legendary", flavor: "Definitely not cursed. Definitely." },
  { id: "music-box", name: "Music Box", category: "Curio", base: 175, rarity: "rare", flavor: "Plays a tune nobody remembers." },
  { id: "honey-jar", name: "Honey Jar", category: "Food", base: 24, rarity: "common", flavor: "The bees worked hard for this." },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const CATEGORIES = [...new Set(ITEMS.map((i) => i.category))];

// ---- Kaito's portraits (existing /Dialog/Pictures/*.webp) by mood ------------
export const PORTRAITS = {
  greet: ["WaveOpenNeck", "Welcome", "Smile"],
  think: ["Thinking", "Talk2", "Talk1"],
  deal: ["ThumbsUp", "Smile"],
  pleased: ["ThumbsUp", "Welcome"],
  annoyed: ["Talk2", "Thinking"],
  insult: ["Embarrassed", "Thinking"],
  walk: ["Wave"],
  idle: ["Smile", "Talk1", "WaveOpenNeck"],
};

// ---- Kaito's quips, by haggle outcome ----------------------------------------
export const QUIPS = {
  buyGreet: [
    "Ah, good eye! That one's special.",
    "See anything you fancy?",
    "Browse away, friend — no rush.",
    "That piece? Came in this morning.",
    "Careful, that one's a favourite of mine.",
    "Go on, make me an offer.",
  ],
  sellGreet: [
    "Oh? What've you got for me?",
    "Let's see what you're hauling around.",
    "Selling, are we? Show me.",
    "Hand it over, let's have a look.",
    "Mm, let's see if it's my kind of thing.",
  ],
  think: [
    "Hmm, you drive a hard bargain...",
    "Ooh, you're good at this.",
    "You're killing me here — but go on.",
    "Let me think... a touch more?",
    "Tch. You've done this before, haven't you?",
    "Twisting my arm, you are.",
  ],
  deal: [
    "Deal! Pleasure doing business.",
    "Sold! Enjoy it, now.",
    "Alright, it's yours. Good trade!",
    "Done and done. Come again!",
    "Shake on it — fair's fair.",
    "Ha! You've got a knack for this.",
  ],
  annoyed: [
    "Oof, that one stings a little.",
    "Come on now, I've got rent too!",
    "I can't go quite that far, friend.",
    "You're squeezing the last copper out of me.",
  ],
  insult: [
    "Hah! Are you trying to rob me?",
    "Now that's just rude!",
    "My grandmother haggles kinder than that.",
    "For that? I'd sooner keep it.",
  ],
  overpay: [
    "Heh, sure, if you insist!",
    "Generous! I like you already.",
    "Well now, aren't you a gentleman.",
  ],
  walk: [
    "No deal this time. Come back soon!",
    "Maybe next time, friend.",
    "Ah well — door's always open.",
    "Suit yourself! I'll be here.",
  ],
};

// ---- random day events -------------------------------------------------------
// Declarative effects the engine knows how to apply for the coming day.
export const EVENTS = [
  { id: "festival", title: "Town Festival", text: "Everyone's buying! Kaito pays more for goods today.", effect: { wantBonus: 0.3 } },
  { id: "caravan", title: "Merchant Caravan", text: "A caravan flooded the market — Kaito's shelf is cheaper today.", effect: { shelfDiscount: 0.15 } },
  { id: "gemRush", title: "Gem Rush", text: "Jewels are hot. Gems & trinkets fetch a premium.", effect: { categoryWant: ["Gem", "Trinket"], wantBonus: 0.25 } },
  { id: "goodMood", title: "Kaito's in a Mood", text: "Kaito's whistling today — extra patience while you haggle.", effect: { patience: 2 } },
  { id: "taxman", title: "The Taxman Cometh", text: "Rent's steeper today. Ouch.", effect: { rentMult: 1.4 } },
  { id: "slow", title: "Slow Day", text: "Quiet streets. Fewer orders, but Kaito's restless.", effect: { fewerWants: 1, patience: 1 } },
  { id: "collector", title: "A Collector Visits", text: "A curio collector is in town — relics & curios pay big.", effect: { categoryWant: ["Curio", "Relic"], wantBonus: 0.35 } },
  { id: "harvest", title: "Harvest Fair", text: "Stalls overflow — food & potions are flying off the shelves.", effect: { categoryWant: ["Food", "Potion"], wantBonus: 0.28 } },
  { id: "adventurers", title: "Adventurers in Town", text: "A party's gearing up — tools & scrolls are in high demand.", effect: { categoryWant: ["Tool", "Scroll"], wantBonus: 0.26 } },
  { id: "boom", title: "Market Boom", text: "Coin's flowing freely. Kaito pays a little more for everything today.", effect: { wantBonus: 0.18, patience: 1 } },
  { id: "landlordAway", title: "Landlord's Away", text: "The landlord skipped town — tonight's rent is lighter than usual.", effect: { rentMult: 0.7 } },
];

// ---- short, player-facing labels for each perk (used in the rapport preview) -
export const PERK_LABELS = {
  appraise: "Appraising eye",
  patience: "+1 Patience",
  slot: "+2 Bag slots",
  discount: "Friend's discount",
};

// ---- rapport tiers: perks + a real piece of Kaito's story ---------------------
// Crossing a threshold (cumulative rapport) reveals a backstory card on the next
// day-break and applies its perk. `portrait` is a /Dialog/Pictures/*.webp name.
export const RAPPORT_TIERS = [
  {
    at: 12,
    perk: "appraise",
    title: "Kaito notices your fair dealing",
    text: "You've got an honest streak — I like that. Tell you what, I'll let you appraise the goods now. You'll see what they're really worth.",
    portrait: "Talk2",
  },
  {
    at: 28,
    perk: "patience",
    title: "Kaito warms up",
    text: "Y'know, I only run this shop for fun. By day I'm a software engineer in Calgary — I build things for the web.",
    portrait: "Smile",
  },
  {
    at: 46,
    perk: "slot",
    title: "Kaito trusts you",
    text: "On the side? I'm a self-taught game developer. Shipped a bunch of games — even an online multiplayer one called 'I'm Slime'. Here, take a bigger bag.",
    portrait: "ThumbsUp",
  },
  {
    at: 66,
    perk: "discount",
    title: "Kaito opens up",
    text: "Before all the code, there was karate. ISKF Alberta Provincial Champion — two years running. Friends get a discount, by the way.",
    portrait: "Welcome",
  },
  {
    at: 88,
    perk: "slot",
    title: "Kaito, the overachiever",
    text: "University of Calgary, software engineering. Graduated top of the class — 3.94 GPA. I, uh, may have studied a little too much.",
    portrait: "Embarrassed",
  },
  {
    at: 110,
    perk: "patience",
    title: "Best of friends",
    text: "These days I'm a Senior Software Engineer at Finofo — promoted in my first year. But honestly? I just love making things, and the people I make them with. Thanks for being a friend.",
    portrait: "Wave",
  },
];
