import { useInView } from '../hooks/useInView'
import styles from './Reveal.module.css'

// Generic scroll-triggered fade-up wrapper for sections that don't have a
// bespoke scroll animation of their own.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, inView ? styles.visible : '', className].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
