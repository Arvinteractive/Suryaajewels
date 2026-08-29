import styles from './Testimonials.module.css'
import { testimonials } from '../config'

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Trusted by Families for Generations</h2>
      <div className={styles.grid}>
        {testimonials.map((item) => (
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
