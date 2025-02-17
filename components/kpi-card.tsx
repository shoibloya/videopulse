"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: number | string
  index: number
  trend?: "up" | "down"
  icon?: React.ReactNode
}

export function KpiCard({ title, value, index, trend, icon }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group w-full max-w-xs"
    >
      {/* Add relative so the gradient absolutely positions within the card */}
      <Card className="relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
        {/* pointer-events-none ensures the overlay doesn't block the card hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && (
            <div className="rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {trend && (
              <span className={`text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                {trend === "up" ? "↑" : "↓"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
