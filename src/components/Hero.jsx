import styles from './Hero.module.css'
import { useT } from '../i18n/context'

function HeroFullbleed() {
  const t = useT()

  return (
    <section
      id="craft"
      className={styles.fullbleed}
      style={{ backgroundImage: "url('/images/hero-fullbleed.jpg')" }}
    >
      <div className={styles.fullbleedScrim} />
      <div className={styles.fullbleedContent}>
        <div className={styles.eyebrow}>{t.hero.eyebrow}</div>
        <h1 className={styles.h1}>
          {t.hero.headlineA}
          <br className={styles.h1Break} />
          {t.hero.headlineB}
        </h1>
        <p className={styles.body}>{t.hero.body}</p>
        <a href="#collections" className={styles.ctaLight}>
          {t.hero.ctaPrimary}
        </a>
      </div>
    </section>
  )
}

function HeroSplit() {
  const t = useT()

  return (
    <section id="craft" className={styles.split}>
      <div className={styles.splitText}>
        <div className={styles.eyebrow}>{t.hero.eyebrow}</div>
        <h1 className={styles.h1}>
          {t.hero.headlineA}
          <br />
          {t.hero.headlineB}
        </h1>
        <p className={styles.body}>{t.hero.body}</p>
        <div className={styles.ctaRow}>
          <a href="#collections" className={styles.ctaDark}>
            {t.hero.ctaPrimary}
          </a>
          <a href="#heritage" className={styles.ctaOutline}>
            {t.hero.ctaSecondary}
          </a>
        </div>
        <div className={styles.thumbRow}>
          <img
            src="/images/hero-thumb-1.jpg"
            alt={t.hero.thumbAlt[0]}
            className={styles.thumb}
            width={72}
            height={72}
            decoding="async"
          />
          <img
            src="/images/hero-thumb-2.jpg"
            alt={t.hero.thumbAlt[1]}
            className={styles.thumb}
            width={72}
            height={72}
            decoding="async"
          />
        </div>
      </div>
      <div className={styles.splitImage}>
        <img
          src="/images/hero-split-main.jpg"
          alt={t.hero.mainAlt}
          width={1792}
          height={2400}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  )
}

export default function Hero({ variant }) {
  return variant === 'split' ? <HeroSplit /> : <HeroFullbleed />
}
