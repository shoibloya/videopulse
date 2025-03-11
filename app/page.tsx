// app/page.tsx
"use client"

import { motion } from "framer-motion"
import { KpiCard } from "@/components/kpi-card"
import { KeywordsTable } from "@/components/keywords-table"
import { BacklinksTable } from "@/components/backlinks-table"
import { TrafficChart } from "@/components/traffic-chart"
import { Activity, Link2, Search, Share2, Users } from "lucide-react"
import RealtimeGreeting from "@/components/RealtimeGreeting"
import AgentsList from "@/components/AgentsList" // import your new component
import TaskCalendar from "@/components/TaskCalendar";

export default function DownloadPage() {
  // Example KPI data
  const kpiData = [
    { title: "DR", value: 0, icon: <Activity className="h-4 w-4" /> },
    { title: "UR", value: 0, icon: <Users className="h-4 w-4" /> },
    { title: "Backlinks", value: 7, icon: <Link2 className="h-4 w-4" /> },
    { title: "Ref. Domains", value: 7, icon: <Share2 className="h-4 w-4" /> },
    { title: "Organic Traffic", value: 0, icon: <Search className="h-4 w-4" /> },
  ]

  // Hard-coded keywords data
  const keywordsData = [
    
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto flex flex-col space-y-8 px-4 py-8 md:px-6 lg:px-8">
        {/* Dashboard Title */}
        <div className="flex flex-col gap-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            Ladon Translation Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Track your website&apos;s performance and SEO metrics
          </motion.p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 justify-items-center">
          {kpiData.map((kpi, index) => (
            <KpiCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              index={index}
            />
          ))}
        </div>

        

        <TrafficChart />
        {/* Agents Section */}
        <AgentsList />
        <TaskCalendar />

        {/* Content Below KPIs */}
        <div className="grid gap-8">
          {/* Keywords Table */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-center">Keywords</h2>
            <KeywordsTable data={keywordsData} />
          </div>

          {/* Backlinks Table with Pagination */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-center">Backlinks</h2>
            <BacklinksTable />
          </div>
        </div>
      </div>
    </div>
  )
}
