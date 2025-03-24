"use client"

import { Badge } from "@/components/ui/badge"

export default function TrafficBlocks() {
  return (
    <div className="flex flex-col gap-4">
      <MilestoneCard
        month="Month 1"
        target="~20 visits via Google"
        description="Establish foundation to get traffic from non-branded keywords"
        articles={0}
        color="bg-success/10 border-success/50"
      />
      <MilestoneCard
        month="Month 2"
        target="~100 visits via Google"
        description="First article listing on AI search engines"
        articles={1}
        color="bg-warning/10 border-warning/50"
      />
      <MilestoneCard
        month="Month 3"
        target="~300 visits via Google"
        description="3 articles listed on AI search engines"
        articles={3}
        color="bg-primary/10 border-primary/50"
      />
    </div>
  )
}

function MilestoneCard({
  month,
  target,
  description,
  articles,
  color,
}: {
  month: string
  target: string
  description: string
  articles: number
  color: string
}) {
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{month}</h3>
        <Badge variant="secondary">{target}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-xs font-medium">Articles on AI search engines:</span>
        {articles > 0 ? (
          Array.from({ length: articles }).map((_, i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-primary" />
          ))
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </div>
    </div>
  )
}
