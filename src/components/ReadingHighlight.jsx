import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'

// Sentence whose words ignite in turn as a reading head sweeps through on
// scroll progress: words behind it settle to ink, the word under it flares
// in the accent colour, words ahead stay dim.
export default function ReadingHighlight({
  text,
  inkColor = 'var(--color-text)',
  dimColor = 'var(--color-border)',
  hotColor = 'var(--color-gold)',
  className = '',
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const words = useMemo(() => text.trim().split(/\s+/), [text])

  useGSAP(
    () => {
      const el = ref.current
      if (!el || typeof window === 'undefined') return
      const spans = el.querySelectorAll('[data-w]')

      if (reduced) {
        spans.forEach((s) => {
          s.style.color = inkColor
        })
        return
      }

      // The palette is a pure function of which word the reading head is
      // currently over, so it only actually changes when that word changes.
      // Tracking it lets the scrub skip the whole write loop on the ~95% of
      // frames that would repaint every span to the colour it already had.
      let litWord = -1

      const paint = (progress) => {
        const lead = progress * spans.length
        const current = Math.round(lead)
        if (current === litWord) return
        litWord = current
        spans.forEach((s, i) => {
          s.style.color = i < lead - 0.5 ? inkColor : i < lead + 0.5 ? hotColor : dimColor
        })
      }

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        end: 'bottom 55%',
        scrub: true,
        onUpdate: (self) => paint(self.progress),
      })

      return () => trigger.kill()
    },
    { scope: ref, dependencies: [reduced, text, inkColor, dimColor, hotColor], revertOnUpdate: true },
  )

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w style={{ color: dimColor, transition: 'color 0.1s linear' }}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
