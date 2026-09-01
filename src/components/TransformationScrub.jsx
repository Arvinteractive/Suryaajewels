import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './TransformationScrub.module.css'
import { useT } from '../i18n/context'
import goldBefore from '../assets/gold-before.png'
import goldAfter from '../assets/gold-after.png'

// Parked just inside the left edge: far enough in that the knob sits wholly
// within the frame rather than straddling the border — it is the one control
// in this section, so it should not open half cut off — and early enough that
// the strip it uncovers is still empty backdrop. The reveal stays entirely the
// visitor's to make.
//
// Bounded on both sides, so do not raise it blind. The knob needs ~5.5% to
// clear the frame at the narrowest phone width, and the bracelet's leftmost
// pixel sits at 9.4% of gold-after.png — past that, the piece starts showing
// before anyone has touched anything. Re-measure both if the art changes.
const INITIAL_REVEAL = 0.08

const KEY_STEP = 0.05

// Before/after comparison worked entirely by hand: the "after" pane clips open
// from the left and a handle rides the seam, so dragging the handle across
// turns the raw bar into the finished piece. Deliberately not scroll-driven —
// scrolling past used to spend the reveal for you, whether you were looking or
// not, and left nothing to do once you got here.
export default function TransformationScrub() {
  const t = useT()
  const rootRef = useRef(null)
  const afterRef = useRef(null)
  const handleRef = useRef(null)

  const revealRef = useRef(INITIAL_REVEAL)
  const draggingRef = useRef(false)
  // Cached on pointerdown: the stage cannot move mid-drag, so re-measuring it
  // on every pointermove would be a layout read per sample for no new answer.
  const rectRef = useRef(null)

  const [touched, setTouched] = useState(false)

  const apply = useCallback((reveal) => {
    const after = afterRef.current
    const handle = handleRef.current
    if (!after || !handle) return
    revealRef.current = reveal
    after.style.clipPath = `inset(0 ${100 - reveal * 100}% 0 0)`
    handle.style.left = `${reveal * 100}%`
    handle.setAttribute('aria-valuenow', String(Math.round(reveal * 100)))
  }, [])

  useEffect(() => {
    apply(INITIAL_REVEAL)
  }, [apply])

  const revealAt = useCallback((clientX) => {
    const rect = rectRef.current
    if (!rect || rect.width === 0) return 0
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      const root = rootRef.current
      if (!root) return
      draggingRef.current = true
      rectRef.current = root.getBoundingClientRect()
      e.currentTarget.setPointerCapture(e.pointerId)
      setTouched(true)
      apply(revealAt(e.clientX))
    },
    [apply, revealAt],
  )

  const onPointerMove = useCallback(
    (e) => {
      if (!draggingRef.current) return
      apply(revealAt(e.clientX))
    },
    [apply, revealAt],
  )

  const onPointerUp = useCallback((e) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }, [])

  const onKeyDown = useCallback(
    (e) => {
      const step =
        e.key === 'ArrowLeft'
          ? -KEY_STEP
          : e.key === 'ArrowRight'
            ? KEY_STEP
            : e.key === 'Home'
              ? -1
              : e.key === 'End'
                ? 1
                : 0
      if (!step) return
      e.preventDefault()
      setTouched(true)
      apply(Math.min(Math.max(revealRef.current + step, 0), 1))
    },
    [apply],
  )

  return (
    <section className={styles.section}>
      <div className={styles.eyebrow}>{t.transformation.eyebrow}</div>

      <div ref={rootRef} className={`${styles.stage} ${touched ? styles.stageTouched : ''}`}>
        <div className={styles.pane}>
          <img
            src={goldBefore}
            alt={t.transformation.beforeAlt}
            className={styles.paneImg}
            width={1846}
            height={852}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} />
          <span className={styles.label}>{t.transformation.beforeLabel}</span>
        </div>

        <div
          ref={afterRef}
          className={styles.paneAfter}
          style={{ clipPath: `inset(0 ${100 - INITIAL_REVEAL * 100}% 0 0)` }}
        >
          <img
            src={goldAfter}
            alt={t.transformation.afterAlt}
            className={`${styles.paneImg} ${styles.paneImgAfter}`}
            width={1844}
            height={853}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.scrim} />
          <span className={styles.labelAfter}>{t.transformation.afterLabel}</span>
        </div>

        <div
          ref={handleRef}
          className={styles.handle}
          style={{ left: `${INITIAL_REVEAL * 100}%` }}
          role="slider"
          tabIndex={0}
          aria-label={t.transformation.handleAria}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(INITIAL_REVEAL * 100)}
          aria-orientation="horizontal"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        >
          <div className={styles.handleKnob}>
            <span className={styles.handleArrow} aria-hidden="true">
              ‹
            </span>
            <span className={styles.handleArrow} aria-hidden="true">
              ›
            </span>
          </div>
        </div>
      </div>

      {/* Nothing happens here until someone drags, so the invitation has to be
          explicit. It retires the moment the handle is first moved. */}
      <p className={`${styles.prompt} ${touched ? styles.promptDone : ''}`}>
        {t.transformation.prompt}
      </p>
    </section>
  )
}
