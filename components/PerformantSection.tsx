
import { useEffect, useRef, useState, ReactNode } from 'react'

interface PerformantSectionProps {
  children: ReactNode
  className?: string
  id?: string
  rootMargin?: string
}

export function PerformantSection({ 
  children, 
  className = "", 
  id, 
  rootMargin = "100px" 
}: PerformantSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setIsVisible(true)
          setHasBeenVisible(true)
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [rootMargin, hasBeenVisible])

  return (
    <section ref={sectionRef} className={className} id={id}>
      {isVisible ? children : (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      )}
    </section>
  )
}
