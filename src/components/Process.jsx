import styles from './Process.module.css'
import { processNumbers } from '../config'
import { useT } from '../i18n/context'
import Reveal from './Reveal'

export default function Process() {
  const t = useT()

  return (
    <section className={styles.section}>
      <Reveal as="h2" className={styles.heading}>
        {t.process.heading}
      </Reveal>
      <div className={styles.grid}>
        {processNumbers.map((n, i) => (
          <Reveal as="div" key={n} delay={i * 90} className={styles.step}>
            <div className={styles.num}>{n}</div>
            <div className={styles.title}>{t.process.steps[i].title}</div>
            <div className={styles.text}>{t.process.steps[i].text}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
