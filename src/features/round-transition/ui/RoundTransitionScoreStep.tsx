import { ArrowRight, Crown } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/shared/components/ui/button"
import { ScoreBarChart } from "@/shared/ui"

import { roundTransitionStepVariants } from "../model/constants"
import type { RoundTransitionScoreSlide } from "../model/types"
import { RoundTransitionCarousel } from "./RoundTransitionCarousel"

type MvpSlideProps = {
  player: { name: string; score: number } | null
}

function MvpSlide({ player }: MvpSlideProps) {
  if (!player) {
    return (
      <div className="w-full h-55 flex flex-col items-center justify-center bg-muted/20 rounded-lg border border-border/70 px-6 text-center">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          MVP
        </h3>
        <p className="text-muted-foreground">Нет данных</p>
      </div>
    )
  }

  return (
    <div className="w-full h-55 flex flex-col items-center justify-center bg-muted/20 rounded-lg border border-border/70 px-6 text-center">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        MVP
      </h3>

      <div className="flex items-center justify-center gap-3">
        <div className="text-3xl sm:text-4xl font-black tracking-tight">
          {player.name}
        </div>
        <Crown className="size-8 text-amber-500" />
      </div>

      <div
        className={[
          "mt-6 text-6xl sm:text-7xl font-black tracking-tight tabular-nums",
          player.score < 0 ? "text-destructive" : "text-foreground",
        ].join(" ")}
      >
        {player.score}
      </div>
    </div>
  )
}

type RoundTransitionScoreStepProps = {
  slides: ReadonlyArray<RoundTransitionScoreSlide>
  index: number
  direction: number
  hideUi?: boolean
  onPaginate: (direction: number) => void
  onSelect: (index: number) => void
  onContinue: () => void
}

export function RoundTransitionScoreStep({
  slides,
  index,
  direction,
  hideUi = false,
  onPaginate,
  onSelect,
  onContinue,
}: RoundTransitionScoreStepProps) {
  const carouselSlides = slides.map(slide => {
    if (slide.type === "score") {
      return {
        key: slide.key,
        content: (
          <ScoreBarChart
            title="Прогресс по игрокам"
            items={slide.items}
          />
        ),
      }
    }

    if (slide.type === "mvp") {
      return {
        key: slide.key,
        content: <MvpSlide player={slide.player} />,
      }
    }

    return {
      key: slide.key,
      content: <div className="w-full h-55" aria-label="Поздравительный фон" />,
    }
  })

  return (
    <motion.div
      variants={roundTransitionStepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      <div className="flex flex-col items-center w-full">
        <RoundTransitionCarousel
          slides={carouselSlides}
          index={index}
          direction={direction}
          onPaginate={onPaginate}
          onSelect={onSelect}
          hideUi={hideUi}
        />
        <div
          className={[
            "relative z-20 mt-6 flex justify-center w-full transition-opacity duration-200",
            hideUi ? "opacity-0 pointer-events-none" : "opacity-100",
          ].join(" ")}
        >
          <Button
            type="button"
            size="lg"
            className="px-12 text-lg h-12"
            onClick={onContinue}
          >
            Продолжить <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
