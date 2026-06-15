// KAITO'S CURIOS — static game content & tuning.
//
// A cozy buy-low / sell-high roguelite. You're a travelling trader; Kaito runs
// the curio shop. Each morning he teaches you a "trick of the trade" — draft one
// of three skills that stack for the rest of the run. Buy goods off his shelf at
// the marked price, then sell them back into the day's DEMAND for a premium.
// Survive an escalating nightly rent. Survive long enough and Kaito tells you who
// he really is.

// ---- tuning knobs -------------------------------------------------------------
// Every balance dial lives here so a tuning pass is a single-file edit; the
// engine reads these rather than hard-coding constants. The balance regression
// test (shopBalance.test.js) drives the real engine and asserts win-rate bands,
// so retuning is safe to do empirically.
export const CONFIG = {
  startGold: 100, // working capital on day 1
  startSlots: 6, // bag slots before any "Bigger Satchel" skill

  buyMarkup: 1.15, // shelf buy price = value * (this − discount skill)
  buyMarkupFloor: 0.8, // discount can never push the markup below this
  dumpFactor: 0.5, // off-demand sell price = value * (this + salvage skill)
  dumpCap: 0.95, // salvage can never push the dump rate above this
  wantBonusMin: 0.45, // a wanted category sells at value * (1 + bonus)...
  wantBonusMax: 0.85, // ...with the bonus rolled in this band
  saturationDecay: 0.62, // each same-category sale that day shrinks the next premium

  wantsMin: 2, // categories in demand each day
  wantsMax: 3,
  shelfMin: 6,
  shelfMax: 8,
  shelfWantedFrac: 0.6, // share of the shelf stocked toward today's demand
  shelfWantedMin: 3, // ...but always at least this many wanted wares

  baseRent: 28, // day 1 rent
  rentGrowth: 1.27, // rent *= this each day
  seasonEndTax: 1.5, // the final trading day's rent is multiplied by this
  victoryDay: 8, // reach the morning of this day (survive 7 trading days) = win

  draftSize: 3, // skills offered each morning draft

  // per-skill magnitudes (see SKILLS below for what each does)
  discountStep: 0.1, // buy markup −0.10 per level
  bagStep: 2, // +2 bag slots per level
  connoisseurStep: 0.15, // wanted bonus +0.15 per level
  salvageStep: 0.12, // dump rate +0.12 per level
  stipendStep: 14, // +14 coin at the start of each day per level
  // luckyFind & restock are 1 unit per level (free item / shelf refresh).
};

// ---- rarity ------------------------------------------------------------------
// `greed` nudges the buy markup up for fancier goods; `jit` is the daily value
// jitter band. `hue` drives the little rarity pip in the UI.
export const RARITY = {
  common: { label: "COMMON", greed: 0.0, jit: 0.1, hue: "#8a7a5c" },
  uncommon: { label: "UNCOMMON", greed: 0.05, jit: 0.14, hue: "#c98a3a" },
  rare: { label: "RARE", greed: 0.1, jit: 0.18, hue: "#3f6f9e" },
  legendary: { label: "LEGENDARY", greed: 0.16, jit: 0.22, hue: "#6d4a87" },
};

// ---- item catalog ------------------------------------------------------------
// `base` is the item's reference value; the day's jitter scales it slightly.
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
  { id: "cheese-wheel", name: "Wheel of Cheese", category: "Food", base: 30, rarity: "common", flavor: "Aged in a cave by someone who cared." },
  { id: "gold-bangle", name: "Gold Bangle", category: "Trinket", base: 130, rarity: "uncommon", flavor: "Jingles smugly when you haggle." },
  { id: "carved-mask", name: "Carved Mask", category: "Curio", base: 150, rarity: "rare", flavor: "It watches you back, a little." },
  { id: "fire-opal", name: "Fire Opal", category: "Gem", base: 250, rarity: "legendary", flavor: "A trapped sunset, faintly warm." },
  { id: "bronze-idol", name: "Bronze Idol", category: "Relic", base: 135, rarity: "rare", flavor: "Small god, big opinions." },
  { id: "rune-stone", name: "Rune Stone", category: "Relic", base: 78, rarity: "uncommon", flavor: "The runes spell something rude, probably." },
  { id: "spice-pouch", name: "Spice Pouch", category: "Food", base: 34, rarity: "common", flavor: "One pinch and the whole stew sings." },
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export const CATEGORIES = [...new Set(ITEMS.map((i) => i.category))];

// Cheap, starter-friendly categories — every day's demand leads with one of
// these so an affordable flip always exists, even on a thin opening.
export const CHEAP_CATEGORIES = ["Food", "Potion", "Tool", "Trinket"].filter((c) =>
  CATEGORIES.includes(c)
);

// ---- roguelite skill catalog -------------------------------------------------
// Each morning Kaito offers `CONFIG.draftSize` of these. `kind:"once"` skills are
// boolean (offered until taken); `kind:"stack"` skills level up to `max`. All
// effects are read/applied in shopEngine.js — this is pure metadata.
export const SKILLS = [
  { id: "appraise", name: "Appraiser's Eye", kind: "once", icon: "🔍", desc: "See every ware's true value, on the shelf and in your bag." },
  { id: "discount", name: "Friendly Regular", kind: "stack", max: 3, icon: "🤝", desc: "Kaito knocks 10% off his buy prices (per level)." },
  { id: "connoisseur", name: "Connoisseur", kind: "stack", max: 3, icon: "✨", desc: "Wares sold into demand fetch +15% more (per level)." },
  { id: "bag", name: "Bigger Satchel", kind: "stack", max: 3, icon: "🎒", desc: "+2 bag slots (per level)." },
  { id: "salvage", name: "Salvager", kind: "stack", max: 2, icon: "♻️", desc: "Off-demand wares sell for 12% more (per level)." },
  { id: "stipend", name: "Morning Stipend", kind: "stack", max: 3, icon: "🪙", desc: "Start each day with +14 coin (per level)." },
  { id: "forecast", name: "Market Whisper", kind: "once", icon: "🔮", desc: "See tomorrow's demand on the closing-time ledger." },
  { id: "luckyFind", name: "Lucky Find", kind: "stack", max: 2, icon: "🍀", desc: "Start each day with a free ware in your bag (per level)." },
  { id: "restock", name: "Restocker", kind: "stack", max: 2, icon: "🔄", desc: "Refresh the shelf once more each day (per level)." },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// ---- Kaito's portraits (existing /Dialog/Pictures/*.webp) by mood ------------
export const PORTRAITS = {
  greet: ["WaveOpenNeck", "Welcome", "Smile"],
  deal: ["ThumbsUp", "Smile"],
  pleased: ["ThumbsUp", "Welcome"],
  think: ["Thinking", "Talk2", "Talk1"],
  idle: ["Smile", "Talk1", "WaveOpenNeck"],
};

// ---- Kaito's quips, by moment ------------------------------------------------
export const QUIPS = {
  greet: [
    "Morning! Fresh wares on the shelf.",
    "Welcome back, friend. See what catches your eye.",
    "Demand's posted on the board — sell smart.",
    "Come in, come in! Plenty to trade today.",
    "Browse away. The good stuff goes quick.",
  ],
  buy: [
    "Sold — to you! Enjoy it, now.",
    "Ha, you've got an eye for it.",
    "A fine pick. Take care of it, eh?",
    "Off it goes to a good home.",
    "Pleasure doing business.",
  ],
  sell: [
    "I'll take it — thanks kindly.",
    "Into the collection it goes.",
    "Mm, this'll find a buyer.",
    "Good doing business with you.",
    "Done and done. Fair's fair.",
  ],
  draft: [
    "Here — let me teach you a trick of the trade.",
    "Pick one. It'll serve you well.",
    "A good trader's always learning. Go on, choose.",
    "Tools of the trade, friend. Take your pick.",
  ],
};

// ---- milestone story: who Kaito really is ------------------------------------
// Surviving each trading day reveals the next beat (STORY_DAYS maps a beat to the
// day-survived that unlocks it). The whole point of the shop: deal with Kaito long
// enough and he tells you who he actually is. Guaranteed reachable by surviving.
export const STORY = [
  {
    title: "Kaito notices your fair dealing",
    text: "You've got an honest streak — I like that. You're a natural at this. Stick around; the shop gets more interesting.",
    portrait: "Talk2",
  },
  {
    title: "Kaito warms up",
    text: "Y'know, I only run this shop for fun. By day I'm a software engineer in Calgary — I build things for the web.",
    portrait: "Smile",
  },
  {
    title: "Kaito trusts you",
    text: "On the side? I'm a self-taught game developer. Shipped a bunch of games — even an online multiplayer one called 'I'm Slime'.",
    portrait: "ThumbsUp",
  },
  {
    title: "Kaito opens up",
    text: "Before all the code, there was karate. ISKF Alberta Provincial Champion — two years running.",
    portrait: "Welcome",
  },
  {
    title: "Kaito, the overachiever",
    text: "University of Calgary, software engineering. Graduated top of the class — 3.94 GPA. I, uh, may have studied a little too much.",
    portrait: "Embarrassed",
  },
  {
    title: "Best of friends",
    text: "These days I'm a Senior Software Engineer at Finofo — promoted in my first year. But honestly? I just love making things, and the people I make them with. Thanks for being a friend.",
    portrait: "Wave",
  },
];

// Beat i is revealed the night you survive day STORY_DAYS[i]. Spread across every
// trading day before the final one, so a player who reaches the win has heard all
// six (the final beat lands on the night before victory).
export const STORY_DAYS = STORY.map((_, i) => i + 1);
