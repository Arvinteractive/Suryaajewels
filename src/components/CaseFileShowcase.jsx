import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import styles from './CaseFileShowcase.module.css'
import { collections } from '../config'

const EASE = [0.76, 0, 0.24, 1]

// Case-file catalogue: four category tiles that expand into a full-stage
// study behind a choreographed clip-path wipe. Replaces the plain hover-tile
// grid with something worth clicking through.
export default function CaseFileShowcase() {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section id="collections" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>What We Craft</h2>
        <div className={styles.subhead}>
          A showcase of the forms our goldsmiths return to most often — every piece made to
          order.
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.grain} />

        <div className={styles.index}>
          <span>Collections · Made to Order</span>
          <span>{String(collections.length).padStart(2, '0')} categories</span>
        </div>

        <div className={styles.grid}>
          {collections.map((item, k) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setOpen(k)}
              className={styles.tile}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(22,24,15,0.1) 0%, rgba(22,24,15,0.88) 100%), url(${item.shot})`,
              }}
            >
              <div className={styles.tileTop}>
                <span className={styles.tileIndex}>0{k + 1}</span>
                <ArrowUpRight className={styles.tileArrow} size={18} />
              </div>
              <div className={styles.tileBody}>
                <div className={styles.tileTitle}>{item.title}</div>
                <div className={styles.tileSub}>{item.sub}</div>
              </div>
              <span className={styles.tileBar} style={{ background: item.accent }} />
            </button>
          ))}
        </div>

        <div className={styles.hint}>Click a category to open the file</div>

        <AnimatePresence>
          {open !== null &&
            (() => {
              const item = collections[open]
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
                      <div className={styles.modalFile}>File 0{open + 1} · Suryaa Jewels</div>
                      <button type="button" onClick={() => setOpen(null)} className={styles.closeBtn}>
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
      </div>
    </section>
  )
}
