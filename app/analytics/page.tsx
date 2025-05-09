"use client"

import { useState, useEffect, useCallback } from "react"
import Script from "next/script"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowUpRight, BarChart3, Eye, Globe, LineChartIcon, PieChartIcon, RefreshCw, Users } from "lucide-react"

/* ─────────────────────────────────────────── TYPES */
type GAProperty = { id: string; name: string }
type Summary = { date: string; users: number; pageViews: number }
type PageRow = {
  pagePath: string
  users: number
  pageViews: number
  source: string
}

/* ─────────────────────────────────────────── COLORS */
const CHART_COLORS = {
  users: "#7c3aed",
  pageViews: "#10b981",
  accent: "#f97316",
  grid: "#e2e8f0",
  pieColors: [
    "#7c3aed",
    "#10b981",
    "#f97316",
    "#0ea5e9",
    "#ec4899",
    "#8b5cf6",
    "#14b8a6",
    "#f59e0b",
    "#3b82f6",
    "#d946ef",
    "#a78bfa",
    "#34d399",
    "#fbbf24",
    "#60a5fa",
    "#f472b6",
  ],
}

/* ─────────────────────────────────────────── COMPONENT */
export default function AnalyticsPage() {
  /* state */
  const [token, setToken] = useState<string | null>(null)
  const [properties, setProperties] = useState<GAProperty[]>([])
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [summary, setSummary] = useState<Summary[]>([])
  const [pages, setPages] = useState<PageRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ─────────── 1. Login */
  const signIn = useCallback(() => {
    // @ts-ignore injected by script
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope: "https://www.googleapis.com/auth/analytics.readonly openid email profile",
      prompt: "",
      callback: (resp: any) =>
        resp.access_token ? setToken(resp.access_token) : setError("Login cancelled or failed."),
    })
    client.requestAccessToken()
  }, [])

  /* ─────────── 2. List GA4 properties */
  const listProperties = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)

      const props: GAProperty[] =
        json.accountSummaries
          ?.flatMap((a: any) =>
            a.propertySummaries?.map((p: any) => ({
              id: p.property,
              name: p.displayName,
            })),
          )
          .filter(Boolean) || []
      setProperties(props)
    } catch (e: any) {
      setError(e.message ?? "Could not list GA properties.")
    }
  }, [token])

  useEffect(() => {
    if (token) listProperties()
  }, [token, listProperties])

  /* ─────────── 3. Fetch analytics */
  const fetchAnalytics = useCallback(async () => {
    if (!token || !propertyId) return
    setLoading(true)
    setError(null)

    const today = new Date().toISOString().slice(0, 10)
    const weekAgo = new Date(Date.now() - 6 * 24 * 3600_000).toISOString().slice(0, 10)

    try {
      /* 3.a Daily summary */
      const dailyRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: weekAgo, endDate: today }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "totalUsers" }, { name: "screenPageViews" }],
        }),
      })
      const dailyJson = await dailyRes.json()
      if (dailyJson.error) throw new Error(dailyJson.error.message)

      const daily: Summary[] = dailyJson.rows.map((r: any) => ({
        date: r.dimensionValues[0].value,
        users: Number(r.metricValues[0].value),
        pageViews: Number(r.metricValues[1].value),
      }))
      daily.sort((a, b) => a.date.localeCompare(b.date)) // chronological

      /* 3.b Per‑page breakdown */
      const pageRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: weekAgo, endDate: today }],
          dimensions: [{ name: "pagePath" }, { name: "sessionSource" }],
          metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10000, // ↑ bigger sample for source charts
        }),
      })
      const pageJson = await pageRes.json()
      if (pageJson.error) throw new Error(pageJson.error.message)

      const pageRows: PageRow[] = pageJson.rows.map((r: any) => ({
        pagePath: r.dimensionValues[0].value,
        source: r.dimensionValues[1].value,
        pageViews: Number(r.metricValues[0].value),
        users: Number(r.metricValues[1].value),
      }))

      setSummary(daily)
      setPages(pageRows)
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch analytics.")
    } finally {
      setLoading(false)
    }
  }, [token, propertyId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  /* totals */
  const totalUsers = summary.reduce((t, d) => t + d.users, 0)
  const totalViews = summary.reduce((t, d) => t + d.pageViews, 0)

  /* derived traffic‑source dataset */
  const sourceTotals = pages.reduce<Record<string, { source: string; users: number; pageViews: number }>>(
    (acc, row) => {
      if (!acc[row.source]) acc[row.source] = { source: row.source, users: 0, pageViews: 0 }
      acc[row.source].users += row.users
      acc[row.source].pageViews += row.pageViews
      return acc
    },
    {},
  )
  const sourceData = Object.values(sourceTotals).sort((a, b) => b.pageViews - a.pageViews)
  const topSourceData = sourceData.slice(0, 15) // for bar chart

  /* Format date for display */
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const [year, month, day] = [dateStr.slice(0, 4), dateStr.slice(4, 6), dateStr.slice(6, 8)]
    return `${month}/${day}`
  }

  /* Custom tooltip for charts */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  /* ─────────── UI */
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />

      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-1">Insights from your Google Analytics 4 data</p>
              </div>

              {token && propertyId && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAnalytics}
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Select value={propertyId} onValueChange={setPropertyId}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Choose property…" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </header>

          {/* LOGIN */}
          {!token && (
            <Card className="mx-auto max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Connect Google Analytics</CardTitle>
                <CardDescription>Sign in with your Google account to access your analytics data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <div className="flex justify-center">
                  <img src="/google-analytics-logo.png" alt="Google Analytics" className="h-24 w-24 mb-4" />
                </div>
                <Button onClick={signIn} size="lg" className="px-8">
                  Sign in with Google
                </Button>
                {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              </CardContent>
            </Card>
          )}

          {/* PROPERTY DROPDOWN */}
          {token && !propertyId && (
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle className="text-xl">Select a GA4 property</CardTitle>
                <CardDescription>Choose which analytics property you want to view</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {properties.length === 0 && (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No properties visible under this account.</p>
                  </div>
                )}

                {properties.length > 0 && (
                  <Select onValueChange={(val) => setPropertyId(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose property…" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {error && <p className="mt-4 text-destructive font-medium">{error}</p>}
              </CardContent>
            </Card>
          )}

          {/* DASHBOARD */}
          {token && propertyId && (
            <>
              {/* summary cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="overflow-hidden border-t-4" style={{ borderTopColor: CHART_COLORS.users }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div className="text-3xl font-bold">
                        {totalUsers.toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground ml-1">last 7 days</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-t-4" style={{ borderTopColor: CHART_COLORS.pageViews }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Page Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div className="text-3xl font-bold">
                        {totalViews.toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground ml-1">last 7 days</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-t-4" style={{ borderTopColor: CHART_COLORS.accent }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4" />
                      Pages Per User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div className="text-3xl font-bold">
                        {totalUsers ? (totalViews / totalUsers).toFixed(2) : "0.00"}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Top Traffic Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div>
                        <div className="text-xl font-bold">{sourceData[0]?.source || "None"}</div>
                        <div className="text-sm text-muted-foreground">
                          {sourceData[0] ? `${sourceData[0].pageViews.toLocaleString()} views` : ""}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <LineChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="pages" className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Pages</span>
                  </TabsTrigger>
                  <TabsTrigger value="sources" className="flex items-center gap-1">
                    <PieChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Sources</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* line chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChartIcon className="h-5 w-5" />
                        Daily Traffic Trends
                      </CardTitle>
                      <CardDescription>Users and page views over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[320px] flex items-center justify-center">
                          <div className="text-center">
                            <Skeleton className="h-4 w-32 mx-auto mb-2" />
                            <Skeleton className="h-[280px] w-full" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-[320px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={summary.map((item) => ({
                                ...item,
                                date: formatDate(item.date),
                              }))}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickLine={{ stroke: CHART_COLORS.grid }}
                                axisLine={{ stroke: CHART_COLORS.grid }}
                              />
                              <YAxis
                                tickLine={{ stroke: CHART_COLORS.grid }}
                                axisLine={{ stroke: CHART_COLORS.grid }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="users"
                                stroke={CHART_COLORS.users}
                                strokeWidth={3}
                                name="Users"
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="pageViews"
                                stroke={CHART_COLORS.pageViews}
                                strokeWidth={3}
                                name="Page Views"
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pages Tab */}
                <TabsContent value="pages" className="space-y-6">
                  {/* grouped bar chart for page details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Top Pages Performance
                      </CardTitle>
                      <CardDescription>Users vs Page Views for your most visited pages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[380px] flex items-center justify-center">
                          <Skeleton className="h-[340px] w-full" />
                        </div>
                      ) : (
                        <div className="h-[380px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={pages.slice(0, 20).map((page) => ({
                                ...page,
                                pagePath:
                                  page.pagePath.length > 30 ? page.pagePath.substring(0, 27) + "..." : page.pagePath,
                              }))}
                              layout="vertical"
                              margin={{ left: 80 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                              <XAxis
                                type="number"
                                tickLine={{ stroke: CHART_COLORS.grid }}
                                axisLine={{ stroke: CHART_COLORS.grid }}
                              />
                              <YAxis
                                dataKey="pagePath"
                                type="category"
                                tick={{ fontSize: 11 }}
                                width={220}
                                tickLine={{ stroke: CHART_COLORS.grid }}
                                axisLine={{ stroke: CHART_COLORS.grid }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Bar dataKey="users" barSize={12} name="Users" fill={CHART_COLORS.users} />
                              <Bar dataKey="pageViews" barSize={12} name="Views" fill={CHART_COLORS.pageViews} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">Page Details</CardTitle>
                      <CardDescription>Detailed breakdown of all pages with traffic sources</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b sticky top-0 bg-background">
                            <tr className="bg-muted/50">
                              <th className="px-4 py-3 text-left font-medium">Page</th>
                              <th className="px-4 py-3 text-right font-medium">Users</th>
                              <th className="px-4 py-3 text-right font-medium">Views</th>
                              <th className="px-4 py-3 text-left font-medium">Top Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading
                              ? Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <tr key={i} className="border-b">
                                      <td className="px-4 py-3">
                                        <Skeleton className="h-4 w-48" />
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                      </td>
                                      <td className="px-4 py-3">
                                        <Skeleton className="h-4 w-24" />
                                      </td>
                                    </tr>
                                  ))
                              : pages.map((row, idx) => (
                                  <tr
                                    key={`${row.pagePath}-${idx}`}
                                    className="border-b hover:bg-muted/30 transition-colors"
                                  >
                                    <td className="px-4 py-3 break-all font-medium">{row.pagePath}</td>
                                    <td className="px-4 py-3 text-right">{row.users.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right">{row.pageViews.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                      <Badge variant="outline" className="font-normal">
                                        {row.source || "direct"}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sources Tab */}
                <TabsContent value="sources" className="space-y-6">
                  {/* Traffic Source Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5" />
                        Traffic Sources Distribution
                      </CardTitle>
                      <CardDescription>Breakdown of page views by traffic source</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[340px] flex items-center justify-center">
                          <Skeleton className="h-[300px] w-[300px] rounded-full mx-auto" />
                        </div>
                      ) : (
                        <div className="h-[340px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend layout="vertical" verticalAlign="middle" align="right" />
                              <Pie
                                data={sourceData.slice(0, 10)}
                                dataKey="pageViews"
                                nameKey="source"
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {sourceData.slice(0, 10).map((entry, idx) => (
                                  <Cell
                                    key={`slice-${idx}`}
                                    fill={CHART_COLORS.pieColors[idx % CHART_COLORS.pieColors.length]}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Sources Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">Top Traffic Sources</CardTitle>
                      <CardDescription>Sources bringing the most users to your site</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[340px] flex items-center justify-center">
                          <Skeleton className="h-[300px] w-full" />
                        </div>
                      ) : (
                        <div className="h-[340px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSourceData} layout="vertical" margin={{ left: 120 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                              <XAxis
                                type="number"
                                tickLine={{ stroke: CHART_COLORS.grid }}
                                axisLine={{ stroke: CHART_COLORS.grid }}
                              />
                              <YAxis
                                dataKey="source"
                                type="category"
                                tick={{ fontSize: 12 }}
                                width={200}
                                tickLine={{ stroke: CHART_COLORS.grid }}
                                axisLine={{ stroke: CHART_COLORS.grid }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar
                                dataKey="users"
                                barSize={16}
                                name="Users"
                                fill={CHART_COLORS.users}
                                radius={[0, 4, 4, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
