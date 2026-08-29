import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)

  // Only trust a refresh when the viewport has real dimensions — a
  // backgrounded/inactive tab can briefly report a 0x0 layout, and
  // recalculating trigger positions against that would poison them.
  const safeRefresh = () => {
    if (window.innerWidth > 0 && window.innerHeight > 0) ScrollTrigger.refresh()
  }

  // Web fonts (Cormorant Garamond / Jost) swap in after first paint and
  // reflow text, which shifts every trigger position ScrollTrigger already
  // cached — recompute once they're actually loaded, once more after full
  // page load for any late image-driven shifts, and again whenever the tab
  // regains visibility in case it loaded while backgrounded.
  document.fonts?.ready.then(safeRefresh)
  window.addEventListener('load', safeRefresh)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') safeRefresh()
  })
}

export { gsap, ScrollTrigger }
