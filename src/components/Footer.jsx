import styles from './Footer.module.css'
import { navLinks, trustItems, heirloomQuote } from '../config'

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
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <div className={styles.wordmark}>SURYAA</div>
          <div className={styles.microLabel}>JEWELS CRAFT</div>
          <p className={styles.tagline}>
            A family atelier making fine jewelry entirely by hand — one piece, one goldsmith, one
            sitting at a time.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Our Assurance</h4>
          <ul className={styles.list}>
            {trustItems.map((item) => (
              <li key={item.title} className={styles.assuranceItem}>
                <img src={item.icon} alt="" className={styles.assuranceIcon} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Explore</h4>
          <ul className={styles.list}>
            {navLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Visit Us</h4>
          <address className={styles.address}>
            <div>Suryaa Jewels Craft, Edayar St, Town Hall, Coimbatore, Tamil Nadu 641001</div>
            <div>Tuesday — Sunday, 10:30 AM – 7:30 PM</div>
            <div>+91 98765 43210</div>
            <div>hello@suryaajewelscraft.com</div>
          </address>
          <a
            href="https://instagram.com/suryaajewelscraft"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.social}
          >
            <InstagramIcon />
            @suryaajewelscraft
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.quote}>&ldquo;{heirloomQuote}&rdquo;</p>
        <div className={styles.copyright}>© 2026 Suryaa Jewels Craft. All rights reserved.</div>
      </div>
    </footer>
  )
}
