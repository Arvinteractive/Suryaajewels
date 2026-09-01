import styles from './TrustStrip.module.css'
import { trustIcons } from '../config'
import { useT } from '../i18n/context'
import Reveal from './Reveal'

export default function TrustStrip() {
  const t = useT()

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {trustIcons.map((icon, i) => (
          <Reveal as="div" key={icon} delay={i * 90} className={styles.item}>
            <img
              src={icon}
              alt=""
              className={styles.icon}
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
            />
            <div className={styles.title}>{t.trust[i].title}</div>
            <div className={styles.text}>{t.trust[i].text}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
