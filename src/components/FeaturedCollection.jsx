import { ArrowRight } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import styles from './FeaturedCollection.module.css'

// The one section on this page built as a fashion-campaign spread rather
// than a standard content block: one large asymmetric split, image and copy
// settling in on their own beat rather than together.
export default function FeaturedCollection() {
  const [ref, inView] = useInView()

  return (
    <section className={styles.section}>
      <div ref={ref} className={`${styles.stage} ${inView ? styles.visible : ''}`}>
        <div className={styles.imageFrame}>
          <img
            src="/images/gallery-01.webp"
            alt="Handcrafted 22K gold haaram draped over raw Coimbatore sandstone"
            className={styles.image}
            width={1792}
            height={2400}
            decoding="async"
          />
        </div>

        <div className={styles.text}>
          <div className={styles.eyebrow}>Featured Collection</div>
          <h2 className={styles.heading}>Necklaces &amp; Haarams</h2>
          <p className={styles.body}>
            Statement pieces for muhurthams and festive occasions — solid 22K
            gold, hand-soldered link by link, with temple motifs designed to
            outlast us all.
          </p>
          <a href="/#collections" className={styles.cta}>
            <span>Explore the Collection</span>
            <ArrowRight size={16} strokeWidth={1.5} className={styles.ctaArrow} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
