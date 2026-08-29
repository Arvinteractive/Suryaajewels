import { Fragment, useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../lib/useReducedMotion'

// Masked word-by-word reveal, staggered on viewport entry. Reduced motion:
// text renders fully visible immediately.
export default function ScrollRevealText({
  text,
  as: Tag = 'h2',
  stagger = 0.045,
  start = 'top 85%',
  className = '',
}) {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  useGSAP(
    () => {
      if (reduced || typeof window === 'undefined') return
      const units = rootRef.current?.querySelectorAll('[data-reveal-unit]')
      if (!units || units.length === 0) return

      gsap.fromTo(
        units,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          stagger,
          scrollTrigger: {
            trigger: rootRef.current,
            start,
            once: true,
          },
        },
      )
    },
    { scope: rootRef, dependencies: [reduced, text, stagger, start], revertOnUpdate: true },
  )

  return (
    <Tag ref={rootRef} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              paddingBottom: '0.12em',
              marginBottom: '-0.12em',
              verticalAlign: 'bottom',
            }}
          >
            <span data-reveal-unit style={{ display: 'inline-block', willChange: 'transform' }}>
              {word}
            </span>
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
