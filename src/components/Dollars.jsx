import { Suspense, lazy, useEffect, useState } from 'react'
import styles from './Dollars.module.css'
import { useT } from '../i18n/context'

const DollarsRail = lazy(() => import('./DollarsRail'))

// The dollar case. Sits third on the page, straight after the trust strip,
// because it is the one place a visitor can see what the bench actually makes
// rather than read a claim about it.
//
// The rail used to live behind a card that opened a modal. It doesn't any
// more: putting the pieces one click away meant nobody saw them without
// deciding to, and the click had to wait on a chunk before anything moved.
// Now the carousel *is* the section, and the only thing still deferred is the
// animation runtime, which is fetched on idle and so is already in place by
// the time anyone scrolls onto it.
export default function Dollars() {
  const t = useT()
  const [ready, setReady] = useState(false)

  // Mounted on idle rather than on scroll. An IntersectionObserver would only
  // fetch the chunk once the section came near the viewport, which sounds
  // tidier but makes a section that is barely below the fold depend on the
  // page actually painting to exist at all — and if the observer never fires,
  // the rail is simply never there. Idle keeps it off the critical path, has
  // a plain timer as its floor, and always resolves.
  useEffect(() => {
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(() => setReady(true), { timeout: 1200 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(() => setReady(true), 600)
    return () => clearTimeout(id)
  }, [])

  return (
    <section id="dollars" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t.dollars.eyebrow}</p>
          <h2 className={styles.heading}>{t.dollars.heading}</h2>
        </div>
        <p className={styles.body}>{t.dollars.body}</p>
      </div>

      {/* The rail reserves its height from CSS, so the page below it never
          shifts while the chunk is on its way. */}
      <div className={styles.well}>
        {ready && (
          <Suspense fallback={null}>
            <DollarsRail />
          </Suspense>
        )}
      </div>
    </section>
  )
}
