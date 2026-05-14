import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { CSSProperties } from 'react'

interface Props { text: string; className?: string; style?: CSSProperties }

export default function AnimatedText({ text, className, style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'] as any
  })
  const chars = Array.from(text)
  return (
    <p ref={ref} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((c, i) => {
        const start = i / chars.length
        const end = start + 1 / chars.length
        return <Char key={i} c={c} progress={scrollYProgress} range={[start, end]} />
      })}
    </p>
  )
}

function Char({ c, progress, range }: { c: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span style={{ position: 'relative', whiteSpace: 'pre' }}>
      <span style={{ visibility: 'hidden' }}>{c}</span>
      <motion.span style={{ position: 'absolute', left: 0, top: 0, opacity }}>{c}</motion.span>
    </span>
  )
}
