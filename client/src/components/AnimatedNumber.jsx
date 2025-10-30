import { useEffect, useState, useRef } from 'react'

function AnimatedNumber({ value, duration = 800, className = '' }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousValue = useRef(value)

  useEffect(() => {
    if (previousValue.current === value) return

    console.log(`💫 AnimatedNumber: ${previousValue.current} → ${value}`)
    setIsAnimating(true)
    const startValue = previousValue.current
    const endValue = value
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut)

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        previousValue.current = value
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {displayValue}
    </span>
  )
}

export default AnimatedNumber
