import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Gallery.module.css'
import { galleryImages } from '../config'

export default function Gallery() {
  const rowRef = useRef(null)
  const [pages, setPages] = useState(1)
  const [active, setActive] = useState(0)

  // Pages are derived from the scroller's own geometry rather than a hard-coded
  // count, because how many cards fit changes at every breakpoint.
  const measure = useCallback(() => {
    const el = rowRef.current
    if (!el || el.clientWidth === 0) return

    // One dot per screenful, not per photo — ten dots for ten images reads as
    // noise and says nothing useful about where you are.
    const count = Math.max(1, Math.round(el.scrollWidth / el.clientWidth))
    const maxScroll = el.scrollWidth - el.clientWidth

    setPages(count)
    setActive(
      maxScroll > 0 && count > 1 ? Math.round((el.scrollLeft / maxScroll) * (count - 1)) : 0,
    )
  }, [])

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    measure()

    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        measure()
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [measure])

  // Both the arrows and the dots move in whole pages, so the two controls can
  // never disagree about which slide you are on.
  const goToPage = useCallback(
    (index) => {
      const el = rowRef.current
      if (!el) return
      const target = Math.min(Math.max(index, 0), pages - 1)
      const maxScroll = el.scrollWidth - el.clientWidth
      el.scrollTo({
        left: pages > 1 ? (maxScroll * target) / (pages - 1) : 0,
        behavior: 'smooth',
      })
    },
    [pages],
  )

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>From the Workshop</h2>

      <div ref={rowRef} className={`${styles.row} scrollbar-hide`}>
        {galleryImages.map((item, i) => (
          <div className={styles.card} key={i}>
            <img
              src={item.src}
              alt={item.alt}
              width={1792}
              height={2400}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Previous images"
          onClick={() => goToPage(active - 1)}
          disabled={active === 0}
        >
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className={styles.dots}>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              aria-label={`Go to slide ${i + 1} of ${pages}`}
              aria-current={i === active}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.arrow}
          aria-label="Next images"
          onClick={() => goToPage(active + 1)}
          disabled={active >= pages - 1}
        >
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
