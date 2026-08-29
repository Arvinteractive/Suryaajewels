import styles from './Hero.module.css'

function HeroFullbleed() {
  return (
    <section
      id="craft"
      className={styles.fullbleed}
      style={{ backgroundImage: "url('/images/hero-fullbleed.jpg')" }}
    >
      <div className={styles.fullbleedScrim} />
      <div className={styles.fullbleedContent}>
        <div className={styles.eyebrow}>Suryaa Jewels Craft</div>
        <h1 className={styles.h1}>Handcrafted in Gold. Rooted in Heritage.</h1>
        <p className={styles.body}>
          A family atelier making fine jewelry entirely by hand — one piece, one goldsmith, one
          sitting at a time.
        </p>
        <a href="#collections" className={styles.ctaLight}>
          See Our Craft
        </a>
      </div>
    </section>
  )
}

function HeroSplit() {
  return (
    <section id="craft" className={styles.split}>
      <div className={styles.splitText}>
        <div className={styles.eyebrow}>Suryaa Jewels Craft</div>
        <h1 className={styles.h1}>
          Handcrafted in Gold.
          <br />
          Rooted in Heritage.
        </h1>
        <p className={styles.body}>
          Suryaa Jewels Craft is a family atelier carrying forward a tradition of handmade gold
          jewelry — one piece, one goldsmith, one sitting at a time.
        </p>
        <div className={styles.ctaRow}>
          <a href="#collections" className={styles.ctaDark}>
            See Our Craft
          </a>
          <a href="#heritage" className={styles.ctaOutline}>
            Our Story
          </a>
        </div>
        <div className={styles.thumbRow}>
          <img src="/images/hero-thumb-1.jpg" alt="Gold bracelet on marble slab" className={styles.thumb} />
          <img src="/images/hero-thumb-2.jpg" alt="Gold cuff on slate tile" className={styles.thumb} />
        </div>
      </div>
      <div className={styles.splitImage}>
        <img src="/images/hero-split-main.jpg" alt="Gold necklace draped on sandstone" />
      </div>
    </section>
  )
}

export default function Hero({ variant }) {
  return variant === 'split' ? <HeroSplit /> : <HeroFullbleed />
}
