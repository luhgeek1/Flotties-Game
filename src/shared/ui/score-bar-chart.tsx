import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart"

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

const CHART_TEXT_COLOR = "#f4f4f5"
const PLAYER_LABEL_FONT_SIZE = 14
const PLAYER_LABEL_FONT_WEIGHT = 700
const SCORE_LABEL_FONT_SIZE = 13
const SCORE_LABEL_FONT_WEIGHT = 700
const PLAYER_LABEL_X_PADDING = 16
const SCORE_LABEL_X_OFFSET = 16
const SCORE_LABEL_MIN_GAP_FROM_PLAYER_LABEL = 14
const DEFAULT_SCORE_LABEL_MIN_OFFSET = 110

const chartConfig = {
  displayScore: {
    label: "Score",
    color: "#3b82f6",
  },
  score: {
    label: "Score",
    color: "#3b82f6",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

type BarLabelProps = {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  value?: number | string
  payload?: {
    score?: number
    displayScore?: number
    scoreLabelMinOffset?: number
    label?: string
  }
}

function toNumber(value: number | string | undefined): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return Number(value)
  return 0
}

function estimateTextWidth(text: string, fontSize: number, fontWeight: number): number {
  if (!text) return 0

  const weightFactor = fontWeight >= 700 ? 0.62 : fontWeight >= 600 ? 0.6 : 0.58
  return text.length * fontSize * weightFactor
}

function renderPlayerLabel(props: BarLabelProps) {
  const x = toNumber(props.x)
  const y = toNumber(props.y)
  const height = toNumber(props.height)
  const label = String(props.value ?? "")

  return (
    <text
      x={x + PLAYER_LABEL_X_PADDING}
      y={y + height / 2}
      dy={5}
      fill={CHART_TEXT_COLOR}
      fontSize={PLAYER_LABEL_FONT_SIZE}
      fontWeight={PLAYER_LABEL_FONT_WEIGHT}
      style={{
        paintOrder: "stroke",
        stroke: "rgb(2 6 23 / 0.55)",
        strokeWidth: 2,
      }}
    >
      {label}
    </text>
  )
}

function renderScoreLabel(props: BarLabelProps) {
  const x = toNumber(props.x)
  const y = toNumber(props.y)
  const width = toNumber(props.width)
  const height = toNumber(props.height)
  const score = Number(props.value ?? props.payload?.score ?? 0)
  const scoreText = String(score)
  const scoreLabelMinOffset = toNumber(props.payload?.scoreLabelMinOffset) || DEFAULT_SCORE_LABEL_MIN_OFFSET

  const naturalScoreX = x + width + SCORE_LABEL_X_OFFSET
  const minSafeScoreX = x + scoreLabelMinOffset
  const scoreLabelX = Math.max(naturalScoreX, minSafeScoreX)

  return (
    <text
      x={scoreLabelX}
      y={y + height / 2}
      dy={5}
      fill={CHART_TEXT_COLOR}
      fontSize={SCORE_LABEL_FONT_SIZE}
      fontWeight={SCORE_LABEL_FONT_WEIGHT}
      style={{
        paintOrder: "stroke",
        stroke: "rgb(2 6 23 / 0.65)",
        strokeWidth: 2,
      }}
    >
      {scoreText}
    </text>
  )
}

export function ScoreBarChart({
  title = "Общий счет игроков",
  items,
  emptyStateText = "Нет данных для отображения",
}: ScoreBarChartProps) {
  if (!items.length) {
    return (
      <div className="w-full h-55 flex flex-col items-center justify-center rounded-lg border border-white/10 bg-slate-950/70 px-4 text-center">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        <p className="mt-3 text-sm text-zinc-300">{emptyStateText}</p>
      </div>
    )
  }

  const chartData = items.map(item => ({
    id: item.id,
    label: item.label,
    score: item.value,
    displayScore: Math.max(item.value, 0),
  }))
  const maxPlayerLabelWidth = Math.max(
    ...chartData.map(item => estimateTextWidth(item.label, PLAYER_LABEL_FONT_SIZE, PLAYER_LABEL_FONT_WEIGHT)),
  )
  const scoreLabelMinOffset = Math.ceil(
    PLAYER_LABEL_X_PADDING + maxPlayerLabelWidth + SCORE_LABEL_MIN_GAP_FROM_PLAYER_LABEL,
  )
  const chartDataWithLayout = chartData.map(item => ({
    ...item,
    scoreLabelMinOffset,
  }))
  const maxScoreLabelLength = Math.max(...chartData.map(item => String(item.score).length))
  const scoreLabelsRightPadding = Math.max(
    64,
    Math.ceil(maxScoreLabelLength * SCORE_LABEL_FONT_SIZE * 0.62) + 32,
  )

  return (
    <Card className="w-full h-55 py-3 gap-3 border-white/10 bg-slate-950/70 text-zinc-100 shadow-none">
      <CardHeader className="px-4 py-0">
        <CardTitle className="text-center text-sm font-semibold text-zinc-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-3">
        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
          <BarChart
            accessibilityLayer
            data={chartDataWithLayout}
            layout="vertical"
            margin={{
              right: scoreLabelsRightPadding,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="displayScore" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="displayScore"
              layout="vertical"
              fill="var(--color-score)"
              radius={4}
            >
              <LabelList
                dataKey="label"
                content={renderPlayerLabel}
              />
              <LabelList
                dataKey="score"
                content={renderScoreLabel}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
