import { useEffect } from 'react'
import { ScrollSmoother } from './gsap'
import { useReducedMotion } from './useReducedMotion'

// Lenis-style momentum/inertia scrolling, built on GSAP's own ScrollSmoother
// instead. Because every scrub/pin effect in this site already runs on
// ScrollTrigger, ScrollSmoother slots in as its native scroller with no
// manual scrollerProxy bridging — the thing Lenis would otherwise require to
// avoid desyncing those effects.
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined' || reduced) return

    const smoother = ScrollSmoother.create({
      // Pinned explicitly: the default content fallback is body.children[0],
      // which after StrictMode's mount->unmount->remount cycle resolves to
      // the leftover .ScrollSmoother-wrapper div instead of #root, breaking
      // the body-height calculation (page becomes unscrollable).
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
      smoother.scrollTo(target, true, 'top top')
      history.pushState(null, '', hash)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      smoother.kill()
    }
  }, [reduced])
}
