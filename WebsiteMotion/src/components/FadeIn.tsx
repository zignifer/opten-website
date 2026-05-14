import { motion } from 'framer-motion'
import type { ReactNode, ElementType, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export default function FadeIn({
  children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className, style
}: Props) {
  const Comp = motion.create(as as any)
  return (
    <Comp
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Comp>
  )
}
