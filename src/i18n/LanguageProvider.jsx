import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DICTS, LanguageContext, STORAGE_KEY } from './context'
import { ensureLangFont } from './fonts'
import { captureScrollAnchor, restoreScrollAnchor } from './scrollAnchor'

// Two halves of one cross-fade: the old copy leaves, the new copy arrives a
// little more slowly than it left. Both are driven by the [data-lang-swap]
// rules in index.css, so the only thing animated is opacity on the text
// itself — no layout, no per-node JS, one composited pass.
//
// A typewriter effect was the alternative. It reads well on one headline and
// badly on a whole page: ~90 strings would each need a per-character timer,
// and every tick rewrites a text node, so the browser re-lays-out the section
// on every frame of the effect. The fade costs one style recalc.
const OUT_MS = 220
const IN_MS = 460
// Ceiling on how long the "out" state waits for a webfont. Past this the swap
// proceeds and `display: swap` handles the late arrival — a stalled font CDN
// must never leave the page sitting blank.
const FONT_BUDGET_MS = 600

function readInitialLang() {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && DICTS[saved]) return saved
  } catch {
    // Private mode / storage disabled — fall through to the browser's own
    // preference rather than failing to render.
  }
  const preferred = window.navigator?.languages ?? [window.navigator?.language]
  for (const tag of preferred) {
    const base = String(tag || '').toLowerCase().split('-')[0]
    if (DICTS[base]) return base
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)
  const [swapping, setSwapping] = useState(false)
  const timers = useRef([])
  // Both of these exist so setLang can be created once and never go stale:
  // it reads the live language and the live swap state synchronously instead
  // of closing over a particular render's values.
  const swappingRef = useRef(false)
  const langRef = useRef(lang)
  // Set by the swap once the new language is committed, read by the layout
  // effect below — the handoff that keeps the fade-in on the *new* copy.
  const pendingFadeIn = useRef(false)
  // The block the reader was looking at, measured just before the commit and
  // put back in place just after it.
  const anchor = useRef(null)

  const release = useCallback(() => {
    delete document.documentElement.dataset.langSwap
    swappingRef.current = false
    setSwapping(false)
  }, [])

  // Everything here changes how the page *lays out*, so it has to land in the
  // very same frame as the new text — hence useLayoutEffect, which React runs
  // synchronously after it mutates the DOM and before the browser paints.
  //
  // As a passive useEffect this ran after paint, and the swap visibly broke in
  // two ways: `data-lang` (which carries the per-script size, tracking and
  // font stack) arrived a frame late, so Tamil briefly painted at English's
  // metrics and then jumped; and `data-lang-swap="in"` was written straight
  // from the promise callback, before React had re-rendered, so the fade-in
  // started on the *old* copy and flashed the outgoing language back up before
  // replacing it. Driving both from here means text, metrics and fade state
  // are always one atomic step.
  useLayoutEffect(() => {
    langRef.current = lang

    const root = document.documentElement
    root.lang = DICTS[lang].htmlLang
    root.dataset.lang = lang

    // Correcting scroll here rather than in a passive effect is the whole
    // point: by the time a passive effect runs the browser has already painted
    // the page at its new height, so the reader would see it slide and then
    // snap back. This lands in the same pre-paint step as the text itself.
    restoreScrollAnchor(anchor.current)
    anchor.current = null

    if (!pendingFadeIn.current) return
    pendingFadeIn.current = false
    root.dataset.langSwap = 'in'
    timers.current.push(setTimeout(release, IN_MS))
  }, [lang, release])

  // Nothing below affects layout, so it can wait until after the paint.
  useEffect(() => {
    document.title = DICTS[lang].meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', DICTS[lang].meta.description)

    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Persisting is a convenience, not a requirement.
    }
  }, [lang])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const setLang = useCallback((next) => {
    if (!DICTS[next] || next === langRef.current) return

    // The mid-swap guard has to be a ref, not the `swapping` state. State is
    // read from the render closure, so two clicks landing before React has
    // re-rendered would both see `false`, both start a swap, and the second
    // one's cleanup would cancel the first one's release timer — leaving the
    // switch disabled for good. A ref is written and read synchronously, so
    // the second click can never get past this line.
    if (swappingRef.current) return

    const root = document.documentElement
    const fontReady = ensureLangFont(next)

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      anchor.current = captureScrollAnchor()
      setLangState(next)
      return
    }

    swappingRef.current = true
    setSwapping(true)
    root.dataset.langSwap = 'out'

    // Hold the faded-out state until the new script can actually paint, but
    // never past the budget.
    const held = Promise.race([
      fontReady,
      new Promise((resolve) => setTimeout(resolve, FONT_BUDGET_MS)),
    ])
    const elapsed = new Promise((resolve) => setTimeout(resolve, OUT_MS))

    Promise.all([held, elapsed])
      .then(() => {
        // Only arms the handoff. Starting the fade-in here would run it against
        // whatever is still on screen — which, until React re-renders, is the
        // language we are leaving. The layout effect starts it instead, in the
        // same frame the new copy and its metrics appear.
        pendingFadeIn.current = true
        // Measured now, while the outgoing copy is still laid out — this is the
        // last moment the old geometry exists.
        anchor.current = captureScrollAnchor()
        setLangState(next)
      })
      // Nothing above is expected to reject, but the switch must never be
      // left permanently disabled if something does.
      .catch(() => {
        pendingFadeIn.current = false
        anchor.current = null
        release()
      })
  }, [release])

  const value = useMemo(
    () => ({ lang, setLang, swapping, t: DICTS[lang] }),
    [lang, setLang, swapping],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
