import confetti from "canvas-confetti"
import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"

import lottiCongrImage from "@/shared/assets/lotti_congr.png"
import {
  roundTransitionConfettiDefaults,
  roundTransitionConfettiOrigins,
  roundTransitionHeadingByStep,
  roundTransitionLottiZoom,
} from "../model/constants"

import type { RoundTransitionModalProps } from "../model/types"
import { useRoundTransitionModel } from "../model/useRoundTransitionModel"
import { RoundTransitionConfirmStep } from "./RoundTransitionConfirmStep"
import { RoundTransitionScoreStep } from "./RoundTransitionScoreStep"

export function RoundTransitionModal({
  isOpen,
  roundNumber,
  hasNextRound,
  ...props
}: RoundTransitionModalProps) {
  const model = useRoundTransitionModel({
    isOpen,
    roundNumber,
    hasNextRound,
    ...props,
  })

  useEffect(() => {
    if (!isOpen)
      return

    roundTransitionConfettiOrigins.forEach(origin => { confetti({ ...roundTransitionConfettiDefaults, origin, })})
  }, [isOpen])

  if (!isOpen)
    return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{
            opacity: 1,
            scale: model.isLeaderSlideBackgroundVisible ? roundTransitionLottiZoom.modalScale : 1,
            y: 0,
            transition: model.isLeaderSlideBackgroundVisible ? roundTransitionLottiZoom.transition : { type: "spring", stiffness: 300, damping: 25 },
          }}
          exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl"
          onMouseEnter={model.onMouseEnter}
          onMouseLeave={model.onMouseLeave}
        >
          <AnimatePresence>
            {model.isLeaderSlideBackgroundVisible ? (
              <motion.div
                key="leader-slide-background"
                className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${lottiCongrImage})` }}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1}}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={roundTransitionLottiZoom.transition}
              />
            ) : null}
          </AnimatePresence>

          <div className="relative z-10 flex items-center justify-center px-6 pt-10 pb-4">
            {model.isLeaderSlideBackgroundVisible ? null : (
              <h2 className="text-center text-4xl font-extrabold tracking-tight">
                {roundTransitionHeadingByStep[model.step]}
              </h2>
            )}
          </div>

          <div className="relative z-10 px-4 sm:px-16 pb-10 pt-2 min-h-95">
            <AnimatePresence mode="wait">
              {model.step === "score" ? (
                <RoundTransitionScoreStep
                  key="score"
                  slides={model.slides}
                  index={model.index}
                  direction={model.direction}
                  hideUi={model.hideUi}
                  onPaginate={model.onPaginate}
                  onSelect={model.onSelect}
                  onContinue={model.goNextStep}
                />
              ) : (
                <RoundTransitionConfirmStep
                  key="confirm"
                  roundNumber={roundNumber}
                  hasNextRound={hasNextRound}
                  onConfirm={model.handleConfirm}
                  onExitToSetup={model.handleExitToSetup}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
