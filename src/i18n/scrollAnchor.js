import { ScrollSmoother, ScrollTrigger } from '../lib/gsap'

// Keeping the reader in place across a language change.
//
// Tamil runs this page roughly 700px longer than English and Hindi about
// 130px longer, and that extra height is distributed through the copy — so
// every block below the one you are reading moves, and so does every block
// above it. Left alone, switching language slides the page under you by
// ~120px: the paragraph you were mid-way through is no longer where you were
// looking.
//
// The fix is to measure against a landmark rather than against a scroll
// offset. Before the swap we note which block sits nearest the top of the
// viewport and exactly how far from that edge it is; after the new copy is
// laid out we put that same block back at that same distance. Whatever the
// page did above it is absorbed by the correction.

// Candidates are block-level things React updates in place rather than
// remounts, so a node captured before the swap is still the same node after.
// Deliberately excludes the per-word spans in ReadingHighlight: those are
// keyed by index and the word count differs per language, so the tail of that
// list genuinely is replaced.
const ANCHOR_SELECTOR = [
  'section',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'address',
  'li',
  '[class*="item"]',
  '[class*="step"]',
  '[class*="card"]',
  '[class*="field"]',
  '[class*="tileCell"]',
  '[class*="brandCol"]',
].join(',')

// Below this there is nothing above the fold to preserve — the page is at its
// natural top and should stay pinned there rather than being nudged.
const TOP_DEAD_ZONE = 4

// Two candidates whose top edges are within this many pixels of each other
// count as equally good, and the tie is settled on depth instead.
const TIE_TOLERANCE = 24

function ancestorCount(el) {
  let n = 0
  for (let p = el.parentElement; p; p = p.parentElement) n++
  return n
}

function currentScroll() {
  const smoother = ScrollSmoother.get?.()
  return smoother ? smoother.scrollTop() : window.scrollY
}

function scrollBy(delta) {
  const smoother = ScrollSmoother.get?.()
  // ScrollSmoother owns the scroll position on desktop; writing through
  // window.scrollTo there would be overridden on its next tick. Setting
  // scrollTop is an immediate jump, not a smoothed glide, which is what we
  // want — this correction must be invisible, not animated.
  if (smoother) smoother.scrollTop(smoother.scrollTop() + delta)
  else window.scrollBy(0, delta)
}

// Records the block nearest the top edge of the viewport, and its offset from
// that edge. Call immediately before the new language is committed.
export function captureScrollAnchor() {
  if (typeof window === 'undefined') return null
  const root = document.getElementById('root')
  if (!root || currentScroll() <= TOP_DEAD_ZONE) return null

  const viewportH = window.innerHeight
  let best = null

  for (const el of root.querySelectorAll(ANCHOR_SELECTOR)) {
    const rect = el.getBoundingClientRect()
    if (rect.height === 0) continue
    if (rect.bottom < 0 || rect.top > viewportH) continue

    // The block whose top edge is closest to the top of the viewport is the
    // one the reader is anchored on, whether it starts just above or just
    // below the fold.
    const distance = Math.abs(rect.top)
    const depth = ancestorCount(el)

    // A section and the paragraph that opens it share a top edge, and pinning
    // the section is much weaker: its own copy reflows underneath the pin, so
    // everything the reader can actually see still slides. Among equally close
    // candidates take the deepest — the real text block, not its container.
    const better =
      !best ||
      distance < best.distance - TIE_TOLERANCE ||
      (distance < best.distance + TIE_TOLERANCE && depth > best.depth)

    if (better) best = { el, top: rect.top, distance, depth }
  }

  return best ? { el: best.el, top: best.top } : null
}

// Puts the recorded block back where it was. Must run before the browser
// paints, so the correction is never seen as a jump.
export function restoreScrollAnchor(anchor) {
  if (!anchor || !anchor.el.isConnected) return 0

  // Section heights have all changed, so every cached trigger position is
  // stale. Refreshing first means the scrub effects and the correction below
  // agree about where things are.
  ScrollTrigger.refresh()

  const delta = anchor.el.getBoundingClientRect().top - anchor.top
  if (Math.abs(delta) < 0.5) return 0

  scrollBy(delta)
  return delta
}
