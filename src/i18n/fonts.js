// Outfit and Raleway cover Latin only. Devanagari and Tamil each need their
// own face, and neither is worth putting on the critical path for a visitor
// who never leaves English — so they are fetched the first time (and only the
// first time) their language is selected.
const FACES = {
  hi: {
    family: 'Noto Sans Devanagari',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&display=swap',
  },
  ta: {
    family: 'Noto Sans Tamil',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600&display=swap',
  },
}

const pending = new Map()

// Resolves once the script's face is actually usable for painting. English
// resolves immediately — its fonts ship in index.html.
export function ensureLangFont(lang) {
  if (typeof document === 'undefined') return Promise.resolve()

  const face = FACES[lang]
  if (!face) return Promise.resolve()
  if (pending.has(lang)) return pending.get(lang)

  const stylesheet = new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = face.href
    // Never block the swap on a font CDN that is slow or blocked: resolve on
    // error too and let the fallback stack render.
    link.addEventListener('load', resolve, { once: true })
    link.addEventListener('error', resolve, { once: true })
    document.head.appendChild(link)
  })

  const ready = stylesheet
    .then(() =>
      document.fonts
        ? Promise.all([
            document.fonts.load(`400 1rem "${face.family}"`),
            document.fonts.load(`600 1rem "${face.family}"`),
          ])
        : null,
    )
    .catch(() => null)

  pending.set(lang, ready)
  return ready
}
