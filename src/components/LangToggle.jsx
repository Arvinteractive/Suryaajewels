import styles from './LangToggle.module.css'
import { LANGUAGES, useLang } from '../i18n/context'

// Three-up segmented switch. Colour is inherited entirely from whatever
// wraps it, so the same component sits on the transparent hero bar, the
// scrolled bar and the dark mobile panel without knowing about any of them.
export default function LangToggle({ compact = false }) {
  const { lang, setLang, swapping, t } = useLang()
  const index = LANGUAGES.findIndex((entry) => entry.code === lang)

  return (
    <div
      className={`${styles.group} ${compact ? styles.compact : ''}`}
      role="group"
      aria-label={t.nav.langLabel}
    >
      <span
        className={styles.indicator}
        style={{ transform: `translate3d(${index * 100}%, 0, 0)` }}
        aria-hidden="true"
      />
      {LANGUAGES.map((entry) => {
        const active = entry.code === lang
        return (
          <button
            key={entry.code}
            type="button"
            lang={entry.htmlLang}
            className={`${styles.option} ${active ? styles.optionActive : ''}`}
            aria-pressed={active}
            // The label is a two-letter abbreviation or a single glyph; the
            // full endonym is what a screen reader should actually announce.
            aria-label={entry.name}
            // A click landing mid-cross-fade would be dropped by the provider
            // anyway — disabling says so rather than looking broken.
            disabled={swapping}
            onClick={() => setLang(entry.code)}
          >
            {entry.label}
          </button>
        )
      })}
    </div>
  )
}
