import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'
import styles from './TransformationScrub.module.css'
import { transformation } from '../config'
import goldBefore from '../assets/gold-before.png'
import goldAfter from '../assets/gold-after.png'

// Before/after wipe driven entirely by scroll progress: the "after" pane
// clips open from the left and a handle rides the seam, so the sketch
// scrubs into the finished piece as you move through the section.
export default function TransformationScrub() {
  const rootRef = useRef(null)
  const afterRef = useRef(null)
  const handleRef = useRef(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const root = rootRef.current
      const after = afterRef.current
      const handle = handleRef.current
      if (!root || !after || !handle) return

      const apply = (reveal) => {
        after.style.clipPath = `inset(0 ${100 - reveal * 100}% 0 0)`
        handle.style.left = `${reveal * 100}%`
      }

      if (reduced) {
        apply(0.5)
        return
      }

      // The wipe is one-way: it only ever opens further, so stopping mid-way
      // and scrolling back up leaves it where it got to instead of unwinding.
      let peak = 0
      const commit = (reveal) => {
        peak = reveal
        apply(peak)
      }

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 78%',
        end: 'bottom 30%',
        scrub: true,
        // A refresh re-measures the section once fonts and images settle, so
        // anything latched before it was read against stale geometry — rebase
        // down to the truth rather than keeping a reveal the page was never
        // actually scrolled to. Once fully open it stays open.
        onRefresh: (self) => {
          const reveal = gsap.utils.clamp(0, 1, self.progress)
          if (peak < 1 && reveal < peak) commit(reveal)
        },
        onUpdate: (self) => {
          const reveal = gsap.utils.clamp(0, 1, self.progress)
          if (reveal > peak) commit(reveal)
        },
      })

      return () => trigger.kill()
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  return (
    <section className={styles.section}>
      <div className={styles.eyebrow}>From Sketch to Setting</div>
      <div ref={rootRef} className={styles.stage}>
        <div className={styles.pane}>
          <img
            src={goldBefore}
            alt="Raw 999.9 fine gold bar before it is shaped into a piece"
            className={styles.paneImg}
            width={1846}
            height={852}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} />
          <span className={styles.label}>{transformation.beforeLabel}</span>
        </div>

        <div
          ref={afterRef}
          className={styles.paneAfter}
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          <img
            src={goldAfter}
            alt="Finished 22K gold bracelet, the completed heirloom piece"
            className={`${styles.paneImg} ${styles.paneImgAfter}`}
            width={1844}
            height={853}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} />
          <span className={styles.labelAfter}>{transformation.afterLabel}</span>
        </div>

        <div ref={handleRef} className={styles.handle} style={{ left: '0%' }}>
          <div className={styles.handleKnob} />
        </div>
      </div>
    </section>
  )
}
