import styles from './Process.module.css'
import { processSteps } from '../config'
import Reveal from './Reveal'

export default function Process() {
  return (
    <section className={styles.section}>
      <Reveal as="h2" className={styles.heading}>
        From Sketch to Setting
      </Reveal>
      <div className={styles.grid}>
        {processSteps.map((step, i) => (
          <Reveal as="div" key={step.n} delay={i * 90} className={styles.step}>
            <div className={styles.num}>{step.n}</div>
            <div className={styles.title}>{step.title}</div>
            <div className={styles.text}>{step.text}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
