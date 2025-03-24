"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Label,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function TrafficGraph() {
  const data = [
    {
      month: "Month 1",
      traffic: 20,
      target: 20,
      baseline: 0,
      description: "Establish foundation",
      articles: 0,
      articlesLabel: "0 articles listed",
    },
    {
      month: "Month 2",
      traffic: 100,
      target: 100,
      baseline: 0,
      description: "First article on AI search engines",
      articles: 1,
      articlesLabel: "1 article listed",
    },
    {
      month: "Month 3",
      traffic: 300,
      target: 300,
      baseline: 0,
      description: "More articles on AI search engines",
      articles: 3,
      articlesLabel: "3 articles listed",
    },
  ]

  const chartConfig = {
    traffic: {
      label: "Google Visits",
      color: "hsl(var(--primary))",
    },
    baseline: {
      label: "Baseline (99% branded)",
      color: "hsl(var(--destructive))",
    },
  }

  return (
    <div className="w-full h-[400px]">
      <Alert className="mb-6 bg-destructive/10 border-destructive text-destructive">
        <AlertDescription className="flex items-center gap-2 font-medium">
          <Info className="h-5 w-5" />
          Current Situation: 99% of organic traffic comes from the branded keyword "cloudsine"
        </AlertDescription>
      </Alert>
      <ChartContainer config={chartConfig} className="h-full">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            label={{
              value: "Non-Branded Traffic via Google (Monthly)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <RechartsTooltip
            content={<ChartTooltipContent indicator="line" formatValue={(value) => `${value} visits`} />}
          />
          <ReferenceLine
            y={0}
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            label={{
              value: "Baseline: 99% branded",
              position: "insideBottomRight",
              fill: "hsl(var(--destructive))",
              fontSize: 12,
            }}
          />
          {/* Article annotations */}
          <ReferenceLine x={0} stroke="transparent">
            <Label value="0 articles listed" position="bottom" offset={10} fill="hsl(var(--muted-foreground))" />
          </ReferenceLine>
          <ReferenceLine x={1} stroke="transparent">
            <Label value="1 article listed" position="bottom" offset={10} fill="hsl(var(--muted-foreground))" />
          </ReferenceLine>
          <ReferenceLine x={2} stroke="transparent">
            <Label value="3 articles listed" position="bottom" offset={10} fill="hsl(var(--muted-foreground))" />
          </ReferenceLine>
          <Line
            type="monotone"
            dataKey="traffic"
            stroke="var(--color-traffic)"
            strokeWidth={3}
            dot={{ fill: "var(--color-traffic)", r: 6 }}
            activeDot={{ r: 8, fill: "var(--color-traffic)" }}
            animationDuration={1000}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
