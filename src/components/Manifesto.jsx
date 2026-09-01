import ScrollRevealText from './ScrollRevealText'
import styles from './Manifesto.module.css'
import { useT } from '../i18n/context'

export default function Manifesto() {
  const t = useT()

  return (
    <section className={styles.section}>
      <ScrollRevealText text={t.manifesto} as="p" className={styles.statement} />
    </section>
  )
}
