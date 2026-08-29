import { useEffect, useRef, useState } from 'react'
import styles from './Gallery.module.css'
import { galleryImages } from '../config'

export default function Gallery() {
  const rowRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const el = rowRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }

  useEffect(() => {
    updateEdges()
    const el = rowRef.current
    if (!el) return
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
  }, [])

  const scrollGallery = (dir) => {
    const el = rowRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>From the Workshop</h2>
      <div className={styles.wrap}>
        <div ref={rowRef} className={`${styles.row} scrollbar-hide`}>
          {galleryImages.map((item, i) => (
            <div className={styles.card} key={i}>
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </div>
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label="Scroll left"
          onClick={() => scrollGallery(-1)}
          disabled={atStart}
        >
          &#8249;
        </button>
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label="Scroll right"
          onClick={() => scrollGallery(1)}
          disabled={atEnd}
        >
          &#8250;
        </button>
      </div>
    </section>
  )
}
