import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useMediaQuery } from '../lib/useMediaQuery'
import { LITE_MOTION_QUERY } from '../lib/breakpoints'
import Reveal from './Reveal'
import styles from './CraftsmanshipStory.module.css'

const BEATS = ['Drawn by hand.', 'Cast in fire.', 'Set by eye.']

// One cinematic frame rather than Process's numbered grid: the photo fades
// and rises into place (Reveal's own proven mechanic, not a bespoke clip-path
// gate — a mask wipe would have hidden the text along with the image behind
// a single observer, so the whole section stays invisible if that one
// observer is ever late or missed) then drifts a few percent on scroll.
export default function CraftsmanshipStory() {
  const gsapScopeRef = useRef(null)
  const [inViewRef, inView] = useInView()
  const imageRef = useRef(null)
  const reduced = useReducedMotion()
  const lite = useMediaQuery(LITE_MOTION_QUERY)

  const setMaskRef = (node) => {
    gsapScopeRef.current = node
    inViewRef.current = node
  }

  useGSAP(
    () => {
      if (reduced || lite) return
      const trigger = ScrollTrigger.create({
        trigger: gsapScopeRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => gsap.set(imageRef.current, { yPercent: (self.progress - 0.5) * 10 }),
      })
      return () => trigger.kill()
    },
    { scope: gsapScopeRef, dependencies: [reduced, lite] },
  )

  return (
    <section className={styles.section}>
      <div ref={setMaskRef} className={`${styles.mask} ${inView ? styles.visible : ''}`}>
        <img
          ref={imageRef}
          src="/images/about-heritage.webp"
          alt="Master goldsmith hand-soldering a 22K gold jewelry piece at the Coimbatore workbench"
          className={styles.image}
          width={1792}
          height={2400}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.scrim} />

        <div className={styles.content}>
          <Reveal as="div" delay={100} className={styles.eyebrow}>
            Craftsmanship
          </Reveal>
          <Reveal as="h2" delay={180} className={styles.heading}>
            Made By Hand, Still.
          </Reveal>
          <ul className={styles.beats}>
            {BEATS.map((beat, i) => (
              <Reveal as="li" key={beat} delay={260 + i * 120} className={styles.beat}>
                {beat}
              </Reveal>
            ))}
          </ul>
          <Reveal as="p" delay={660} className={styles.closing}>
            Three generations at one bench. Nothing rushed. Nothing leaves unfinished.
          </Reveal>
        </div>
      </div>
    </section>
  )
}
