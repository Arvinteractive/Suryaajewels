import { useEffect, useLayoutEffect, useRef } from 'react'
import styles from './Gallery.module.css'
import '../lib/editorialCarousel'
import { galleryImages } from '../config'
import { useT } from '../i18n/context'
import { ScrollSmoother, ScrollTrigger } from '../lib/gsap'

export default function Gallery() {
  const t = useT()
  const carouselRef = useRef(null)
  const sectionRef = useRef(null)

  // Resolve the fragment after fonts and the scrolling layer settle. Stop
  // repositioning as soon as the visitor starts interacting with the page.
  useEffect(() => {
    if (window.location.hash !== '#workshop') return
    let cancelled = false
    let frame = 0
    let followupFrame = 0
    const align = () => {
      if (cancelled) return
      cancelAnimationFrame(frame)
      cancelAnimationFrame(followupFrame)
      frame = requestAnimationFrame(() => {
        followupFrame = requestAnimationFrame(() => {
          const section = sectionRef.current
          if (cancelled || !section || window.location.hash !== '#workshop') return
          ScrollTrigger.refresh()
          const smoother = ScrollSmoother.get()
          if (smoother) smoother.scrollTo(section, false, 'top 80px')
          else section.scrollIntoView({ behavior: 'auto', block: 'start' })
        })
      })
    }
    const stop = () => { cancelled = true }
    ;(document.fonts?.ready ?? Promise.resolve()).then(align)
    window.addEventListener('load', align, { once: true })
    window.addEventListener('wheel', stop, { passive: true, once: true })
    window.addEventListener('pointerdown', stop, { passive: true, once: true })
    window.addEventListener('keydown', stop, { once: true })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      cancelAnimationFrame(followupFrame)
      window.removeEventListener('load', align)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [])

  // React owns the authored photographs; the custom element owns its motion
  // and controls. Labels are refreshed after translated children commit.
  useLayoutEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    carousel.labels = {
      ...t.gallery.carousel,
      previous: t.gallery.prev,
      next: t.gallery.next,
      slide: t.gallery.slide,
    }
  }, [t.gallery])

  return (
    <section ref={sectionRef} className={styles.section} id="workshop" aria-labelledby="workshop-heading">
      <div className={styles.inner}>
        <header className={styles.intro}>
          <h2 className={styles.heading} id="workshop-heading">{t.gallery.heading}</h2>
        </header>
        <c-carousel
          ref={carouselRef}
          className={styles.carousel}
          aria-label={t.gallery.heading}
          interval="5000"
        >
          <p className="carousel-sr-only" data-instructions="">{t.gallery.carousel.instructions}</p>
          <div className="carousel-viewport" tabIndex={0} role="group" aria-label={t.gallery.carousel.viewport}>
            <div className="carousel-track">
              {galleryImages.map((src, index) => (
                <article className={`slide ${styles.card}`} data-slide="" key={src}>
                  <div className={`slide-copy ${styles.copy}`}>
                    <h3 className={styles.title}>{t.gallery.titles[index]}</h3>
                  </div>
                  <figure className={`workshop-photo ${styles.photo}`}>
                    <img
                      src={src}
                      alt={t.gallery.alts[index]}
                      width={1792}
                      height={2400}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                    />
                  </figure>
                </article>
              ))}
            </div>
          </div>
        </c-carousel>
      </div>
    </section>
  )
}
