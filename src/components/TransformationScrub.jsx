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

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 78%',
        end: 'bottom 30%',
        scrub: true,
        onUpdate: (self) => apply(gsap.utils.clamp(0, 1, self.progress)),
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
          <img src={goldBefore} alt="Raw 999.9 fine gold bar before it is shaped into a piece" className={styles.paneImg} />
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
