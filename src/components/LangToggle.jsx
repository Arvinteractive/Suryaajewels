import styles from './LangToggle.module.css'
import { LANGUAGES, useLang } from '../i18n/context'

export default function LangToggle({ compact = false }) {
  const { lang, setLang, swapping, t } = useLang()

  return (
    <span className={`${styles.group} ${compact ? styles.compact : ''}`}>
      <select
        className={styles.select}
        aria-label={t.nav.langLabel}
        value={lang}
        disabled={swapping}
        onChange={(event) => setLang(event.target.value)}
      >
        {LANGUAGES.map((entry) => (
          <option key={entry.code} value={entry.code} lang={entry.htmlLang}>
            {entry.name}
          </option>
        ))}
      </select>
      <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </span>
  )
}
