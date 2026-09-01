import styles from './Visit.module.css'
import { contact } from '../config'
import { useT } from '../i18n/context'
import Reveal from './Reveal'

export default function Visit() {
  const t = useT()

  return (
    <section id="visit" className={styles.section}>
      <div className={styles.text}>
        <Reveal as="div" className={styles.eyebrow}>
          {t.visit.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={80} className={styles.heading}>
          {t.visit.heading}
        </Reveal>
        <Reveal as="div" delay={140} className={styles.field}>
          <div className={styles.fieldLabel}>{t.visit.addressLabel}</div>
          <div>{t.visit.address}</div>
        </Reveal>
        <Reveal as="div" delay={190} className={styles.field}>
          <div className={styles.fieldLabel}>{t.visit.hoursLabel}</div>
          <div>{t.visit.hours}</div>
        </Reveal>
        <Reveal as="div" delay={240} className={styles.field}>
          <div className={styles.fieldLabel}>{t.visit.contactLabel}</div>
          <div>{contact.phone}</div>
          <div>{t.visit.instagram}</div>
        </Reveal>
        <a href="#visit" className={styles.cta}>
          {t.visit.cta}
        </a>
      </div>
      <div className={styles.mapWrap}>
        <iframe
          className={styles.map}
          title={t.visit.mapTitle}
          src={contact.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          className={styles.directionsLink}
          href={contact.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.visit.directions}
        </a>
      </div>
    </section>
  )
}
