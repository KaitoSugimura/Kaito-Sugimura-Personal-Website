// Shared animation/sequence timings (milliseconds).
//
// Several of these mirror CSS animation durations in the corresponding
// *.module.css files. They are gathered here so the JS-to-CSS coupling is
// visible in one place: if you change a CSS duration noted below, update the
// matching constant here too.

// Time for the camera-UI title box to finish its expand (the `initiationTitle`
// animation, 4.5s, in CameraUI.module.css). The intro is marked done after this
// so the typed title + terminal arrive exactly as the box settles.
export const INTRO_TITLE_EXPAND_MS = 4500;

// Beat after `initDone` before swapping InitHero for the real terminal, so the
// HUD title gets to play its typewriter/caret animation first.
export const TERMINAL_REVEAL_DELAY_MS = 200;

// Total length of the Hero authentication intro animation, after which the user
// is marked authenticated and the intro DOM unmounts.
export const HERO_INTRO_DURATION_MS = 5200;

// Delay before a dialog actually opens after scrolling onto its section, giving
// the HUD time to unmount before the title flashes.
export const DIALOG_OPEN_DELAY_MS = 300;

// Cooldown between section changes so a single wheel/touch gesture advances one
// section at a time.
export const SECTION_SCROLL_COOLDOWN_MS = 300;
