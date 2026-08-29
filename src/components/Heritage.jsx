import styles from './Heritage.module.css'
import Reveal from './Reveal'
import ReadingHighlight from './ReadingHighlight'

export default function Heritage() {
  return (
    <section id="heritage" className={styles.section}>
      <Reveal as="div" className={styles.imageWrap}>
        <img src="/images/about-heritage.jpg" alt="Goldsmith soldering a piece of jewelry at the bench" />
      </Reveal>
      <div className={styles.text}>
        <Reveal as="div" delay={100} className={styles.eyebrow}>
          Our Heritage
        </Reveal>
        <Reveal as="h2" delay={160} className={styles.heading}>
          Three Generations of Goldsmiths
        </Reveal>
        <ReadingHighlight
          text="What began as a single workbench, passed down through our family, has grown into a small atelier — but the way we work hasn't changed. Every design is sketched by hand, every stone is set by eye, and every piece leaves the workshop having passed through the same hands that started it."
          className={styles.body}
        />
        <p className={styles.body}>
          We keep our batches small on purpose, the same way our grandfather did — it&rsquo;s the
          only way to keep the craft honest.
        </p>
      </div>
    </section>
  )
}
