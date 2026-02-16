import { useMemo, useState } from "react"
import { useAtom } from "jotai"

import { resetRoundTransitionStorageAtom, roundTransitionCarouselIndexAtom, roundTransitionStepAtom } from "@/shared/store/round-transition-storage"
import { buildScoreChartItems, sortPlayersByScore } from "./selectors"
import type { RoundTransitionModalProps, RoundTransitionScoreSlide } from "./types"
import { useHoverReveal } from "./useHoverReveal"

export function useRoundTransitionModel({ playerScores, onConfirm, onExitToSetup }: RoundTransitionModalProps) {
  const slides = useMemo<ReadonlyArray<RoundTransitionScoreSlide>>(
    () => {
      const sortedPlayers = sortPlayersByScore(playerScores)
      const scoreChartItems = buildScoreChartItems(sortedPlayers)
      const mvpPlayer = sortedPlayers[0] ?? null

      return [
        {
          key: "mvp",
          type: "mvp",
          player: mvpPlayer,
        },
        {
          key: "score",
          type: "score",
          items: scoreChartItems,
        },
        {
          key: "leader",
          type: "leader",
        },
      ]
    },
    [playerScores],
  )

  const [step, setStep] = useAtom(roundTransitionStepAtom)
  const [index, setIndex] = useAtom(roundTransitionCarouselIndexAtom)
  const [direction, setDirection] = useState(0)
  const [, resetRoundTransitionStorage] = useAtom(resetRoundTransitionStorageAtom)

  const safeIndex = index >= 0 && index < slides.length ? index : 0
  const currentSlide = slides[safeIndex] ?? slides[0]
  const isLeaderSlideBackgroundVisible = step === "score" && currentSlide?.key === "leader"
  const reveal = useHoverReveal(isLeaderSlideBackgroundVisible, 0)
  const hideUi = isLeaderSlideBackgroundVisible && !reveal.hovered

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

  const onPaginate = (nextDirection: number) => {
    reveal.reset()
    paginate(nextDirection)
  }

  const onSelect = (nextIndex: number) => {
    reveal.reset()
    selectSlide(nextIndex)
  }

  const goNextStep = () => {
    setStep("confirm")
  }

  return {
    slides,
    step,
    index: safeIndex,
    direction,
    hideUi,
    onPaginate,
    onSelect,
    goNextStep,
    handleConfirm,
    handleExitToSetup,
    isLeaderSlideBackgroundVisible,
    onMouseEnter: reveal.onEnter,
    onMouseLeave: reveal.onLeave,
  }
}
