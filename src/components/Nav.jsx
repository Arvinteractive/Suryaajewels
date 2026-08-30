import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Nav.module.css'
import { navLinks } from '../config'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('nav-portal') : null
  if (!portalTarget) return null

  return createPortal(
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : styles.navOverHero}`}>
      <div>
        <div className={styles.wordmark}>SURYAA</div>
        <div className={styles.microLabel}>JEWELS CRAFT</div>
      </div>
      <div className={styles.links}>
        {navLinks.map((item) => (
          <a key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </a>
        ))}
        <a href="#visit" className={styles.bookBtn}>
          Book a Visit
        </a>
      </div>
    </nav>,
    portalTarget,
  )
}
