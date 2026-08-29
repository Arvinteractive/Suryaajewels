import styles from './TrustStrip.module.css'
import { trustItems } from '../config'
import Reveal from './Reveal'

export default function TrustStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {trustItems.map((item, i) => (
          <Reveal as="div" key={item.title} delay={i * 90} className={styles.item}>
            <img src={item.icon} alt="" className={styles.icon} />
            <div className={styles.title}>{item.title}</div>
            <div className={styles.text}>{item.text}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
