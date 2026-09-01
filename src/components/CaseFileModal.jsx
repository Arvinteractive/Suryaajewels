import { useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import styles from './CaseFileShowcase.module.css'
import { collectionArt } from '../config'
import { useT } from '../i18n/context'

const EASE = [0.76, 0, 0.24, 1]

// Split out of CaseFileShowcase so framer-motion lands in its own chunk.
// Nothing above the fold needs it, and ~35KB gzipped of animation runtime is
// a real parse-and-compile cost on a mid-range phone — it now only downloads
// once someone actually reaches for a case file.
export default function CaseFileModal({ openIndex, onClose }) {
  const t = useT()
  const cursorRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0, host: null })
  const frameRef = useRef(0)

  // The ring is moved by writing a transform straight to the node inside one
  // rAF, never through state: a pointermove that re-rendered the open file on
  // every sample would undo the scroll work this section just had.
  const paintCursor = useCallback(() => {
    frameRef.current = 0
    const ring = cursorRef.current
    const { x, y, host } = pointerRef.current
    if (!ring || !host) return

    const rect = host.getBoundingClientRect()
    const radius = ring.offsetWidth / 2
    // Clamped to the panel: approaching an edge the ring stops against it
    // rather than hanging half outside the container it belongs to.
    const localX = Math.min(Math.max(x - rect.left, radius), rect.width - radius)
    const localY = Math.min(Math.max(y - rect.top, radius), rect.height - radius)
    ring.style.transform = `translate3d(${localX}px, ${localY}px, 0) translate(-50%, -50%)`
  }, [])

  const trackCursor = useCallback(
    (e) => {
      pointerRef.current.x = e.clientX
      pointerRef.current.y = e.clientY
      pointerRef.current.host = e.currentTarget
      if (!frameRef.current) frameRef.current = requestAnimationFrame(paintCursor)
    },
    [paintCursor],
  )

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, onClose])

  return (
    <AnimatePresence>
      {openIndex !== null &&
        (() => {
          const art = collectionArt[openIndex]
          const item = t.collections[openIndex]
          return (
            <motion.div
              key={openIndex}
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={{ clipPath: 'inset(0 0 0 100%)' }}
              transition={{ duration: 0.85, ease: EASE }}
              className={styles.modal}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(22,24,15,0.35) 0%, rgba(22,24,15,0.94) 100%), url(${art.shot})`,
              }}
              // The whole open panel is the dismiss target; the ring riding
              // the cursor is what tells you so.
              onClick={onClose}
              onPointerMove={trackCursor}
              onPointerEnter={trackCursor}
            >
              <div className={styles.grain} style={{ opacity: 0.08 }} />

              <div ref={cursorRef} className={styles.cursorClose} aria-hidden="true">
                <X size={22} strokeWidth={1.4} />
              </div>
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: 'linear' }}
                className={styles.modalGlow}
                style={{
                  background: `radial-gradient(ellipse at 70% 20%, ${art.accent}, transparent 60%)`,
                }}
              />

              <div className={styles.modalInner}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className={styles.modalHead}
                >
                  {/* Title and description carry the panel on their own. The
                      file number and house name said nothing a visitor needed,
                      and the word "Close" is redundant beside the ✕. */}
                  <button
                    type="button"
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label={`${t.showcase.close} — ${item.title}`}
                  >
                    <span className={styles.closeRing}>
                      <X size={16} />
                    </span>
                  </button>
                </motion.div>

                <div className={styles.modalBody}>
                  <div className={styles.modalTitleMask}>
                    <motion.h3
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '-100%' }}
                      transition={{ duration: 0.85, ease: EASE, delay: 0.2 }}
                      className={styles.modalTitle}
                    >
                      {item.title}
                    </motion.h3>
                  </div>

                  <div className={styles.modalMeta}>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, delay: 0.5 }}
                      className={styles.modalSummary}
                    >
                      {item.summary}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })()}
    </AnimatePresence>
  )
}
