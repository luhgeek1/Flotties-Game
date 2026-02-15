//помог codex в реализации ui 
import { motion } from "motion/react"

import { cn } from "@/shared/lib/utils"

export type ScoreBarChartItem = {
  id: string
  label: string
  value: number
  colorClassName?: string
}

type ScoreBarChartProps = {
  title?: string
  items: ScoreBarChartItem[]
  emptyStateText?: string
}

const defaultBarColors = [
  "bg-blue-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
] as const

export function ScoreBarChart({
  title = "Общий счет игроков",
  items,
  emptyStateText = "Нет данных для отображения",
}: ScoreBarChartProps) {
  if (!items.length) {
    return (
      <div className="w-full h-55 flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-4 text-center">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{emptyStateText}</p>
      </div>
    )
  }

  const maxPositiveValue = items.reduce((acc, item) => (
    item.value > acc ? item.value : acc
  ), 0)
  const safeMaxPositiveValue = Math.max(maxPositiveValue, 1)

  return (
    <div className="w-full h-55 flex flex-col">
      <h3 className="text-center text-sm font-semibold text-muted-foreground mb-3">
        {title}
      </h3>

      <div className="flex-1 min-h-0 space-y-3">
        {items.map((item, index) => {
          const hasPositiveBar = item.value > 0
          const ratio = hasPositiveBar ? item.value / safeMaxPositiveValue : 0
          const width = `${Math.max(8, Math.round(ratio * 100))}%`

          return (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_80px] items-center gap-3"
            >
              <div className="relative h-12">
                {hasPositiveBar ? (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.06 }}
                    className={cn(
                      "h-full rounded-md px-4 flex items-center",
                      item.colorClassName ?? defaultBarColors[index % defaultBarColors.length],
                    )}
                  >
                    <span className="text-sm font-semibold truncate text-white">
                      {item.label}
                    </span>
                  </motion.div>
                ) : (
                  <div className="h-full px-1 flex items-center">
                    <span className="text-sm font-medium text-muted-foreground truncate">
                      {item.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right text-lg font-bold tabular-nums">
                {item.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
