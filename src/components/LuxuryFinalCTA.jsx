import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import styles from './LuxuryFinalCTA.module.css'

// The closing frame: the site's dark ink-deep treatment (already used for
// CaseFileShowcase's stage and the mobile nav panel) rather than a new
// colour, with a slow background drift standing in for the "soft light
// effect" — restrained enough to read as ambient, not as a moving picture.
export default function LuxuryFinalCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.imageLayer}>
        <img
          src="/images/gallery-04.webp"
          alt="22K gold drop earrings beside polished obsidian stone"
          className={styles.image}
          width={1792}
          height={2400}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <Reveal as="div" className={styles.eyebrow}>
          Suryaa Jewels Craft
        </Reveal>
        <Reveal as="h2" delay={100} className={styles.heading}>
          Gold, The Way It
          <br />
          Used To Be Made.
        </Reveal>
        <Reveal as="p" delay={200} className={styles.body}>
          Every piece hand-forged at our Coimbatore atelier — no shortcuts, no assembly line.
        </Reveal>
        <Reveal as="div" delay={300}>
          <a href="/#collections" className={styles.cta}>
            <span>Discover the Collection</span>
            <ArrowRight size={16} strokeWidth={1.5} className={styles.ctaArrow} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
