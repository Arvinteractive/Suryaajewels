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
        <h1 className={styles.h1}>Master Goldsmiths. True 22K Heritage.</h1>
        <p className={styles.body}>
          We don&rsquo;t do assembly lines. Every piece is shaped, set, and polished by hand at
          our Coimbatore bench — preserving three generations of traditional Tamil goldsmithing.
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
          Master Goldsmiths.
          <br />
          True 22K Heritage.
        </h1>
        <p className={styles.body}>
          We don&rsquo;t do assembly lines. Every piece is shaped, set, and polished by hand at
          our Coimbatore bench — preserving three generations of traditional Tamil goldsmithing.
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
          <img
            src="/images/hero-thumb-1.jpg"
            alt="Handcrafted 22K gold bracelet resting on a marble slab, Suryaa Jewels Coimbatore"
            className={styles.thumb}
          />
          <img
            src="/images/hero-thumb-2.jpg"
            alt="Hand-forged 22K gold cuff bracelet on a slate tile, Coimbatore goldsmith bench"
            className={styles.thumb}
          />
        </div>
      </div>
      <div className={styles.splitImage}>
        <img
          src="/images/hero-split-main.jpg"
          alt="Handcrafted 22K gold necklace draped over raw Coimbatore sandstone"
        />
      </div>
    </section>
  )
}

export default function Hero({ variant }) {
  return variant === 'split' ? <HeroSplit /> : <HeroFullbleed />
}
