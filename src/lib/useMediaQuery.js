import { useEffect, useState } from 'react'

// SSR-safe matchMedia subscription. Reads synchronously on first render so
// the very first paint already reflects the right branch — important for the
// scroll hooks, which would otherwise install a desktop-only effect on mobile
// and tear it down a frame later.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const onChange = (e) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
