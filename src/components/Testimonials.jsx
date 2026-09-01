import styles from './Testimonials.module.css'
import { useT } from '../i18n/context'

export default function Testimonials() {
  const t = useT()

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t.testimonials.heading}</h2>
      <div className={styles.grid}>
        {t.testimonials.items.map((item) => (
          <div className={styles.card} key={item.name}>
            <div className={styles.mark}>&ldquo;</div>
            <div className={styles.quote}>{item.quote}</div>
            <div className={styles.attribution}>
              {item.name} — {item.place}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
