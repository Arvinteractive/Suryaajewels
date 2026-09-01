import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import styles from './CaseFileShowcase.module.css'
import { collections } from '../config'

const EASE = [0.76, 0, 0.24, 1]

// Split out of CaseFileShowcase so framer-motion lands in its own chunk.
// Nothing above the fold needs it, and ~35KB gzipped of animation runtime is
// a real parse-and-compile cost on a mid-range phone — it now only downloads
// once someone actually reaches for a case file.
export default function CaseFileModal({ openIndex, onClose }) {
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
          const item = collections[openIndex]
          return (
            <motion.div
              key={item.title}
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={{ clipPath: 'inset(0 0 0 100%)' }}
              transition={{ duration: 0.85, ease: EASE }}
              className={styles.modal}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(22,24,15,0.35) 0%, rgba(22,24,15,0.94) 100%), url(${item.shot})`,
              }}
            >
              <div className={styles.grain} style={{ opacity: 0.08 }} />
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: 'linear' }}
                className={styles.modalGlow}
                style={{
                  background: `radial-gradient(ellipse at 70% 20%, ${item.accent}, transparent 60%)`,
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
                  <div className={styles.modalFile}>File 0{openIndex + 1} · Suryaa Jewels</div>
                  <button type="button" onClick={onClose} className={styles.closeBtn}>
                    Close
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
                    <motion.ul
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, delay: 0.6 }}
                      className={styles.modalCredits}
                    >
                      <li style={{ color: item.accent }}>{item.sub}</li>
                      {item.credits.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })()}
    </AnimatePresence>
  )
}
