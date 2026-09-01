import styles from './Footer.module.css'
import { navLinks, trustIcons, contact } from '../config'
import { useT } from '../i18n/context'

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  const t = useT()

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <div className={styles.wordmark}>SURYAA</div>
          <div className={styles.microLabel}>{t.footer.microLabel}</div>
          <p className={styles.tagline}>{t.footer.tagline}</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>{t.footer.assurance}</h4>
          <ul className={styles.list}>
            {trustIcons.map((icon, i) => (
              <li key={icon} className={styles.assuranceItem}>
                <img
                  src={icon}
                  alt=""
                  className={styles.assuranceIcon}
                  loading="lazy"
                  decoding="async"
                />
                <span>{t.trust[i].title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>{t.footer.explore}</h4>
          <ul className={styles.list}>
            {navLinks.map((item, i) => (
              <li key={item.href}>
                <a href={item.href} className={styles.link}>
                  {t.nav.links[i]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>{t.footer.visitUs}</h4>
          <address className={styles.address}>
            <div>{t.visit.address}</div>
            <div>{t.visit.hours}</div>
            <div>{contact.phone}</div>
          </address>
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.social}
          >
            <InstagramIcon />
            {contact.instagram}
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.quote}>&ldquo;{t.footer.quote}&rdquo;</p>
        <div className={styles.copyright}>{t.footer.copyright}</div>
      </div>
    </footer>
  )
}
