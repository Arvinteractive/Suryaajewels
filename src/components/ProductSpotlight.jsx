import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useMediaQuery } from '../lib/useMediaQuery'
import { LITE_MOTION_QUERY } from '../lib/breakpoints'
import { contact } from '../config'
import Reveal from './Reveal'
import styles from './ProductSpotlight.module.css'

const SPECS = [
  { label: 'Material', value: '22K Hallmarked Gold' },
  { label: 'Detailing', value: 'Hand-Engraved Crest' },
  { label: 'Craft Time', value: 'Made to Order — 10–14 Days' },
  { label: 'Price', value: 'On Request — gold weight varies by design' },
]

// A colour block sits behind the frame and stays put; the frame itself lifts
// slightly on hover to open a gap between the two, the one depth cue in this
// section. No tilt, no 3D — the piece is the hero, not the transform.
export default function ProductSpotlight() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const reduced = useReducedMotion()
  const lite = useMediaQuery(LITE_MOTION_QUERY)

  useGSAP(
    () => {
      if (reduced || lite) return
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => gsap.set(imageRef.current, { yPercent: (self.progress - 0.5) * -12 }),
      })
      return () => trigger.kill()
    },
    { scope: sectionRef, dependencies: [reduced, lite] },
  )

  return (
    <section className={styles.section} ref={sectionRef}>
      <Reveal as="div" className={styles.imageCol}>
        <div className={styles.frame} aria-hidden="true" />
        <div className={styles.imageWrap}>
          <img
            ref={imageRef}
            src="/images/gallery-02.webp"
            alt="Hand-engraved 22K gold signet ring with a custom family crest"
            className={styles.image}
            width={1792}
            height={2400}
            loading="lazy"
            decoding="async"
          />
        </div>
      </Reveal>

      <div className={styles.text}>
        <Reveal as="div" className={styles.eyebrow}>
          Signature Piece
        </Reveal>
        <Reveal as="h2" delay={80} className={styles.heading}>
          The Heirloom Signet
        </Reveal>
        <Reveal as="p" delay={140} className={styles.body}>
          A hand-engraved signet, carved to carry a family crest into its next
          generation — cast in solid 22K gold and finished entirely by eye at
          our Coimbatore bench.
        </Reveal>

        <Reveal as="dl" delay={200} className={styles.specs}>
          {SPECS.map((spec) => (
            <div className={styles.specRow} key={spec.label}>
              <dt className={styles.specLabel}>{spec.label}</dt>
              <dd className={styles.specValue}>{spec.value}</dd>
            </div>
          ))}
        </Reveal>

        <Reveal as="div" delay={260}>
          <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className={styles.cta}>
            <span>Enquire About This Piece</span>
            <ArrowRight size={16} strokeWidth={1.5} className={styles.ctaArrow} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
