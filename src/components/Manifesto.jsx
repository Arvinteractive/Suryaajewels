import ScrollRevealText from './ScrollRevealText'
import styles from './Manifesto.module.css'
import { manifesto } from '../config'

export default function Manifesto() {
  return (
    <section className={styles.section}>
      <ScrollRevealText text={manifesto} as="p" start="top 88%" className={styles.statement} />
    </section>
  )
}
