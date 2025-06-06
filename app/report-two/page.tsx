"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Search,
  Shield,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  Code2,
} from "lucide-react"
import { motion } from "framer-motion"

// LLM Vulnerabilities data
const keywords = [
  { keyword: "what are common LLM vulnerabilities", ranking: "-1" },
  { keyword: "how to detect LLM vulnerabilities", ranking: "-1" },
  { keyword: "examples of LLM vulnerabilities in AI", ranking: "-1" },
  { keyword: "LLM vulnerabilities in enterprise applications", ranking: "1" },
  { keyword: "LLM vulnerabilities and mitigation strategies", ranking: "1" },
  { keyword: "LLM vulnerabilities in chatbot systems", ranking: "1" },
  { keyword: "LLM vulnerabilities in business automation", ranking: "1" },
  { keyword: "real world cases of LLM vulnerabilities", ranking: "1" },
  { keyword: "LLM vulnerabilities risk assessment", ranking: "1" },
  { keyword: "how to prevent LLM vulnerabilities", ranking: "1" },
  { keyword: "LLM vulnerabilities and data leaks", ranking: "-1" },
  { keyword: "LLM vulnerabilities in coding assistants", ranking: "1" },
  { keyword: "LLM vulnerabilities and compliance risks", ranking: "1" },
  { keyword: "LLM vulnerabilities in automated tools", ranking: "-1" },
  { keyword: "LLM vulnerabilities in AI security", ranking: "-1" },
  { keyword: "LLM vulnerabilities and prompt injection", ranking: "-1" },
  { keyword: "LLM vulnerabilities and output handling", ranking: "2" },
  { keyword: "LLM vulnerabilities in cloud applications", ranking: "1" },
  { keyword: "LLM vulnerabilities and enterprise best practices", ranking: "2" },
]

// Organize keywords into clusters
const clusters = [
  {
    title: "Enterprise Applications",
    items: [
      "LLM vulnerabilities in enterprise applications",
      "LLM vulnerabilities in business automation",
      "LLM vulnerabilities and compliance risks",
      "LLM vulnerabilities and enterprise best practices",
      "LLM vulnerabilities in cloud applications",
    ],
    ranking: ["1", "1", "1", "2", "1"],
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Security & Mitigation",
    items: [
      "LLM vulnerabilities and mitigation strategies",
      "how to prevent LLM vulnerabilities",
      "LLM vulnerabilities risk assessment",
      "LLM vulnerabilities in AI security",
    ],
    ranking: ["1", "1", "1", "-1"],
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Implementation Contexts",
    items: [
      "LLM vulnerabilities in chatbot systems",
      "LLM vulnerabilities in coding assistants",
      "LLM vulnerabilities in automated tools",
    ],
    ranking: ["1", "1", "-1"],
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "Fundamentals & Detection",
    items: [
      "what are common LLM vulnerabilities",
      "how to detect LLM vulnerabilities",
      "examples of LLM vulnerabilities in AI",
    ],
    ranking: ["-1", "-1", "-1"],
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "Specific Vulnerability Types",
    items: [
      "LLM vulnerabilities and data leaks",
      "LLM vulnerabilities and prompt injection",
      "LLM vulnerabilities and output handling",
    ],
    ranking: ["-1", "-1", "2"],
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    title: "Real-World Applications",
    items: ["real world cases of LLM vulnerabilities"],
    ranking: ["1"],
    icon: <FileText className="h-5 w-5" />,
  },
]

const contentPlan = [
  {
    title: "LLM Vulnerabilities Fundamentals Guide",
    objectives: [
      "Comprehensive overview of common LLM vulnerabilities and detection methods.",
      "Visual taxonomy of vulnerability types with real examples.",
      "Page length: 2,500+ words with interactive diagrams.",
    ],
    reasoning:
      "All fundamental and detection keywords are currently at position -1. This represents our biggest opportunity gap, as these are likely high-volume informational queries that serve as entry points to the topic.",
    relatedKeywords: [
      "what are common LLM vulnerabilities",
      "how to detect LLM vulnerabilities",
      "examples of LLM vulnerabilities in AI",
    ],
    currentRanking: "Position -1",
  },
  {
    title: "Prompt Injection & Data Leakage Deep-Dive",
    objectives: [
      "Technical analysis of prompt injection vulnerabilities with code examples.",
      "Data leakage prevention strategies and implementation guides.",
      "Page length: 1,800+ words with security checklists.",
    ],
    reasoning:
      "Specific vulnerability types like prompt injection and data leaks are ranking poorly (-1), despite having strong rankings for mitigation strategies. This content bridges that gap by connecting specific vulnerabilities to our existing mitigation content.",
    relatedKeywords: [
      "LLM vulnerabilities and prompt injection",
      "LLM vulnerabilities and data leaks",
      "LLM vulnerabilities and output handling",
    ],
    currentRanking: "Mixed (-1 to 2)",
  },
  {
    title: "LLM Security in Automated Tools & AI Systems",
    objectives: [
      "Security frameworks for AI-powered automation tools.",
      "Implementation guides for securing AI systems against LLM vulnerabilities.",
      "Page length: 2,000+ words with case studies and code samples.",
    ],
    reasoning:
      "We have strong rankings for enterprise applications and business automation (position 1), but poor rankings for automated tools and AI security (-1). This content leverages our enterprise strengths while addressing the technical implementation gaps.",
    relatedKeywords: [
      "LLM vulnerabilities in automated tools",
      "LLM vulnerabilities in AI security",
      "LLM vulnerabilities in business automation",
    ],
    currentRanking: "Mixed (-1 to 1)",
  },
]

// Calculate statistics
const totalKeywords = keywords.length
const page1Rankings = keywords.filter((kw) => kw.ranking === "1").length
const page2Rankings = keywords.filter((kw) => kw.ranking === "2").length
const negativeRankings = keywords.filter((kw) => kw.ranking === "-1").length

const rankingPercentage = Math.round((page1Rankings / totalKeywords) * 100)

export default function Page() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
          {/* Header */}
          <motion.div className="text-center space-y-4" variants={fadeIn}>
            <h1 className="text-4xl font-bold tracking-tight">LLM Vulnerabilities SEO Analysis</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keyword performance analysis and content strategy for improving visibility in the LLM security space
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalKeywords}</div>
                <p className="text-xs text-muted-foreground">Across 6 topic clusters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Page 1 Rankings</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{page1Rankings}</div>
                <div className="flex items-center">
                  <Progress value={rankingPercentage} className="h-2 w-full" />
                  <span className="ml-2 text-xs text-muted-foreground">{rankingPercentage}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Page 2 Rankings</CardTitle>
                <Minus className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{page2Rankings}</div>
                <p className="text-xs text-muted-foreground">Opportunity for improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Negative Rankings</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{negativeRankings}</div>
                <p className="text-xs text-muted-foreground">Requires immediate attention</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={fadeIn}>
            <Tabs defaultValue="clusters" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="clusters">Keyword Clusters</TabsTrigger>
                <TabsTrigger value="insights">Strengths & Weaknesses</TabsTrigger>
                <TabsTrigger value="content">Content Plan</TabsTrigger>
              </TabsList>

              {/* Keyword Clusters Tab */}
              <TabsContent value="clusters" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clusters.map((cluster, idx) => (
                    <motion.div
                      key={cluster.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">{cluster.icon}</div>
                              <CardTitle className="text-base">{cluster.title}</CardTitle>
                            </div>
                            <Badge
                              variant={
                                cluster.ranking.every((r) => r === "1")
                                  ? "default"
                                  : cluster.ranking.some((r) => r === "-1")
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {cluster.ranking.every((r) => r === "1")
                                ? "Strong"
                                : cluster.ranking.every((r) => r === "-1")
                                  ? "Weak"
                                  : "Mixed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {cluster.items.map((kw, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                            >
                              <span className="truncate mr-2">{kw}</span>
                              <div className="flex items-center">
                                {cluster.ranking[i] === "1" ? (
                                  <Badge
                                    variant="success"
                                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                                  >
                                    P1
                                  </Badge>
                                ) : cluster.ranking[i] === "2" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                                  >
                                    P2
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">-1</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Strengths & Weaknesses Tab */}
              <TabsContent value="insights">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <CardTitle>Strengths</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Enterprise Implementation</h3>
                        <p className="text-sm text-muted-foreground">
                          Strong Page 1 rankings for enterprise applications, business automation, and
                          compliance-related keywords.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Mitigation & Prevention</h3>
                        <p className="text-sm text-muted-foreground">
                          Dominant position for mitigation strategies, prevention techniques, and risk assessment
                          keywords.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Specific Implementation Contexts</h3>
                        <p className="text-sm text-muted-foreground">
                          Page 1 rankings for chatbot systems and coding assistants implementation contexts.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-rose-500">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-rose-500" />
                        <CardTitle>Weaknesses</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Fundamentals Gap</h3>
                        <p className="text-sm text-muted-foreground">
                          All fundamental keywords (common vulnerabilities, detection, examples) have negative rankings.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Specific Vulnerability Types</h3>
                        <p className="text-sm text-muted-foreground">
                          Poor rankings for specific vulnerability types like prompt injection and data leaks.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Technical Implementation</h3>
                        <p className="text-sm text-muted-foreground">
                          Negative rankings for automated tools and AI security implementation contexts.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Content Plan Tab */}
              <TabsContent value="content">
                <div className="space-y-6">
                  {contentPlan.map((plan, idx) => (
                    <motion.div
                      key={plan.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{plan.title}</CardTitle>
                            <Badge
                              variant={plan.currentRanking.includes("-1") ? "destructive" : "outline"}
                              className="ml-2"
                            >
                              {plan.currentRanking}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <h3 className="text-sm font-medium mb-3">Objectives</h3>
                              <ul className="space-y-2">
                                {plan.objectives.map((objective, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-sm">{objective}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium mb-2">Data-Driven Reasoning</h3>
                                <p className="text-sm text-muted-foreground">{plan.reasoning}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium mb-2">Target Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                  {plan.relatedKeywords.map((keyword, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
