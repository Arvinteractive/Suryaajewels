// Single source of truth for the two breakpoints the JS side cares about.
// Keep these in sync with the matching @media rules in the CSS modules.

// Below this the nav collapses into the hamburger — covers phones and
// tablets, which is where the full horizontal link row stops fitting.
export const NAV_BREAKPOINT = 1024

export const MOBILE_QUERY = `(max-width: ${NAV_BREAKPOINT}px)`

// "Lite motion" devices: touch hardware, or any viewport small enough to be
// one. JS-driven smooth scrolling and per-frame scrub effects are priced for
// a desktop compositor; on a phone they turn every scroll into main-thread
// work and the polish isn't worth the dropped frames. Components branch on
// this to fall back to native scrolling and static (not scrubbed) visuals.
export const LITE_MOTION_QUERY = `(pointer: coarse), ${MOBILE_QUERY}`
