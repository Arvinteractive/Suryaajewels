import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  motionValue,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Dollars.module.css'
import { dollarImages } from '../config'
import { useT } from '../i18n/context'
import { useReducedMotion } from '../lib/useReducedMotion'
import { createSwing, driveFrom, jitter, stepSwing } from '../lib/pendulum'

const COUNT = dollarImages.length
const LAST = COUNT - 1

// How many pendants either side of the current one stay in the DOM. Nine
// decoded 1100px cut-outs is already tens of megabytes on a phone, and the
// tenth is off the end of the widest rail anyone will see — the window shifts
// by one as the rail passes a whole slot, which is a React render per slide,
// not per frame.
const WINDOW = 4

const THROW_SECONDS = 0.26 // how far a flick is projected before it snaps
const MAX_THROW = 6 // ...capped, so one hard flick can't cross the whole rail

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

// One angle per pendant, written by the integrator and read straight into a
// transform — never through React state, so a swing costs no renders. Module
// scope because there is exactly one rail on the page and these outlive the
// windowing: a piece that scrolls out of the window and back comes back still
// swinging, the way it would if it had been hanging there all along.
const angles = dollarImages.map(() => motionValue(0))

function Pendant({ index, pos, angle, onPick, reduced, label, pickLabel }) {
  const item = dollarImages[index]

  const distance = useTransform(pos, (p) => index - p)
  // Expressed as a percentage of the hanger's own width, which *is* one slot,
  // rather than in pixels: a resize then only has to rewrite the `--slot`
  // custom property and every position re-resolves on its own, with no stale
  // pixel maths waiting for the next pointer move to correct itself.
  const x = useTransform(distance, (d) => `${d * 100}%`)
  // The centred piece is at full size and full brightness; its neighbours fall
  // away fast enough that there is never a question of which one is being
  // looked at, but not so fast that the rail turns into a spotlight.
  const scale = useTransform(distance, (d) => 0.62 + 0.38 * clamp(1 - Math.abs(d) / 1.5, 0, 1))
  const opacity = useTransform(distance, (d) => clamp(1.12 - Math.abs(d) * 0.46, 0.16, 1))

  const drop = 18 + Math.round(jitter(index, 27.611) * 54)
  const sway = 5.5 + jitter(index, 61.17) * 3.5

  return (
    <motion.div className={styles.hanger} style={{ x }}>
      <div
        className={styles.sway}
        style={{ animationDuration: `${sway}s`, animationDelay: `-${(index % 7) * 0.9}s` }}
      >
        <motion.div
          className={styles.pendulum}
          style={{ rotate: angle }}
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={
            reduced
              ? { duration: 0.2 }
              : {
                  type: 'spring',
                  stiffness: 130,
                  damping: 13,
                  delay: 0.1 + Math.min(Math.abs(index - Math.round(pos.get())), 5) * 0.055,
                }
          }
        >
          <span className={styles.thread} style={{ height: `${drop}px` }} aria-hidden="true" />
          <motion.img
            className={styles.piece}
            style={{ scale, opacity }}
            src={item.src}
            width={item.width}
            height={item.height}
            alt={label}
            decoding="async"
            draggable="false"
            onClick={() => onPick(index)}
            title={pickLabel}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function DollarsRail() {
  const t = useT()
  const reduced = useReducedMotion()
  const stageRef = useRef(null)
  const [active, setActive] = useState(0)
  const [slot, setSlot] = useState(220)

  // Rail position, in slots. Driven straight from the pointer so the rail
  // tracks the finger 1:1 — nothing about the movement is smoothed, because
  // the whole illusion rests on the rail being rigid and the pendants being
  // the only thing with give in them.
  const pos = useMotionValue(0)
  const progress = useTransform(pos, (v) => clamp(v / LAST, 0, 1))

  // The oscillator state for all twenty-three, integrated in one frame
  // callback. A ref, not a memo: it is mutated in place sixty times a second
  // and must never be handed back to React's reconciler. The physics itself
  // lives in ../lib/pendulum so it can be run and checked outside a browser —
  // see scripts/verify-pendulum.mjs.
  const swing = useRef(createSwing(COUNT))
  const drag = useRef({ id: null, startX: 0, startPos: 0, moved: 0 })
  const wheelTimer = useRef(0)

  useEffect(() => () => clearTimeout(wheelTimer.current), [])

  useAnimationFrame((_, deltaMs) => {
    if (reduced) return
    const state = swing.current
    // A tab that was backgrounded hands back one enormous delta; integrating
    // it in a single step would fling every pendant into the clamp.
    const dt = Math.min(deltaMs / 1000, 1 / 30)
    if (dt <= 0) return

    const velocity = pos.getVelocity()
    const drive = driveFrom((velocity - state.lastVelocity) / dt)
    state.lastVelocity = velocity

    if (state.resting && Math.abs(drive) < 1) return

    stepSwing(state, COUNT, drive, dt)
    for (let i = 0; i < COUNT; i++) angles[i].set(state.theta[i])
  })

  useMotionValueEvent(pos, 'change', (v) => {
    const i = clamp(Math.round(v), 0, LAST)
    setActive((prev) => (prev === i ? prev : i))
  })

  const goTo = useCallback(
    (index, velocityHint = 0) => {
      const target = clamp(index, 0, LAST)
      if (reduced) {
        pos.set(target)
        return
      }
      animate(pos, target, {
        type: 'spring',
        stiffness: 150,
        damping: 24,
        mass: 0.9,
        velocity: velocityHint,
      })
    },
    [pos, reduced],
  )

  // The slot width decides both the drag scale and how many neighbours are
  // visible, so it cannot be a media query guess.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width) return
      // A slot is both the gap between two pendants and the box the piece is
      // drawn into, so it cannot just be the desktop figure with a floor under
      // it: dividing a phone's width by the number of pieces that fit a
      // desktop rail left the centred piece a third of the screen wide with
      // half the panel empty beneath it. Narrow screens give most of their
      // width to one piece and show the next only as a hint at the edge.
      // The divisor also sets how big the centred piece gets: a slot is the
      // box each one is drawn into, so the widest pendants are limited by it
      // long before they run out of height.
      const next = width < 720 ? Math.min(width * 0.72, 340) : clamp(width / 4, 220, 340)
      setSlot(next)
      el.style.setProperty('--slot', `${next}px`)
      // The stage starts at the rail, so all a piece has to clear is the
      // longest thread any of them hangs on plus a little air underneath.
      el.style.setProperty('--hang', `${Math.max(180, height - 110)}px`)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Anywhere the rail is pushed by hand, whatever spring is still settling has
  // to let go of it first — otherwise the throw you are interrupting keeps
  // writing to `pos` underneath the gesture and drags it back.
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    pos.stop()
    drag.current = { id: e.pointerId, startX: e.clientX, startPos: pos.get(), moved: 0 }
    // Throws if the pointer is already gone by the time this runs. The drag
    // still works without capture — it just stops tracking once the cursor
    // leaves the stage — so this is never worth failing the gesture over.
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* no capture available; the pointer handlers below still run */
    }
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    const dx = e.clientX - d.startX
    d.moved = Math.max(d.moved, Math.abs(dx))
    // Past either end the rail still moves, at a third of the distance, so it
    // reads as resistance rather than as a jam.
    const raw = d.startPos - dx / slot
    pos.set(raw < 0 ? raw / 3 : raw > LAST ? LAST + (raw - LAST) / 3 : raw)
  }

  const endDrag = (e) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    drag.current.id = null
    const v = pos.getVelocity()
    const from = Math.round(pos.get())
    const projected = pos.get() + v * THROW_SECONDS
    goTo(clamp(Math.round(projected), from - MAX_THROW, from + MAX_THROW), v)
  }

  // A pendant is a click target as well as part of the rail, so a tap that
  // dragged is not a tap. Twelve pixels is the usual slop for a finger that
  // meant to hold still.
  const pick = useCallback(
    (index) => {
      if (drag.current.moved > 12) return
      goTo(index)
    },
    [goTo],
  )

  // Horizontal intent only. This is a section in the middle of a page, not a
  // panel over it, so a wheel that is mostly vertical belongs to the document —
  // swallowing it would trap the reader on the rail on the way down the page.
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    pos.stop()
    const raw = pos.get() + e.deltaX / slot
    pos.set(raw < 0 ? raw / 3 : raw > LAST ? LAST + (raw - LAST) / 3 : raw)

    clearTimeout(wheelTimer.current)
    wheelTimer.current = setTimeout(() => goTo(Math.round(pos.get())), 140)
  }

  // Bound to the stage rather than the window, for the same reason: the arrow
  // keys walk the rail only once someone has focused it, and go back to
  // scrolling the page the moment they tab away.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') goTo(Math.round(pos.get()) + 1)
    else if (e.key === 'ArrowLeft') goTo(Math.round(pos.get()) - 1)
    else if (e.key === 'Home') goTo(0)
    else if (e.key === 'End') goTo(LAST)
    else return
    e.preventDefault()
  }

  const first = Math.max(0, active - WINDOW)
  const last = Math.min(LAST, active + WINDOW)
  const visible = []
  for (let i = first; i <= last; i++) visible.push(i)

  return (
    <>
      <motion.div
        className={styles.rail}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      <div className={styles.halo} aria-hidden="true" />

      <div
        ref={stageRef}
        className={styles.stage}
        role="group"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={t.dollars.heading}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
      >
        {visible.map((i) => (
          <Pendant
            key={dollarImages[i].src}
            index={i}
            pos={pos}
            angle={angles[i]}
            onPick={pick}
            reduced={reduced}
            label={t.dollars.alt(i + 1)}
            pickLabel={t.dollars.pick(i + 1)}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label={t.dollars.prev}
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className={styles.readout}>
          <span className={styles.counter} aria-live="polite">
            {t.dollars.counter(active + 1, COUNT)}
          </span>
          <span className={styles.track} aria-hidden="true">
            <motion.span className={styles.trackFill} style={{ scaleX: progress }} />
          </span>
          <span className={styles.hint}>{t.dollars.hint}</span>
        </div>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => goTo(active + 1)}
          disabled={active === LAST}
          aria-label={t.dollars.next}
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
