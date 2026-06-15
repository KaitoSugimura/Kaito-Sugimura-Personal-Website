import { memo } from "react";

// KAITO'S CURIOS — from-scratch SVG item art.
//
// One cohesive flat-illustrative set (64x64 viewBox, #2b2118 ink outlines, a
// shared warm palette, soft ground shadows). Stored as raw markup and rendered
// inline; all strings are authored here (no user input) so dangerouslySetInnerHTML
// is safe. Consumers size the icon via the wrapping `className`; the svg fills it.

const ICONS = {
  "health-potion": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="27" y="7" width="10" height="7" rx="1.5" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <rect x="28.5" y="13" width="7" height="9" fill="#cfe3df" stroke="#2b2118" stroke-width="2"/>
  <path d="M24 21 H40 L43 33 A14 15 0 1 1 21 33 Z" fill="#cfe3df" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M20 35 A13 13 0 0 0 44 35 Q44 48 32 49 Q20 48 20 35 Z" fill="#b23b2c"/>
  <circle cx="28" cy="42" r="2" fill="#f7f1e4" opacity="0.7"/>
  <circle cx="34" cy="38" r="1.3" fill="#f7f1e4" opacity="0.6"/>
  <path d="M23 30 Q20 37 23 44" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "mana-elixir": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="10" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="28" y="6" width="8" height="6" rx="1.5" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <rect x="29.5" y="11" width="5" height="8" fill="#cfe3df" stroke="#2b2118" stroke-width="2"/>
  <path d="M28 18 H36 L38 30 Q40 36 40 42 Q40 52 32 53 Q24 52 24 42 Q24 36 26 30 Z" fill="#cfe3df" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M25 33 Q25 36 24.6 39 Q24 47 32 48 Q40 47 39.4 39 Q39 36 39 33 Q32 35 25 33 Z" fill="#7ba6cf"/>
  <circle cx="29" cy="42" r="1.8" fill="#f7f1e4" opacity="0.7"/>
  <circle cx="34" cy="39" r="1.1" fill="#f7f1e4" opacity="0.6"/>
  <path d="M27 24 Q26 28 27 32" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "luck-tonic": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="27" y="7" width="10" height="7" rx="1.5" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <rect x="28.5" y="13" width="7" height="8" fill="#cfe3df" stroke="#2b2118" stroke-width="2"/>
  <path d="M27 20 H37 L40 28 A15 15 0 1 1 24 28 Z" fill="#cfe3df" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M20 35 A14 14 0 0 0 44 35 Q44 49 32 50 Q20 49 20 35 Z" fill="#3c7a5e"/>
  <path d="M32 36 Q30 33 32 31 Q34 33 32 36 Z M32 42 Q30 45 32 47 Q34 45 32 42 Z M29 39 Q26 37 24 39 Q26 41 29 39 Z M35 39 Q38 37 40 39 Q38 41 35 39 Z" fill="#6fae86" stroke="#2b2118" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="32" cy="39" r="1.2" fill="#3c7a5e"/>
  <circle cx="26" cy="45" r="2" fill="#f7f1e4" opacity="0.6"/>
  <path d="M22 31 Q20 37 23 43" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "silver-ring": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <ellipse cx="32" cy="38" rx="17" ry="15" fill="#8a97a3" stroke="#2b2118" stroke-width="2"/>
  <ellipse cx="32" cy="38" rx="9" ry="8" fill="#f3e3c3" stroke="#2b2118" stroke-width="2"/>
  <path d="M24 30 A17 15 0 0 1 40 30" stroke="#f7f1e4" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>
  <polygon points="32,9 39,16 36,24 28,24 25,16" fill="#3f6f9e" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="32,9 36,16 32,18 28,16" fill="#7ba6cf"/>
  <polygon points="28,24 32,18 36,24" fill="#7ba6cf" opacity="0.7"/>
  <line x1="32" y1="18" x2="32" y2="24" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  "jade-pendant": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="10" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M13 16 Q32 6 51 16" stroke="#2b2118" stroke-width="2" stroke-linecap="round" fill="none"/>
  <ellipse cx="32" cy="19" rx="5" ry="6" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <ellipse cx="32" cy="19" rx="2" ry="2.5" fill="#f3e3c3" stroke="#2b2118" stroke-width="1.5"/>
  <path d="M32 25 Q23 33 23 42 A9 11 0 0 0 41 42 Q41 33 32 25 Z" fill="#3c7a5e" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M32 30 Q27 36 27 41" stroke="#6fae86" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
  <circle cx="35" cy="45" r="2" fill="#f7f1e4" opacity="0.5"/>
  <circle cx="30" cy="19" r="1" fill="#f4cf73" opacity="0.7"/>
</svg>`,
  "pocket-watch": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="57" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <circle cx="32" cy="10" r="4" fill="none" stroke="#2b2118" stroke-width="2"/>
  <rect x="29" y="12" width="6" height="5" rx="1" fill="#e0a52b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="36" r="21" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <circle cx="32" cy="36" r="16" fill="#f7f1e4" stroke="#2b2118" stroke-width="2"/>
  <line x1="32" y1="23" x2="32" y2="26" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="46" x2="32" y2="49" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="19" y1="36" x2="22" y2="36" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="42" y1="36" x2="45" y2="36" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="36" x2="32" y2="26" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="36" x2="40" y2="40" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="36" r="2" fill="#2b2118"/>
  <path d="M22 28 A14 14 0 0 1 30 23" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "sapphire-amulet": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="12" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M19 14 Q32 24 45 14" fill="none" stroke="#e0a52b" stroke-width="3" stroke-linecap="round"/>
  <path d="M19 14 Q32 24 45 14" fill="none" stroke="#2b2118" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
  <polygon points="32,18 38,22 38,26 26,26 26,22" fill="#e0a52b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="40" r="16" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <polygon points="32,22 35,27 32,25 29,27" fill="#f4cf73"/>
  <polygon points="32,58 35,53 32,55 29,53" fill="#f4cf73"/>
  <polygon points="14,40 19,37 17,40 19,43" fill="#f4cf73"/>
  <polygon points="50,40 45,37 47,40 45,43" fill="#f4cf73"/>
  <circle cx="32" cy="40" r="10" fill="#f4cf73" stroke="#2b2118" stroke-width="2"/>
  <polygon points="32,32 40,40 32,48 24,40" fill="#3f6f9e" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="32,32 36,40 32,40 28,40" fill="#7ba6cf"/>
  <circle cx="29" cy="37" r="1.4" fill="#f7f1e4" opacity="0.7"/>
</svg>`,
  "iron-dagger": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="57" rx="9" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M32 6 L40 34 L32 38 L24 34 Z" fill="#8a97a3" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <line x1="32" y1="10" x2="32" y2="34" stroke="#4a5560" stroke-width="2" stroke-linecap="round"/>
  <path d="M28 32 L36 32" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  <rect x="20" y="34" width="24" height="5" rx="2" fill="#6b4a2b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <rect x="28" y="39" width="8" height="13" rx="2" fill="#6b4a2b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <line x1="29" y1="42" x2="35" y2="42" stroke="#4a3219" stroke-width="2" stroke-linecap="round"/>
  <line x1="29" y1="45" x2="35" y2="45" stroke="#4a3219" stroke-width="2" stroke-linecap="round"/>
  <line x1="29" y1="48" x2="35" y2="48" stroke="#4a3219" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="54" r="4" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <circle cx="30" cy="52" r="1.2" fill="#f7f1e4" opacity="0.6"/>
</svg>`,
  "hand-axe": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="57" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="36" y="8" width="6" height="48" rx="3" transform="rotate(22 39 32)" fill="#6b4a2b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12 14 Q34 8 38 20 Q30 26 14 30 Q9 22 12 14 Z" fill="#8a97a3" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12 14 Q9 22 14 30" stroke="#4a5560" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M16 16 Q28 13 33 20" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  <path d="M41 48 L47 51" stroke="#4a3219" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  "brass-compass": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="57" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <circle cx="32" cy="8" r="4" fill="none" stroke="#2b2118" stroke-width="2"/>
  <circle cx="32" cy="35" r="23" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <circle cx="32" cy="35" r="17" fill="#f7f1e4" stroke="#2b2118" stroke-width="2"/>
  <line x1="32" y1="20" x2="32" y2="23" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="47" x2="32" y2="50" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="17" y1="35" x2="20" y2="35" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="44" y1="35" x2="47" y2="35" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <polygon points="32,23 28,35 32,35" fill="#b23b2c" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="32,47 36,35 32,35" fill="#f7f1e4" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="35" r="2.5" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <path d="M20 26 A17 17 0 0 1 28 20" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "spell-scroll": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M16 16 H48 V48 H16 Z" fill="#f3e3c3" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="30" r="6" fill="none" stroke="#6d4a87" stroke-width="2"/>
  <path d="M32 25 L36.3 32.5 L27.7 32.5 Z" fill="none" stroke="#6d4a87" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="30" r="1.3" fill="#a07cc0"/>
  <line x1="21" y1="39" x2="43" y2="39" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
  <line x1="21" y1="43" x2="38" y2="43" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
  <line x1="23" y1="22" x2="41" y2="22" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
  <rect x="12" y="11" width="40" height="8" rx="4" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <ellipse cx="50" cy="15" rx="2.5" ry="4" fill="#4a3219" stroke="#2b2118" stroke-width="2"/>
  <rect x="12" y="45" width="40" height="8" rx="4" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <ellipse cx="50" cy="49" rx="2.5" ry="4" fill="#4a3219" stroke="#2b2118" stroke-width="2"/>
  <line x1="16" y1="14" x2="44" y2="14" stroke="#f7f1e4" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
</svg>`,
  "old-tome": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="16" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M18 12 L46 9 L46 49 L18 52 Z" fill="#7e271b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M46 9 L52 12 L52 52 L46 49 Z" fill="#4a3219" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M18 52 L18 12 L12 15 L12 55 Z" fill="#f7f1e4" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <line x1="14" y1="22" x2="16" y2="21" stroke="#2b2118" stroke-width="1.2" opacity="0.35"/>
  <line x1="14" y1="30" x2="16" y2="29" stroke="#2b2118" stroke-width="1.2" opacity="0.35"/>
  <line x1="14" y1="38" x2="16" y2="37" stroke="#2b2118" stroke-width="1.2" opacity="0.35"/>
  <line x1="14" y1="46" x2="16" y2="45" stroke="#2b2118" stroke-width="1.2" opacity="0.35"/>
  <circle cx="32" cy="27" r="6.5" fill="none" stroke="#e0a52b" stroke-width="2"/>
  <path d="M32 23 L34.2 27 L32 31 L29.8 27 Z" fill="#f4cf73" stroke="#e0a52b" stroke-width="1.5" stroke-linejoin="round"/>
  <rect x="43" y="24" width="7" height="8" rx="1.5" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <line x1="46.5" y1="26.5" x2="46.5" y2="29.5" stroke="#4a3219" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M21 14 L43 11.5" stroke="#f7f1e4" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
</svg>`,
  "treasure-map": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M8 16 L24 13 L40 16 L56 13 L54 49 L38 51 L22 48 L9 50 Z" fill="#f3e3c3" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <line x1="24" y1="13" x2="22" y2="48" stroke="#2b2118" stroke-width="1.3" opacity="0.3"/>
  <line x1="40" y1="16" x2="38" y2="51" stroke="#2b2118" stroke-width="1.3" opacity="0.3"/>
  <path d="M13 38 Q17 33 22 36 Q19 40 13 38 Z" fill="#6fae86" stroke="#3c7a5e" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M28 24 L32 19 L36 24 Z" fill="#8a97a3" stroke="#4a5560" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="15" y1="30" x2="19" y2="31" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <line x1="23" y1="31" x2="27" y2="30" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <line x1="31" y1="31" x2="34" y2="34" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <line x1="37" y1="37" x2="40" y2="40" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <line x1="41" y1="43" x2="43" y2="42" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <line x1="42" y1="39" x2="49" y2="32" stroke="#7e271b" stroke-width="3" stroke-linecap="round"/>
  <line x1="49" y1="39" x2="42" y2="32" stroke="#7e271b" stroke-width="3" stroke-linecap="round"/>
  <path d="M11 18 L23 15.5" stroke="#f7f1e4" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
</svg>`,
  "ruby": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <polygon points="14,24 50,24 32,30" fill="#b23b2c" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="14,24 32,30 18,52" fill="#7e271b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="50,24 46,52 32,30" fill="#7e271b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="14,24 18,52 32,58 46,52 50,24 32,30" fill="#b23b2c" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <line x1="32" y1="30" x2="18" y2="52" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="30" x2="46" y2="52" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="30" x2="32" y2="58" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <polygon points="20,25 30,29 23,42" fill="#f7f1e4" opacity="0.45"/>
  <polygon points="32,25 44,24 38,28" fill="#f7f1e4" opacity="0.55"/>
</svg>`,
  "sapphire": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="12" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M32 6 Q48 24 32 58 Q16 24 32 6 Z" fill="#3f6f9e" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="32,16 41,30 32,40 23,30" fill="#7ba6cf" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <line x1="32" y1="16" x2="32" y2="6" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="41" y1="30" x2="46" y2="30" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="23" y1="30" x2="18" y2="30" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="40" x2="32" y2="58" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <path d="M28 14 Q22 24 27 36" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  <polygon points="32,18 38,30 32,37" fill="#f7f1e4" opacity="0.4"/>
</svg>`,
  "ancient-coin": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="14" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M32 7 Q52 8 54 31 Q55 53 32 55 Q11 54 9 31 Q9 9 32 7 Z" fill="#e0a52b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="31" r="17" fill="none" stroke="#2b2118" stroke-width="2" opacity="0.55"/>
  <polygon points="32,18 35,28 45,28 37,34 40,44 32,38 24,44 27,34 19,28 29,28" fill="#f4cf73" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M16 22 Q12 31 16 40" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  <circle cx="22" cy="16" r="1.6" fill="#f7f1e4" opacity="0.5"/>
</svg>`,
  "crystal-skull": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M32 9 L46 17 L48 33 L42 41 L42 48 L22 48 L22 41 L16 33 L18 17 Z" fill="#6d4a87" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="32,9 46,17 32,28 18,17" fill="#a07cc0"/>
  <polygon points="18,17 32,28 24,38 16,33" fill="#6d4a87"/>
  <polygon points="46,17 48,33 40,38 32,28" fill="#6d4a87"/>
  <polygon points="24,38 40,38 42,48 22,48" fill="#a07cc0"/>
  <path d="M32 9 L46 17 L48 33 L42 41 L42 48 L22 48 L22 41 L16 33 L18 17 Z" fill="none" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="21,30 28,28 27,37 22,38" fill="#2b2118"/>
  <polygon points="43,30 36,28 37,37 42,38" fill="#2b2118"/>
  <polygon points="32,33 35,41 29,41" fill="#2b2118"/>
  <line x1="27" y1="48" x2="27" y2="43" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="48" x2="32" y2="43" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="37" y1="48" x2="37" y2="43" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <polygon points="32,11 41,16 33,23" fill="#f7f1e4" opacity="0.45"/>
</svg>`,
  "music-box": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="12" y="26" width="40" height="22" rx="2" fill="#6b4a2b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <rect x="12" y="38" width="40" height="4" fill="#e0a52b"/>
  <path d="M11 26 Q11 18 32 18 Q53 18 53 26 Z" fill="#4a3219" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M32 21 L34.4 26 L39.8 26.6 L35.8 30.2 L37 35.4 L32 32.7 L27 35.4 L28.2 30.2 L24.2 26.6 L29.6 26 Z" fill="#f4cf73" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <rect x="15" y="48" width="5" height="4" rx="1" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <rect x="44" y="48" width="5" height="4" rx="1" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <line x1="52" y1="37" x2="58" y2="37" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <path d="M58 37 L58 33 L54 33" fill="none" stroke="#2b2118" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="54" cy="33" r="2.2" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <rect x="15" y="29" width="6" height="2" rx="1" fill="#f7f1e4" opacity="0.5"/>
</svg>`,
  "honey-jar": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="14" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M18 26 Q18 22 22 22 L42 22 Q46 22 46 26 L48 38 Q49 51 32 51 Q15 51 16 38 Z" fill="#e0a52b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M17 32 Q32 36 47 32 L48 38 Q49 51 32 51 Q15 51 16 38 Z" fill="#f4cf73" opacity="0.55"/>
  <path d="M16 22 Q16 14 32 14 Q48 14 48 22 Q48 26 32 26 Q16 26 16 22 Z" fill="#f3e3c3" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M19 19 L23 23 M27 16 L30 24 M37 16 L34 24 M45 19 L41 23" stroke="#2b2118" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  <path d="M14 21 Q32 26 50 21" stroke="#6b4a2b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <line x1="50" y1="7" x2="50" y2="30" stroke="#6b4a2b" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="50" cy="6" rx="3.5" ry="2.5" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <path d="M50 30 Q47 34 50 38 Q53 41 51 44" stroke="#e0a52b" stroke-width="3" stroke-linecap="round" fill="none"/>
  <circle cx="24" cy="38" r="2" fill="#f7f1e4" opacity="0.6"/>
  <path d="M21 30 Q19 38 22 45" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.45"/>
</svg>`,
  "cheese-wheel": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="54" rx="16" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M12 48 L50 16 L50 44 Q50 48 46 48 Z" fill="#f4cf73" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12 48 L50 16 L50 23 L21 46 Z" fill="#e0a52b" opacity="0.55"/>
  <path d="M40 19 Q46 17 50 21 L50 16 Z" fill="#e0a52b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="34" cy="38" r="3.4" fill="#e0a52b" stroke="#2b2118" stroke-width="1.5"/>
  <circle cx="43" cy="42" r="2.3" fill="#e0a52b" stroke="#2b2118" stroke-width="1.5"/>
  <circle cx="41" cy="29" r="2" fill="#e0a52b" stroke="#2b2118" stroke-width="1.5"/>
  <circle cx="27" cy="44" r="1.8" fill="#e0a52b" stroke="#2b2118" stroke-width="1.5"/>
  <path d="M16 46 L45 21" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
</svg>`,
  "gold-bangle": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="15" ry="3" fill="#000000" opacity="0.12"/>
  <ellipse cx="32" cy="37" rx="19" ry="16" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <ellipse cx="32" cy="37" rx="11" ry="9" fill="#241a10" stroke="#2b2118" stroke-width="2"/>
  <ellipse cx="32" cy="37" rx="15" ry="12.5" fill="none" stroke="#f4cf73" stroke-width="1.5" opacity="0.6"/>
  <polygon points="32,15 36,21 32,27 28,21" fill="#3f6f9e" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="32,15 34,21 32,24 30,21" fill="#7ba6cf"/>
  <circle cx="17" cy="32" r="1.7" fill="#b23b2c" stroke="#2b2118" stroke-width="1.2"/>
  <circle cx="47" cy="32" r="1.7" fill="#3c7a5e" stroke="#2b2118" stroke-width="1.2"/>
  <path d="M20 28 A19 16 0 0 1 30 22" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "carved-mask": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="12" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M32 6 Q48 8 48 30 Q48 52 32 58 Q16 52 16 30 Q16 8 32 6 Z" fill="#6b4a2b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M32 6 Q42 7 45 19 Q34 16 32 23 Q30 16 19 19 Q22 7 32 6 Z" fill="#7e5a36"/>
  <path d="M20 24 Q26 21 31 24 M33 24 Q38 21 44 24" stroke="#2b2118" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M22 28 Q26 24 30 28 Q26 31 22 28 Z" fill="#2b2118"/>
  <path d="M34 28 Q38 24 42 28 Q38 31 34 28 Z" fill="#2b2118"/>
  <path d="M32 30 L29 40 Q32 42 35 40 Z" fill="#4a3219" stroke="#2b2118" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M26 46 Q32 50 38 46" stroke="#2b2118" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M32 10 L32 19" stroke="#b23b2c" stroke-width="2" stroke-linecap="round"/>
  <circle cx="24" cy="40" r="1.5" fill="#e0a52b"/>
  <circle cx="40" cy="40" r="1.5" fill="#e0a52b"/>
  <path d="M22 12 Q19 22 22 30" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
</svg>`,
  "fire-opal": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="14" ry="3" fill="#000000" opacity="0.12"/>
  <polygon points="22,18 42,18 50,30 32,40 14,30" fill="#e0722a" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="14,30 50,30 32,56" fill="#c4521d" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="22,18 32,28 14,30" fill="#f4a05a"/>
  <polygon points="42,18 32,28 50,30" fill="#cf6322"/>
  <polygon points="22,18 42,18 32,28" fill="#f4cf73" opacity="0.85"/>
  <line x1="14" y1="30" x2="32" y2="56" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="50" y1="30" x2="32" y2="56" stroke="#2b2118" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="28" x2="32" y2="56" stroke="#2b2118" stroke-width="1.5" opacity="0.55"/>
  <line x1="32" y1="28" x2="14" y2="30" stroke="#2b2118" stroke-width="1.5" opacity="0.55"/>
  <line x1="32" y1="28" x2="50" y2="30" stroke="#2b2118" stroke-width="1.5" opacity="0.55"/>
  <polygon points="24,20 30,26 22,28" fill="#f7f1e4" opacity="0.5"/>
</svg>`,
  "bronze-idol": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="19" y="49" width="26" height="7" rx="2" fill="#6b4a2b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M22 50 Q19 30 32 12 Q45 30 42 50 Z" fill="#c98a3a" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M24 14 Q32 3 40 14 Q32 18 24 14 Z" fill="#e0a52b" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="32" cy="19" r="8" fill="#e0a52b" stroke="#2b2118" stroke-width="2"/>
  <circle cx="29" cy="19" r="1.5" fill="#2b2118"/>
  <circle cx="35" cy="19" r="1.5" fill="#2b2118"/>
  <path d="M30 23 Q32 25 34 23" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M24 31 Q28 35 32 34 Q36 35 40 31" stroke="#2b2118" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
  <path d="M27 39 H37 M28 44 H36" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
  <path d="M26 27 Q24 37 26 47" stroke="#f4cf73" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`,
  "rune-stone": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M20 54 L18 21 Q18 10 32 8 Q46 10 46 21 L44 54 Z" fill="#8a97a3" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M24 51 L23 23 Q23 15 32 14 Q41 15 41 23 L40 51 Z" fill="#9aa6b2" opacity="0.55"/>
  <path d="M27 22 L27 31 M27 26 L31 22 M27 26 L31 31" stroke="#6fae86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M35 34 L35 43 M35 34 L39 38 L35 39" stroke="#6fae86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M28 46 H34 M31 42 L31 50" stroke="#6fae86" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M22 23 Q22 15 30 13" stroke="#f7f1e4" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
  <path d="M40 26 L42 33" stroke="#2b2118" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
</svg>`,
  "spice-pouch": `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="56" rx="14" ry="3" fill="#000000" opacity="0.12"/>
  <path d="M16 37 Q16 52 32 52 Q48 52 48 37 Q48 25 38 21 L26 21 Q16 25 16 37 Z" fill="#b5763a" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M17 35 Q32 41 47 35 Q48 45 40 49 Q32 53 24 49 Q16 45 17 35 Z" fill="#a8692f" opacity="0.5"/>
  <path d="M24 21 Q24 14 32 14 Q40 14 40 21 Q40 25 32 25 Q24 25 24 21 Z" fill="#a8692f" stroke="#2b2118" stroke-width="2" stroke-linejoin="round"/>
  <path d="M22 22 Q32 27 42 22" stroke="#4a3219" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M26 24 L25 30 M30 25 L30 31 M34 25 L34 31 M38 24 L39 30" stroke="#2b2118" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  <ellipse cx="32" cy="14" rx="5" ry="2.5" fill="#b23b2c" stroke="#2b2118" stroke-width="1.5"/>
  <circle cx="29" cy="12.5" r="1" fill="#e0722a"/>
  <circle cx="34" cy="12.5" r="1" fill="#e0722a"/>
  <path d="M22 33 Q20 43 26 49" stroke="#f4cf73" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4"/>
</svg>`,
};

const FALLBACK = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="55" rx="13" ry="3" fill="#000000" opacity="0.12"/>
  <rect x="16" y="16" width="32" height="32" rx="3" fill="#6b4a2b" stroke="#2b2118" stroke-width="2"/>
  <path d="M16 26 H48 M28 16 V26" stroke="#2b2118" stroke-width="2"/>
</svg>`;

export const ItemIcon = memo(function ItemIcon({ id, className }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[id] || FALLBACK }}
    />
  );
});
