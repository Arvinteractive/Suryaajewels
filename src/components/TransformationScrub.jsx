import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'
import styles from './TransformationScrub.module.css'
import { transformation } from '../config'

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
          <span className={styles.label}>{transformation.beforeLabel}</span>
          <span className={styles.word}>{transformation.beforeWord}</span>
        </div>

        <div
          ref={afterRef}
          className={styles.paneAfter}
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          <span className={styles.labelAfter}>{transformation.afterLabel}</span>
          <span className={styles.wordAfter}>{transformation.afterWord}</span>
        </div>

        <div ref={handleRef} className={styles.handle} style={{ left: '0%' }}>
          <div className={styles.handleKnob} />
        </div>
      </div>
    </section>
  )
}
