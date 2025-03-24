"use client"

import { useState, useEffect, useRef } from "react"
import Script from "next/script"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Clock, CheckCircle, AlertCircle, ChevronRight, Sparkles, Bot, Calendar, RefreshCw, Loader2, Star, MessageSquare, Zap, FileText, Database, Code, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Agent } from "@/lib/agents"
import Link from "next/link"

// Agent type categories with colors
const AGENT_TYPES = {
  "ai-assistant": { 
    label: "AI Assistant", 
    color: "bg-blue-500",
    icon: <MessageSquare className="h-3.5 w-3.5" />
  },
  "data-analyzer": { 
    label: "Data Analyzer", 
    color: "bg-purple-500",
    icon: <Database className="h-3.5 w-3.5" />
  },
  "content-creator": { 
    label: "Content Creator", 
    color: "bg-pink-500",
    icon: <FileText className="h-3.5 w-3.5" />
  },
  "research": { 
    label: "Research", 
    color: "bg-amber-500",
    icon: <Lightbulb className="h-3.5 w-3.5" />
  },
  "automation": { 
    label: "Automation", 
    color: "bg-emerald-500",
    icon: <Zap className="h-3.5 w-3.5" />
  },
  "newpage": { 
    label: "Interactive", 
    color: "bg-cyan-500",
    icon: <Code className="h-3.5 w-3.5" />
  },
  "default": { 
    label: "Agent", 
    color: "bg-slate-500",
    icon: <Bot className="h-3.5 w-3.5" />
  }
};

export default function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch agents data
  useEffect(() => {
    fetchAgents()
  }, [])

  // Separate ready and upcoming agents
  const readyAgents = agents.filter(agent => agent.status === "ready")
  const upcomingAgents = agents.filter(agent => agent.status === "upcoming")

  async function fetchAgents() {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch("/api/agents")
      if (!res.ok) throw new Error("Failed to fetch agents")
      
      const data: Agent[] = await res.json()
      setAgents(data)
    } catch (error) {
      console.error("Failed to fetch agents:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const refreshAgents = async () => {
    setIsRefreshing(true)
    await fetchAgents()
    setTimeout(() => setIsRefreshing(false), 600) // Add a small delay for animation
  }

  // Animation variants
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
    <div className="w-full space-y-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">AI Agents</h2>
          <Badge variant="outline" className="ml-2 font-normal">
            {agents.length} total
          </Badge>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={refreshAgents}
                disabled={loading || isRefreshing}
                className="relative overflow-hidden"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {/* Ripple effect on hover */}
                    <span className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity hover:opacity-100 rounded-md" />
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh agents</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Error state */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4"
        >
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Failed to load agents</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchAgents}>
            Try again
          </Button>
        </motion.div>
      )}

      {/* Ready Agents Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-full">
            <CheckCircle className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">Ready Agents</h3>
          <Badge variant="outline" className="ml-1 font-normal">
            {readyAgents.length}
          </Badge>
        </div>
        
        {readyAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center border rounded-lg bg-muted/30">
            <div className="bg-primary/10 rounded-full p-2 mb-3">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">No ready agents available.</p>
          </div>
        ) : (
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="grid gap-4"
          >
            {readyAgents.map((agent, index) => (
              <motion.div key={agent.id} variants={item}>
                <Card className="transition-all hover:shadow-md border-primary/20 overflow-hidden group">
                  <CardHeader className="relative pb-3">
                    {/* Status indicator */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
                    
                    {/* Absolute badge on top right */}
                    <Badge variant="default" className="absolute top-3 right-3 bg-primary">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Ready
                    </Badge>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {agent.name}
                          {agent.isNew && (
                            <span className="ml-2 inline-flex items-center">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{agent.purpose}</p>
                        
                        {/* Agent type and tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {agent.type && (
                            <Badge 
                              variant="outline" 
                              className={`${AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]?.color || AGENT_TYPES.default.color} text-white text-xs flex items-center gap-1`}
                            >
                              {AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]?.icon || AGENT_TYPES.default.icon}
                              {AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]?.label || AGENT_TYPES.default.label}
                            </Badge>
                          )}
                          
                          {agent.isNew && (
                            <Badge variant="outline" className="bg-amber-500 text-white text-xs">
                              <Sparkles className="mr-1 h-3 w-3" />
                              New
                            </Badge>
                          )}
                          
                          {agent.tags && agent.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Widget container */}
                      {agent.widgetId && (
                        <div className="flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/5 pointer-events-none z-10" />
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
                  
                  <CardContent className="pt-0">
                    {agent.type === "newpage" && agent.slug && (
                      <Link href={agent.slug} target="_blank" passHref>
                        <Button className="mt-3 w-full group bg-primary/90 hover:bg-primary">
                          Open Agent
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Upcoming Agents Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-muted/50 p-1 rounded-full">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">Upcoming Agents</h3>
          <Badge variant="outline" className="ml-1 font-normal">
            {upcomingAgents.length}
          </Badge>
        </div>
        
        {upcomingAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center border rounded-lg bg-muted/30">
            <div className="bg-muted rounded-full p-2 mb-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No upcoming agents available.</p>
          </div>
        ) : (
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="grid gap-4"
          >
            {upcomingAgents.map((agent, index) => (
              <motion.div key={agent.id} variants={item}>
                <Card className="transition-all hover:shadow-sm border-muted group">
                  <CardHeader className="relative pb-3">
                    {/* Status indicator */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted via-muted/80 to-muted/50" />
                    
                    {/* Absolute badge on top right */}
                    <Badge variant="secondary" className="absolute top-3 right-3">
                      <Clock className="mr-1 h-3 w-3" />
                      Coming Soon
                    </Badge>
                    
                    <div className="space-y-1">
                      <CardTitle className="text-lg group-hover:text-muted-foreground/80 transition-colors">
                        {agent.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{agent.purpose}</p>
                      
                      {/* Agent type and tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {agent.type && (
                          <Badge 
                            variant="outline" 
                            className={`${AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]?.color || AGENT_TYPES.default.color} text-white text-xs opacity-70 flex items-center gap-1`}
                          >
                            {AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]?.icon || AGENT_TYPES.default.icon}
                            {AGENT_TYPES[agent.type as keyof typeof AGENT_TYPES]?.label || AGENT_TYPES.default.label}
                          </Badge>
                        )}
                        
                        {agent.tags && agent.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs opacity-70">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {agent.upcomingDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Available on: {agent.upcomingDate}</span>
                      </div>
                    )}
                    
                    <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 group-hover:bg-muted/70 transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">Preview Coming Soon</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" disabled>
                      <span className="opacity-70">Coming Soon</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}

function AgentsListSkeleton() {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-16 rounded-full ml-2" />
        </div>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-[300px] rounded-md" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-16 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
