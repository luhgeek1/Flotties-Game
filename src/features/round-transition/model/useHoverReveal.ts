import { useCallback, useEffect, useRef, useState } from "react"

export function useHoverReveal(enabled: boolean, delayMs = 1000) {
  const [hovered, setHovered] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const isPointerInsideRef = useRef(false)

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const onEnter = useCallback(() => {
    isPointerInsideRef.current = true

    if (!enabled) {
      setHovered(true)
      return
    }

    clear()
    timeoutRef.current = window.setTimeout(() => {
      setHovered(true)
      timeoutRef.current = null
    }, delayMs)
  }, [clear, delayMs, enabled])

  const onLeave = useCallback(() => {
    isPointerInsideRef.current = false
    clear()
    setHovered(false)
  }, [clear])

  const reset = useCallback(() => {
    clear()
    setHovered(false)
  }, [clear])

  useEffect(() => {
    if (enabled && isPointerInsideRef.current) {
      clear()
      timeoutRef.current = window.setTimeout(() => {
        setHovered(true)
        timeoutRef.current = null
      }, delayMs)
    }
  }, [clear, delayMs, enabled])

  useEffect(() => (
    () => {
      clear()
    }
  ), [clear])

  return { hovered, onEnter, onLeave, reset }
}
