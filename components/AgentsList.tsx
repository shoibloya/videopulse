"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { motion } from "framer-motion"
import { Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Importing Button from shadcn
import { Skeleton } from "@/components/ui/skeleton"
import type { Agent } from "@/lib/agents"
import Link from "next/link" // Importing Link for navigation

export default function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch("/api/agents")
        const data: Agent[] = await res.json()
        setAgents(data)
      } catch (error) {
        console.error("Failed to fetch agents:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  const readyAgents = agents.filter((a) => a.status === "ready")
  const upcomingAgents = agents.filter((a) => a.status === "upcoming")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return <AgentsListSkeleton />
  }

  return (
    <div className="py-8">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Ready Agents Section */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Ready Agents</h2>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
            {readyAgents.map((agent) => (
              <motion.div key={agent.id} variants={item}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="relative">
                    {/* Absolute badge on top right */}
                    <Badge variant="default" className="absolute top-2 right-2 bg-primary">
                      Ready
                    </Badge>
                    <div className="flex items-center gap-6">
                      <div>
                        <CardTitle>{agent.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{agent.purpose}</p>
                      </div>
                      {agent.widgetId && (
                        <div className="flex-shrink-0">
                          <elevenlabs-convai
                            agent-id={agent.widgetId}
                            style={{ position: "static", width: "300px", maxWidth: "300px" }}
                          />
                          <Script
                            src="https://elevenlabs.io/convai-widget/index.js"
                            strategy="afterInteractive"
                            async
                            type="text/javascript"
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {agent.type === "newpage" && agent.slug && (
                      <Link href={agent.slug} target="_blank" passHref>
                        <Button className="mt-4">Open</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Upcoming Agents Section */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Upcoming Agents</h2>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
            {upcomingAgents.map((agent) => (
              <motion.div key={agent.id} variants={item}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="relative">
                    {/* Absolute badge on top right */}
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      Coming Soon
                    </Badge>
                    <div className="space-y-1">
                      <CardTitle>{agent.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{agent.purpose}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Available on: {agent.upcomingDate}</p>
                      <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                        <p className="text-sm text-muted-foreground">Preview Coming Soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  )
}

function AgentsListSkeleton() {
  return (
    <div className="py-8">
      <div className="grid gap-12 md:grid-cols-2">
        <section>
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
