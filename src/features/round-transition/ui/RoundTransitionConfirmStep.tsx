import { ArrowRight, LogOut, Trophy } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/shared/components/ui/button"

import { roundTransitionStepVariants } from "../model/constants"

type RoundTransitionConfirmStepProps = {
  roundNumber: number
  hasNextRound: boolean
  onConfirm: () => void
  onExitToSetup: () => void
}

export function RoundTransitionConfirmStep({
  roundNumber,
  hasNextRound,
  onConfirm,
  onExitToSetup,
}: RoundTransitionConfirmStepProps) {
  const title = hasNextRound
    ? `Раунд ${roundNumber} пройден!`
    : `Раунд ${roundNumber} завершен!`
  const description = hasNextRound
    ? `Вы показали отличные результаты. Готовы перейти к ${roundNumber + 1} раунду?`
    : "Оооооооооо...ГОТОВЫ К ФИНАЛУУУУУУ???"
  const confirmLabel = hasNextRound
    ? `${roundNumber + 1} раунд`
    : "Финал"

  return (
    <motion.div
      variants={roundTransitionStepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-8">
        <div className="p-6 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          <Trophy className="size-14" />
        </div>

        <div className="space-y-4 max-w-lg">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 h-12"
            onClick={onExitToSetup}
          >
            <LogOut className="mr-2 size-5" />
            Покинуть игру
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1 h-12"
            onClick={onConfirm}
          >
            {confirmLabel} <ArrowRight className=" size-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
