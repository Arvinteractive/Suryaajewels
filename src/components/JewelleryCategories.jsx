import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import styles from './JewelleryCategories.module.css'

// One large tile plus four minor ones, deliberately unequal — the "boring
// standard card grid" this is written against is CaseFileShowcase's own
// uniform four-up layout one section over on the homepage. Same tile
// vocabulary (index, arrow, gold underline on hover), different composition.
const CATEGORIES = [
  {
    name: 'Necklaces & Haarams',
    sub: 'Temple motifs, festive weight',
    image: '/images/gallery-05.webp',
    alt: 'Bridal 22K gold necklace displayed on a velvet cushion',
  },
  {
    name: 'Rings',
    sub: 'Engagement to everyday',
    image: '/images/gallery-09.webp',
    alt: 'Hand-polished 22K gold ring displayed on a velvet surface',
  },
  {
    name: 'Earrings',
    sub: 'Jhumkas to chandeliers',
    image: '/images/gallery-03.webp',
    alt: 'Traditional 22K gold hoop earrings resting on natural clay',
  },
  {
    name: 'Bracelets',
    sub: 'Cuffs, chains, bangles',
    image: '/images/gallery-07.webp',
    alt: 'Hand-forged 22K gold bracelet on a marble slab',
  },
  {
    name: 'Collections',
    sub: 'Curated edits, made to order',
    image: '/images/gallery-06.webp',
    alt: 'Hand-finished 22K gold brooch resting on raw silk cloth',
  },
]

export default function JewelleryCategories() {
  return (
    <section className={styles.section}>
      <Reveal as="div" className={styles.eyebrow}>
        Explore by Category
      </Reveal>
      <Reveal as="h2" delay={80} className={styles.heading}>
        Every Piece, By Craft
      </Reveal>

      <div className={`${styles.grid} scrollbar-hide`}>
        {CATEGORIES.map((cat, i) => (
          <Reveal
            as="a"
            key={cat.name}
            href="/#collections"
            delay={i * 90}
            className={`${styles.tile} ${i === 0 ? styles.tileFeatured : ''}`}
          >
            <img
              src={cat.image}
              alt={cat.alt}
              className={styles.tileImage}
              width={1792}
              height={2400}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.tileScrim} />
            <div className={styles.tileInner}>
              <div className={styles.tileTop}>
                <span className={styles.tileIndex}>0{i + 1}</span>
                <ArrowUpRight className={styles.tileArrow} size={18} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className={styles.tileBody}>
                <div className={styles.tileName}>{cat.name}</div>
                <div className={styles.tileSub}>{cat.sub}</div>
              </div>
            </div>
            <span className={styles.tileBar} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
