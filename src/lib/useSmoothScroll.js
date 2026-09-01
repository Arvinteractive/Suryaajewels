import { useEffect } from 'react'
import { ScrollSmoother } from './gsap'
import { useReducedMotion } from './useReducedMotion'
import { useMediaQuery } from './useMediaQuery'
import { LITE_MOTION_QUERY } from './breakpoints'

// Lenis-style momentum/inertia scrolling, built on GSAP's own ScrollSmoother
// instead. Because every scrub/pin effect in this site already runs on
// ScrollTrigger, ScrollSmoother slots in as its native scroller with no
// manual scrollerProxy bridging — the thing Lenis would otherwise require to
// avoid desyncing those effects.
//
// Desktop only. ScrollSmoother (and `normalizeScroll` especially) replaces
// native scrolling with a JS transform driven off touch events, so on a phone
// every finger movement becomes main-thread work and loses the browser's own
// off-thread scrolling — the single biggest cause of mobile scroll jank here.
// Touch devices keep native scroll and just get anchor smoothing.
export function useSmoothScroll() {
  const reduced = useReducedMotion()
  const lite = useMediaQuery(LITE_MOTION_QUERY)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const smoother =
      reduced || lite
        ? null
        : ScrollSmoother.create({
            // Pinned explicitly: the default content fallback is
            // body.children[0], which after StrictMode's
            // mount->unmount->remount cycle resolves to the leftover
            // .ScrollSmoother-wrapper div instead of #root, breaking the
            // body-height calculation (page becomes unscrollable).
            content: '#root',
            smooth: 1.2,
            normalizeScroll: true,
            ignoreMobileResize: true,
          })

    const onClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()

      if (smoother) {
        smoother.scrollTo(target, true, 'top top')
      } else {
        // Native scrolling path: the browser animates this off the main
        // thread, and honours prefers-reduced-motion on its own.
        target.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        })
      }

      history.pushState(null, '', hash)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      smoother?.kill()
    }
  }, [reduced, lite])
}
