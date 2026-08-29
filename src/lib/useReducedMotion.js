import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// SSR-safe prefers-reduced-motion hook; scroll-driven components branch on
// this to render a static fallback instead of animating.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(QUERY).matches
      : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mq = window.matchMedia(QUERY)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
