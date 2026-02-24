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

const chartConfig = {
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
    label?: string
  }
}

function toNumber(value: number | string | undefined): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return Number(value)
  return 0
}

function renderPlayerLabel(props: BarLabelProps) {
  const x = toNumber(props.x)
  const y = toNumber(props.y)
  const height = toNumber(props.height)
  const score = Number(props.payload?.score ?? 0)
  const label = String(props.value ?? "")
  const isPositiveScore = score > 0

  return (
    <text
      x={x + 16}
      y={y + height / 2}
      dy={5}
      fill={isPositiveScore ? "#ffffff" : "rgb(71 85 105)"}
      fontSize={14}
      fontWeight={700}
      style={isPositiveScore
        ? {
          paintOrder: "stroke",
          stroke: "rgb(15 23 42 / 0.35)",
          strokeWidth: 2,
        }
        : undefined}
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
  const labelLength = String(props.payload?.label ?? "").length
  const zeroScoreOffset = Math.max(88, labelLength * 11 + 24)
  const offset = score === 0 ? zeroScoreOffset : 16

  return (
    <text
      x={x + width + offset}
      y={y + height / 2}
      dy={5}
      fill="hsl(var(--foreground))"
      fontSize={13}
      fontWeight={600}
    >
      {score}
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
      <div className="w-full h-55 flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-4 text-center">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{emptyStateText}</p>
      </div>
    )
  }

  const chartData = items.map(item => ({
    id: item.id,
    label: item.label,
    score: item.value,
  }))
  const maxScoreLabelLength = Math.max(...chartData.map(item => String(item.score).length))
  const scoreLabelsRightPadding = Math.max(46, maxScoreLabelLength * 11 + 20)

  return (
    <Card className="w-full h-55 py-3 gap-3 border-border/60 shadow-none">
      <CardHeader className="px-4 py-0">
        <CardTitle className="text-center text-sm font-semibold text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-3">
        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
          <BarChart
            accessibilityLayer
            data={chartData}
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
            <XAxis dataKey="score" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="score"
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
