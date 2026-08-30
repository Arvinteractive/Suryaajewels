import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../lib/useReducedMotion'

// Plain fade-in, triggered by real viewport intersection (not a pixel-based
// scroll-position guess) so it can only ever play once the text is actually
// on screen. Reduced motion: renders fully visible immediately.
export default function ScrollRevealText({ text, as: Tag = 'h2', className = '' }) {
  const [ref, inView] = useInView()
  const reduced = useReducedMotion()

  return (
    <Tag
      ref={ref}
      className={className}
      style={
        reduced
          ? undefined
          : {
              opacity: inView ? 1 : 0,
              transition: 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
            }
      }
    >
      {text}
    </Tag>
  )
}
