"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: number | string
  index: number
  trend?: "up" | "down"
  icon?: React.ReactNode
  description?: string
  change?: string
}

export function KpiCard({ 
  title, 
  value, 
  index, 
  trend, 
  icon, 
  description, 
  change
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group w-full"
    >
      <Card className="relative overflow-hidden transition-all hover:shadow-md border-beige-dark">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && (
            <div className="rounded-full bg-navy/10 p-2 text-navy transition-colors group-hover:bg-navy/20">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold tracking-tight">{value}</div>
              {trend && (
                <span 
                  className={cn(
                    "text-xs font-medium flex items-center",
                    trend === "up" ? "text-success" : "text-destructive"
                  )}
                >
                  {trend === "up" ? "↑" : "↓"}
                  {change && <span className="ml-0.5">{change}</span>}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
