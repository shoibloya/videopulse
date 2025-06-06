"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  Code2,
  Lock,
  BookOpen,
  Layers,
} from "lucide-react"
import { motion } from "framer-motion"

// AI Security Frameworks data
const keywords = [
  { keyword: "AI Security Frameworks for enterprise risk management", ranking: "-1" },
  { keyword: "How to implement AI Security Frameworks", ranking: "-1" },
  { keyword: "Understanding AI Security Frameworks", ranking: "1" },
  { keyword: "AI Security Frameworks comparison guide", ranking: "-1" },
  { keyword: "AI Security Frameworks for compliance requirements", ranking: "-1" },
  { keyword: "AI Security Frameworks and regulatory standards", ranking: "-1" },
  { keyword: "AI Security Frameworks for large language models", ranking: "1" },
  { keyword: "AI Security Frameworks for generative AI", ranking: "-1" },
  { keyword: "AI Security Frameworks for software developers", ranking: "-1" },
  { keyword: "AI Security Frameworks for cybersecurity teams", ranking: "-1" },
  { keyword: "AI Security Frameworks for protecting sensitive data", ranking: "2" },
  { keyword: "AI Security Frameworks for AI governance", ranking: "-1" },
  { keyword: "Choosing the right AI Security Frameworks", ranking: "1" },
  { keyword: "Overview of AI Security Frameworks", ranking: "-1" },
  { keyword: "OWASP AI security framework explained", ranking: "1" },
  { keyword: "OWASP AI security framework", ranking: "1" },
  { keyword: "OWASP security best practices for AI", ranking: "2" },
  { keyword: "MITRE AI security framework explained", ranking: "1" },
  { keyword: "MITRE AI security framework", ranking: "2" },
]

// Organize keywords into clusters
const clusters = [
  {
    title: "Specific Frameworks",
    items: [
      "OWASP AI security framework explained",
      "OWASP AI security framework",
      "OWASP security best practices for AI",
      "MITRE AI security framework explained",
      "MITRE AI security framework",
    ],
    ranking: ["1", "1", "2", "1", "2"],
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Understanding & Implementation",
    items: [
      "Understanding AI Security Frameworks",
      "How to implement AI Security Frameworks",
      "Choosing the right AI Security Frameworks",
      "Overview of AI Security Frameworks",
    ],
    ranking: ["1", "-1", "1", "-1"],
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Compliance & Governance",
    items: [
      "AI Security Frameworks for compliance requirements",
      "AI Security Frameworks and regulatory standards",
      "AI Security Frameworks for AI governance",
    ],
    ranking: ["-1", "-1", "-1"],
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "AI Technology Contexts",
    items: ["AI Security Frameworks for large language models", "AI Security Frameworks for generative AI"],
    ranking: ["1", "-1"],
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "Implementation Contexts",
    items: [
      "AI Security Frameworks for enterprise risk management",
      "AI Security Frameworks for software developers",
      "AI Security Frameworks for cybersecurity teams",
      "AI Security Frameworks for protecting sensitive data",
    ],
    ranking: ["-1", "-1", "-1", "2"],
    icon: <Lock className="h-5 w-5" />,
  },
  {
    title: "Comparison & Selection",
    items: ["AI Security Frameworks comparison guide"],
    ranking: ["-1"],
    icon: <Layers className="h-5 w-5" />,
  },
]

const contentPlan = [
  {
    title: "Comprehensive AI Security Frameworks Implementation Guide",
    objectives: [
      "Step-by-step implementation guide for different organizational contexts.",
      "Practical examples and code samples for technical teams.",
      "Page length: 3,000+ words with implementation checklists and diagrams.",
    ],
    reasoning:
      "'How to implement AI Security Frameworks' has a negative ranking despite strong rankings for understanding frameworks. This guide bridges the gap between conceptual knowledge and practical implementation, addressing our biggest weakness.",
    relatedKeywords: [
      "How to implement AI Security Frameworks",
      "AI Security Frameworks for software developers",
      "AI Security Frameworks for cybersecurity teams",
      "AI Security Frameworks for enterprise risk management",
    ],
    currentRanking: "Position -1",
  },
  {
    title: "AI Security Frameworks for Compliance & Governance",
    objectives: [
      "Mapping AI security frameworks to regulatory requirements (GDPR, CCPA, etc.).",
      "Governance implementation strategies with organizational structure examples.",
      "Page length: 2,500+ words with compliance matrices and governance templates.",
    ],
    reasoning:
      "All compliance and governance-related keywords have negative rankings (-1). This represents a significant gap in our content, especially as regulatory concerns are a primary driver for enterprise framework adoption.",
    relatedKeywords: [
      "AI Security Frameworks for compliance requirements",
      "AI Security Frameworks and regulatory standards",
      "AI Security Frameworks for AI governance",
    ],
    currentRanking: "Position -1",
  },
  {
    title: "Generative AI Security Framework Comparison",
    objectives: [
      "Detailed comparison of OWASP, MITRE, and other frameworks specifically for generative AI.",
      "Framework selection decision tree based on use case and organization type.",
      "Page length: 2,000+ words with interactive comparison tool.",
    ],
    reasoning:
      "We have strong rankings for specific frameworks (OWASP, MITRE) but negative rankings for comparison guides and generative AI applications. This content leverages our framework expertise while addressing the comparison and generative AI gaps.",
    relatedKeywords: [
      "AI Security Frameworks comparison guide",
      "AI Security Frameworks for generative AI",
      "Overview of AI Security Frameworks",
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
            <h1 className="text-4xl font-bold tracking-tight">AI Security Frameworks SEO Analysis</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keyword performance analysis and content strategy for improving visibility in the AI security framework
              space
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
                        <h3 className="font-medium">Specific Framework Coverage</h3>
                        <p className="text-sm text-muted-foreground">
                          Strong Page 1 rankings for OWASP and MITRE framework keywords, with additional Page 2
                          positions.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Conceptual Understanding</h3>
                        <p className="text-sm text-muted-foreground">
                          Page 1 rankings for "Understanding AI Security Frameworks" and "Choosing the right AI Security
                          Frameworks."
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">LLM-Specific Content</h3>
                        <p className="text-sm text-muted-foreground">
                          Page 1 ranking for "AI Security Frameworks for large language models," showing strength in
                          this specific application.
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
                        <h3 className="font-medium">Implementation Gap</h3>
                        <p className="text-sm text-muted-foreground">
                          Negative ranking for "How to implement AI Security Frameworks" despite strong conceptual
                          content.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Compliance & Governance</h3>
                        <p className="text-sm text-muted-foreground">
                          All compliance, regulatory, and governance keywords have negative rankings.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Audience-Specific Content</h3>
                        <p className="text-sm text-muted-foreground">
                          Poor rankings for software developers, cybersecurity teams, and enterprise risk management
                          contexts.
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
