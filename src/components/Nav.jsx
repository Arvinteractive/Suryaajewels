import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Nav.module.css'
import { navLinks, contact } from '../config'
import { useMediaQuery } from '../lib/useMediaQuery'
import { MOBILE_QUERY } from '../lib/breakpoints'
import LangToggle from './LangToggle'
import { useT } from '../i18n/context'

export default function Nav() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    // rAF-coalesced: scroll fires far more often than it can paint, and the
    // only thing this reads is a single boolean threshold.
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        setScrolled(window.scrollY > 8)
      })
    }

    setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // The panel only exists below the nav breakpoint — if the viewport grows
  // past it (tablet rotation, desktop resize) the links come back inline and
  // a still-open overlay would be orphaned on top of them.
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    // Freeze the page behind the overlay. Safe to touch body overflow here:
    // the hamburger only appears below the nav breakpoint, where
    // ScrollSmoother is deliberately not running.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('nav-portal') : null
  if (!portalTarget) return null

  const barClass = [
    styles.nav,
    scrolled ? styles.navScrolled : styles.navOverHero,
    menuOpen ? styles.navMenuOpen : '',
  ]
    .filter(Boolean)
    .join(' ')

  return createPortal(
    <>
      <nav className={barClass}>
        <a href="#craft" className={styles.brand} onClick={closeMenu}>
          <span className={styles.wordmark}>SURYAA</span>
          <span className={styles.microLabel}>{t.nav.microLabel}</span>
        </a>

        <div className={styles.links}>
          {navLinks.map((item, i) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {t.nav.links[i]}
            </a>
          ))}
          <span className={styles.langSlot}>
            <LangToggle />
          </span>
          <a href="#visit" className={styles.bookBtn}>
            {t.nav.book}
          </a>
        </div>

        {/* Below the nav breakpoint the link row that hosts the desktop switch
            is gone, so a compact one rides the bar itself. Deliberately not
            tucked inside the slide-out panel: nobody thinks to open a menu
            looking for a language they cannot currently read. */}
        <div className={styles.mobileControls}>
          <span className={styles.langSlot}>
            <LangToggle compact />
          </span>

          <button
            ref={toggleRef}
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-panel"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.burgerBox} aria-hidden="true">
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`${styles.scrim} ${menuOpen ? styles.scrimOpen : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        id="nav-mobile-panel"
        ref={panelRef}
        tabIndex={-1}
        className={`${styles.panel} ${menuOpen ? styles.panelOpen : ''}`}
        // Kept mounted so the slide-out transition can play, but pulled out of
        // the a11y tree and tab order entirely while closed.
        inert={!menuOpen}
      >
        <div className={styles.panelLinks}>
          {navLinks.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.panelLink}
              style={{ transitionDelay: menuOpen ? `${120 + i * 55}ms` : '0ms' }}
              onClick={closeMenu}
            >
              <span className={styles.panelLinkIndex}>0{i + 1}</span>
              {t.nav.links[i]}
            </a>
          ))}
        </div>

        <a
          href="#visit"
          className={styles.panelCta}
          style={{ transitionDelay: menuOpen ? `${120 + navLinks.length * 55}ms` : '0ms' }}
          onClick={closeMenu}
        >
          {t.nav.book}
        </a>

        <div className={styles.panelFoot}>
          <div>{t.visit.shortAddress}</div>
          <div>{contact.phone}</div>
        </div>
      </div>
    </>,
    portalTarget,
  )
}
