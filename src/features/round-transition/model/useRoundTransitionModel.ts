import { useState } from "react"
import { useAtom } from "jotai"

import {
  resetRoundTransitionStorageAtom,
  roundTransitionCarouselIndexAtom,
  roundTransitionStepAtom,
} from "@/shared/store/round-transition-storage"

import type { RoundTransitionCarouselSlide } from "./types"

type UseRoundTransitionModelParams = {
  slides: ReadonlyArray<RoundTransitionCarouselSlide>
  onConfirm?: () => void
  onExitToSetup?: () => void
}

export function useRoundTransitionModel({
  slides,
  onConfirm,
  onExitToSetup,
}: UseRoundTransitionModelParams) {
  const [step, setStep] = useAtom(roundTransitionStepAtom)
  const [index, setIndex] = useAtom(roundTransitionCarouselIndexAtom)
  const [direction, setDirection] = useState(0)
  const [, resetRoundTransitionStorage] = useAtom(resetRoundTransitionStorageAtom)

  const safeIndex = index >= 0 && index < slides.length ? index : 0

  const paginate = (nextDirection: number) => {
    if (slides.length <= 1) 
      return

    setDirection(nextDirection)
    setIndex(prevIndex => {
      const tentativeIndex = prevIndex + nextDirection
      if (tentativeIndex < 0) 
        return slides.length - 1
      if (tentativeIndex >= slides.length) 
        return 0
      return tentativeIndex
    })
  }

  const selectSlide = (nextIndex: number) => {
    if (slides.length === 0) 
      return

    const boundedIndex = Math.min(Math.max(nextIndex, 0), slides.length - 1)
    if (boundedIndex === safeIndex) {
      setDirection(0)
      return
    }

    setDirection(boundedIndex > safeIndex ? 1 : -1)
    setIndex(boundedIndex)
  }

  const runWithReset = (callback?: () => void) => () => {
    resetRoundTransitionStorage()
    callback?.()
  }

  const handleConfirm = runWithReset(onConfirm)
  const handleExitToSetup = runWithReset(onExitToSetup)

  return {
    step,
    setStep,
    index,
    setIndex,
    direction,
    setDirection,
    safeIndex,
    paginate,
    selectSlide,
    handleConfirm,
    handleExitToSetup,
  }
}
