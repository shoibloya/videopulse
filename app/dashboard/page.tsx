"use client"

import { motion } from "framer-motion"
import { KpiCard } from "@/components/kpi-card"
import { KeywordsTable } from "@/components/keywords-table"
import { BacklinksTable } from "@/components/backlinks-table"
import { TrafficChart } from "@/components/traffic-chart"
import {
  Activity,
  Link2,
  Search,
  Share2,
  Users,
  Bell,
  CreditCard,
  LogOut,
  Settings,
  User,
  Calendar,
  Mail,
  MapPin,
  Briefcase,
  Award,
} from "lucide-react"
import AgentsList from "@/components/AgentsList"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  // Example KPI data
  const kpiData = [
    { title: "DR", value: 13, icon: <Activity className="h-4 w-4" /> },
    { title: "UR", value: 11, icon: <Users className="h-4 w-4" /> },
    { title: "Backlinks", value: 70, icon: <Link2 className="h-4 w-4" /> },
    { title: "Ref. Domains", value: 35, icon: <Share2 className="h-4 w-4" /> },
    { title: "Organic Traffic", value: 89, icon: <Search className="h-4 w-4" /> },
  ]

  // Hard-coded keywords data
  const keywordsData = [
    {
      keyword: "study chat",
      intent: "N",
      sf: 2,
      volume: 50,
      kd: 43,
      cpc: "N/A",
      traffic: 8,
      paid: 0,
      position: 2,
      url: "https://www.studychat.app/",
    },
    {
      keyword: "aesthetic stopwatch for studying",
      intent: "C",
      sf: 1,
      volume: 100,
      kd: 22,
      cpc: 4.86,
      traffic: 1,
      paid: 0,
      position: 15,
      url: "https://www.studychat.app/tools/aesthetic-study-timer",
    },
    {
      keyword: "stopwatch aesthetic study",
      intent: "I",
      sf: 3,
      volume: 50,
      kd: 34,
      cpc: "N/A",
      traffic: 1,
      paid: 0,
      position: 11,
      url: "https://www.studychat.app/tools/aesthetic-study-timer",
    },
    {
      keyword: "aesthetic timer",
      intent: "I",
      sf: 1,
      volume: 1700,
      kd: 12,
      cpc: 0.2,
      traffic: 1,
      paid: 0,
      position: 29,
      url: "https://www.studychat.app/tools/aesthetic-study-timer",
    },
    {
      keyword: "study stopwatch aesthetic",
      intent: "I",
      sf: 1,
      volume: 30,
      kd: 18,
      cpc: "N/A",
      traffic: 0,
      paid: 0,
      position: 13,
      url: "https://www.studychat.app/tools/aesthetic-study-timer",
    },
    {
      keyword: "study timer aesthetic",
      intent: "I C",
      sf: 1,
      volume: 350,
      kd: 22,
      cpc: 1.74,
      traffic: 0,
      paid: 0,
      position: 25,
      url: "https://www.studychat.app/tools/aesthetic-study-timer",
    },
    {
      keyword: "which statement best describes the behavior of the algorithms?",
      intent: "I",
      sf: 1,
      volume: 50,
      kd: 18,
      cpc: "N/A",
      traffic: 0,
      paid: 0,
      position: 17,
      url: "https://www.studychat.app/quiz/976-introduction-to-data-structures-and-algorithms",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Profile Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                SC
              </div>
            </motion.div>
            <span className="font-semibold">StudyChat</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Sarah Johnson</p>
                    <p className="text-xs leading-none text-muted-foreground">sarah@studychat.app</p>
                    <Badge variant="secondary" className="mt-1 w-fit">
                      Premium User
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/subscriptions" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Subscription</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col space-y-8 px-4 py-8 md:px-6 lg:px-8">
        {/* Amazing Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border bg-card shadow-lg overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-r from-primary/80 via-primary to-primary/80">
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
              <Avatar className="h-32 w-32 border-4 border-background rounded-full">
                <AvatarImage src="/placeholder.svg" alt="Sarah Johnson" />
                <AvatarFallback className="text-2xl">SJ</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Sarah Johnson</h2>
                    <p className="text-muted-foreground">SEO Specialist & Content Strategist</p>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild variant="default" size="sm">
                      <Link href="/subscriptions">View Subscription</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="px-3 py-1">
                      Premium
                    </Badge>
                    <span className="text-xs text-muted-foreground">Renews in 26 days</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Storage</span>
                      <span>75% used</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>sarah@studychat.app</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined March 2023</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>San Francisco, CA</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <span className="text-sm">+5 more</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Completed 8 SEO campaigns with 94% success rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Title */}
        <div className="flex flex-col gap-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            StudyChat Dashboard
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
            <KpiCard key={kpi.title} title={kpi.title} value={kpi.value} icon={kpi.icon} index={index} />
          ))}
        </div>

        <TrafficChart />

        {/* Agents Section */}
        <AgentsList />

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

