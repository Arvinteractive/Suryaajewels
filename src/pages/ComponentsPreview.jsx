import FeaturedCollection from '../components/FeaturedCollection'
import JewelleryCategories from '../components/JewelleryCategories'
import ProductSpotlight from '../components/ProductSpotlight'
import CraftsmanshipStory from '../components/CraftsmanshipStory'
import LuxuryFinalCTA from '../components/LuxuryFinalCTA'
import styles from './ComponentsPreview.module.css'

// Deliberately not wired into App.jsx or Nav — this route exists only to
// stage the five new components against the real design system before any
// of them join the homepage. noindex'd and unlinked; see robots.txt.
const SECTIONS = [
  { id: 'featured-collection', label: 'Featured Collection', Component: FeaturedCollection },
  { id: 'jewellery-categories', label: 'Jewellery Categories', Component: JewelleryCategories },
  { id: 'product-spotlight', label: 'Signature Spotlight', Component: ProductSpotlight },
  { id: 'craftsmanship-story', label: 'Craftsmanship Story', Component: CraftsmanshipStory },
  { id: 'final-cta', label: 'Luxury Final CTA', Component: LuxuryFinalCTA },
]

export default function ComponentsPreview() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          <span className={styles.wordmark}>SURYAA</span>
          <span className={styles.microLabel}>JEWELS CRAFT</span>
        </a>
        <a href="/" className={styles.backLink}>
          ← Back to Site
        </a>
      </header>

      <div className={styles.intro}>
        <div className={styles.eyebrow}>Component Preview</div>
        <h1 className={styles.introHeading}>Five New Modules</h1>
        <p className={styles.introBody}>
          Built as extensions of the existing design system — same palette,
          type and spacing — staged here on their own page before any of
          them join the site.
        </p>
        <nav className={styles.jumpNav} aria-label="Jump to component">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={styles.jumpLink}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <main className={styles.main}>
        {SECTIONS.map(({ id, Component }) => (
          <div key={id} id={id} className={styles.sectionWrap}>
            <Component />
          </div>
        ))}
      </main>

      <footer className={styles.footer}>
        <span>© 2026 Suryaa Jewels Craft. All rights reserved.</span>
        <a href="/" className={styles.link}>
          Home
        </a>
      </footer>
    </div>
  )
}
