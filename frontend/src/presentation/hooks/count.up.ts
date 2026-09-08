'use client'

import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setValue(target)
      return
    }

    let start: number | null = null
    const startTimeout = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (start === null) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        // easeOutExpo for a snappy settle
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setValue(target * eased)
        if (progress < 1) {
          frame.current = requestAnimationFrame(step)
        }
      }
      frame.current = requestAnimationFrame(step)
    }, delay)

    return () => {
      window.clearTimeout(startTimeout)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration, delay])

  return value
}
