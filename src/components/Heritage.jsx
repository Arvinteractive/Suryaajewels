import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'
import styles from './Heritage.module.css'
import Reveal from './Reveal'
import ReadingHighlight from './ReadingHighlight'
import foregroundOverlay from '../assets/foreground-overlay.png'

export default function Heritage() {
  const stageRef = useRef(null)
  const overlayRef = useRef(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => gsap.set(overlayRef.current, { yPercent: (self.progress - 0.5) * 30 }),
      })
      return () => trigger.kill()
    },
    { scope: stageRef, dependencies: [reduced] },
  )

  return (
    <section id="heritage" className={styles.section}>
      <Reveal as="div" className={styles.imageWrap}>
        <div ref={stageRef} className={styles.stage}>
          <img
            className={styles.baseImg}
            src="/images/about-heritage.jpg"
            alt="Master goldsmith hand-soldering a 22K gold jewelry piece at the Coimbatore workbench"
          />
          <div ref={overlayRef} className={styles.overlay}>
            <img className={styles.overlayImg} src={foregroundOverlay} alt="" aria-hidden="true" />
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
