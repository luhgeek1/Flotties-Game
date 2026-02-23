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
              right: 22,
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
                position="insideLeft"
                offset={8}
                className="fill-white font-bold"
                style={{
                  paintOrder: "stroke",
                  stroke: "rgb(15 23 42 / 0.35)",
                  strokeWidth: 2,
                }}
                fontSize={14}
              />
              <LabelList
                dataKey="score"
                position="right"
                offset={8}
                className="fill-foreground font-semibold"
                fontSize={13}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
