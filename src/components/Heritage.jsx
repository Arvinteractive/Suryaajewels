import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useMediaQuery } from '../lib/useMediaQuery'
import { LITE_MOTION_QUERY } from '../lib/breakpoints'
import styles from './Heritage.module.css'
import Reveal from './Reveal'
import ReadingHighlight from './ReadingHighlight'
import foregroundOverlay from '../assets/foreground-overlay.png'

export default function Heritage() {
  const stageRef = useRef(null)
  const overlayRef = useRef(null)
  const reduced = useReducedMotion()
  const lite = useMediaQuery(LITE_MOTION_QUERY)

  useGSAP(
    () => {
      // The overlay is a large mix-blend-mode: screen layer. Moving it on
      // scroll forces the compositor to re-blend it every frame; on mobile
      // that alone can eat the frame budget, so it stays parked there and the
      // section renders as a flat composite the browser can cache.
      if (reduced || lite) return
      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => gsap.set(overlayRef.current, { yPercent: (self.progress - 0.5) * 30 }),
      })
      return () => trigger.kill()
    },
    { scope: stageRef, dependencies: [reduced, lite] },
  )

  return (
    <section id="heritage" className={styles.section}>
      <Reveal as="div" className={styles.imageWrap}>
        <div ref={stageRef} className={styles.stage}>
          <img
            className={styles.baseImg}
            src="/images/about-heritage.jpg"
            alt="Master goldsmith hand-soldering a 22K gold jewelry piece at the Coimbatore workbench"
            width={1792}
            height={2400}
            loading="lazy"
            decoding="async"
          />
          <div ref={overlayRef} className={styles.overlay}>
            <img
              className={styles.overlayImg}
              src={foregroundOverlay}
              alt=""
              aria-hidden="true"
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Reveal>
      <div className={styles.text}>
        <Reveal as="div" delay={100} className={styles.eyebrow}>
          Our Heritage
        </Reveal>
        <Reveal as="h2" delay={160} className={styles.heading}>
          Three Generations at the Bench
        </Reveal>
        <ReadingHighlight
          text="We still work exactly the way our grandfather did. It takes time, patience, and hands that know how to coax raw metal into an heirloom. Small batches keep the craft honest."
          className={styles.body}
        />
      </div>
    </section>
  )
}
