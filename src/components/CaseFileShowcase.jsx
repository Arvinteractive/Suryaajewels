import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import styles from './CaseFileShowcase.module.css'
import { collections } from '../config'

const CaseFileModal = lazy(() => import('./CaseFileModal'))

// Case-file catalogue: four category tiles that expand into a study behind a
// choreographed clip-path wipe. Replaces the plain hover-tile grid with
// something worth clicking through.
//
// The open file is rendered inside its own tile's cell rather than as a
// sibling of the grid. Which box it actually fills is then left to CSS: the
// cell is unpositioned on desktop, so the wipe resolves against the whole
// stage as before, and positioned on mobile, so it stays inside the card that
// was tapped — at that card's normal size, so the grid never reflows.
export default function CaseFileShowcase() {
  const [open, setOpen] = useState(null)
  // The cell currently hosting the modal. Deliberately *not* cleared on close
  // — the modal has to stay mounted for AnimatePresence to play the exit wipe
  // out of the same card it wiped into.
  const [host, setHost] = useState(null)

  // Warm the lazy chunk once the browser is idle. Hover used to trigger this,
  // which never helped a phone: touchstart and click land in the same instant,
  // so the first tap sat waiting on the network and the wipe began late — the
  // press appeared to need confirming. Idle keeps it off the critical path and
  // still has it ready long before anyone reaches the section.
  useEffect(() => {
    const warm = () => {
      import('./CaseFileModal')
    }
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(warm, { timeout: 2500 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(warm, 1500)
    return () => clearTimeout(id)
  }, [])

  const closeModal = useCallback(() => setOpen(null), [])

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
          <span>{collections.map((item) => item.tag).join(' · ')}</span>
        </div>

        <div className={styles.grid}>
          {collections.map((item, k) => (
            <div key={item.title} className={styles.tileCell}>
              <button
                type="button"
                onClick={() => {
                  setHost(k)
                  setOpen(k)
                }}
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

              {host === k && (
                <Suspense fallback={null}>
                  <CaseFileModal openIndex={open} onClose={closeModal} />
                </Suspense>
              )}
            </div>
          ))}
        </div>

        <div className={styles.hint}>Tap a category to open the file</div>
      </div>
    </section>
  )
}
