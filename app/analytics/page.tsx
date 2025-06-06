/* ───────────────────────────────────────────
   pages/analytics/page.tsx   (Next 13/14 “app” dir)
   Google Search Console Dashboard
─────────────────────────────────────────── */
"use client"

import {
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
} from "react"
import Script from "next/script"
import { format } from "date-fns"
import {
  BLOG_URLS,
  BLOG_REPORTS,
  isReportReady,
} from "@/lib/blogPosts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import {
  CalendarIcon,
  Eye,
  Users,
  LineChartIcon,
  PieChartIcon,
  RefreshCw,
  TrendingUp,
  FileText,
} from "lucide-react"

/* ───────────────────────── TYPES */
type SiteEntry = { siteUrl: string; displayName: string }
type DailyRow = { date: string; clicks: number; impressions: number }
type QueryRow = { query: string; clicks: number; impressions: number }

/* ───────────────────────── COLORS */
const COLORS = {
  clicks: "#7c3aed",
  impressions: "#10b981",
  grid: "#e2e8f0",
}

/* ───────────────────────── HELPERS */
const formatDateLabel = (yyyymmdd: string) =>
  `${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`

const buildFilter = (page: string) => ({
  dimensionFilterGroups: [
    {
      groupType: "and",
      filters: [
        {
          dimension: "page",
          operator: "equals",
          expression: page,
        },
      ],
    },
  ],
})

/* ───────────────────────── Lazy Report wrapper */
const ReportTab = ({ url }: { url: string }) => {
  const loader = BLOG_REPORTS[url]
  if (!loader) {
    return (
      <p className="text-center py-10 text-gray-600">
        Report coming soon 🚧
      </p>
    )
  }
  const Report = lazy(loader)
  return (
    <Suspense fallback={<p className="text-center py-10">Loading report…</p>}>
      <Report />
    </Suspense>
  )
}

/* ───────────────────────── COMPONENT */
export default function AnalyticsPage() {
  /* auth & property */
  const [token, setToken] = useState<string | null>(null)
  const [sites, setSites] = useState<SiteEntry[]>([])
  const [siteUrl, setSiteUrl] = useState<string | null>(null)

  /* blog & dates */
  const [blog, setBlog] = useState<string | null>(null)
  const [start, setStart] = useState<Date>(() => new Date(2025, 2, 1)) // 2 = March
  const [end, setEnd] = useState<Date>(() => new Date())

  /* data */
  const [daily, setDaily] = useState<DailyRow[]>([])
  const [queries, setQueries] = useState<QueryRow[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ─────────── OAuth */
  const signIn = useCallback(() => {
    // @ts-ignore injected by Google script
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope:
        "https://www.googleapis.com/auth/webmasters.readonly openid email profile",
      prompt: "",
      callback: (resp: any) =>
        resp.access_token
          ? setToken(resp.access_token)
          : setError("Login cancelled or failed."),
    })
    client.requestAccessToken()
  }, [])

  /* ─────────── List sites */
  const listSites = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(
        "https://searchconsole.googleapis.com/webmasters/v3/sites",
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)

      const entries: SiteEntry[] = (json.siteEntry ?? [])
        .filter((s: any) =>
          ["siteOwner", "siteFullUser"].includes(s.permissionLevel),
        )
        .map((s: any) => ({
          siteUrl: s.siteUrl,
          displayName: s.siteUrl
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, ""),
        }))

      setSites(entries)
    } catch (e: any) {
      setError(e.message ?? "Could not list sites.")
    }
  }, [token])

  useEffect(() => {
    if (token) listSites()
  }, [token, listSites])

  /* ─────────── Fetch blog analytics */
  const fetchBlog = useCallback(async () => {
    if (!token || !siteUrl || !blog) return
    setLoading(true)
    setError(null)

    const api = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl.endsWith("/") ? siteUrl : siteUrl + "/",
    )}/searchAnalytics/query`
    const startDate = format(start, "yyyy-MM-dd")
    const endDate = format(end, "yyyy-MM-dd")

    try {
      /* 1. Daily */
      const dailyBody = {
        startDate,
        endDate,
        dimensions: ["date"],
        rowLimit: 1000,
        ...buildFilter(blog),
      }
      const dailyJson = await (
        await fetch(api, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dailyBody),
        })
      ).json()
      if (dailyJson.error) throw new Error(dailyJson.error.message)
      const dailyRows: DailyRow[] = (dailyJson.rows ?? []).map((r: any) => ({
        date: r.keys[0].replace(/-/g, ""),
        clicks: r.clicks,
        impressions: r.impressions,
      }))

      /* 2. Top queries */
      const queryBody = {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 25,
        orderBy: [{ field: "clicks", desc: true }],
        ...buildFilter(blog),
      }
      const queryJson = await (
        await fetch(api, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryBody),
        })
      ).json()
      if (queryJson.error) throw new Error(queryJson.error.message)
      const queryRows: QueryRow[] = (queryJson.rows ?? []).map((r: any) => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
      }))

      setDaily(dailyRows.sort((a, b) => a.date.localeCompare(b.date)))
      setQueries(queryRows)
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch blog analytics.")
    } finally {
      setLoading(false)
    }
  }, [token, siteUrl, blog, start, end])

  useEffect(() => {
    fetchBlog()
  }, [fetchBlog])

  /* ─────────── Derived totals */
  const totalClicks = daily.reduce((t, d) => t + d.clicks, 0)
  const totalImpressions = daily.reduce((t, d) => t + d.impressions, 0)

  /* ─────────── Tooltip */
  const TooltipBox = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((e: any, i: number) => (
          <p key={i} style={{ color: e.color }} className="text-sm">
            {e.name}:{" "}
            <span className="font-semibold">
              {e.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    ) : null

  /* ─────────── UI */
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* HEADER */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Blog Analytics
                </h1>
                <p className="text-gray-600">
                  Google Search Console Dashboard
                </p>
              </div>
            </div>

            {!token && (
              <Card className="max-w-md">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Connect Your Account
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Sign in with Google to access your Search Console
                        data
                      </p>
                    </div>
                    <Button onClick={signIn} className="w-full">
                      Sign in with Google
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {token && (
              <Card className="p-4">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Property select */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Property
                    </label>
                    <Select
                      value={siteUrl ?? undefined}
                      onValueChange={(v) => {
                        setSiteUrl(v)
                        setBlog(null)
                      }}
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Choose Search Console property" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((s) => (
                          <SelectItem key={s.siteUrl} value={s.siteUrl}>
                            {s.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Blog select */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Blog Post
                    </label>
                    <Select
                      disabled={!siteUrl}
                      value={blog ?? undefined}
                      onValueChange={setBlog}
                    >
                      <SelectTrigger className="w-[420px]">
                        <SelectValue placeholder="Choose blog post" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_URLS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u.replace(/^https?:\/\//, "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date pickers */}
                  <div className="flex gap-2">
                    <DatePicker
                      label="Start"
                      date={start}
                      setDate={setStart}
                    />
                    <DatePicker
                      label="End"
                      date={end}
                      setDate={setEnd}
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchBlog}
                    disabled={loading || !blog}
                    className="flex items-center gap-2 mt-6"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
              </Card>
            )}
          </header>

          {/* NO PROPERTY / BLOG */}
          {token && !siteUrl && (
            <Card className="text-center py-8">
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto">
                    <LineChartIcon className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-600">
                    Select a property to begin analyzing your data.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {token && siteUrl && !blog && (
            <Card className="text-center py-8">
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600">
                    Select one of your blog URLs to load analytics.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* DASHBOARD */}
          {token && siteUrl && blog && (
            <>
              {/* SUMMARY CARDS */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {/* Clicks */}
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -mr-10 -mt-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex gap-2 items-center text-sm text-gray-600 font-medium">
                      <Users className="h-4 w-4 text-violet-600" />{" "}
                      Total Clicks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {totalClicks.toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Impressions */}
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex gap-2 items-center text-sm text-gray-600 font-medium">
                      <Eye className="h-4 w-4 text-emerald-600" /> Total
                      Impressions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {totalImpressions.toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* CTR */}
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex gap-2 items-center text-sm text-gray-600 font-medium">
                      <TrendingUp className="h-4 w-4 text-orange-600" />{" "}
                      Click-Through Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {totalImpressions
                          ? (
                              (totalClicks / totalImpressions) *
                              100
                            ).toFixed(2) + "%"
                          : "0.00%"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* TABS */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                  <TabsTrigger
                    value="overview"
                    className="flex gap-2 items-center"
                  >
                    <LineChartIcon className="h-4 w-4" /> Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="queries"
                    className="flex gap-2 items-center"
                  >
                    <PieChartIcon className="h-4 w-4" /> Queries
                  </TabsTrigger>
                  <TabsTrigger
                    value="report"
                    className="flex gap-2 items-center"
                  >
                    <FileText className="h-4 w-4" /> Report
                  </TabsTrigger>
                </TabsList>

                {/* OVERVIEW */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex gap-2 items-center">
                        <LineChartIcon className="h-5 w-5 text-violet-600" />{" "}
                        Daily Performance
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 break-all">
                        {blog}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-[320px] w-full" />
                      ) : (
                        <div className="h-[360px]">
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                          >
                            <LineChart
                              data={daily.map((d) => ({
                                ...d,
                                date: formatDateLabel(d.date),
                              }))}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={COLORS.grid}
                              />
                              <XAxis
                                dataKey="date"
                                tickLine={{ stroke: COLORS.grid }}
                                axisLine={{ stroke: COLORS.grid }}
                                fontSize={12}
                              />
                              <YAxis
                                tickLine={{ stroke: COLORS.grid }}
                                axisLine={{ stroke: COLORS.grid }}
                                fontSize={12}
                              />
                              <Tooltip content={<TooltipBox />} />
                              <Line
                                type="monotone"
                                dataKey="clicks"
                                stroke={COLORS.clicks}
                                strokeWidth={3}
                                dot={{ r: 4, fill: COLORS.clicks }}
                                name="Clicks"
                              />
                              <Line
                                type="monotone"
                                dataKey="impressions"
                                stroke={COLORS.impressions}
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                  fill: COLORS.impressions,
                                }}
                                name="Impressions"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* QUERIES */}
                <TabsContent value="queries">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Search Queries</CardTitle>
                      <CardDescription className="break-all">
                        {blog}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b bg-gray-50/80 sticky top-0">
                            <tr>
                              <th className="px-6 py-4 text-left font-semibold text-gray-900">
                                Query
                              </th>
                              <th className="px-6 py-4 text-right font-semibold text-gray-900">
                                Clicks
                              </th>
                              <th className="px-6 py-4 text-right font-semibold text-gray-900">
                                Impressions
                              </th>
                              <th className="px-6 py-4 text-right font-semibold text-gray-900">
                                CTR
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading
                              ? Array(8)
                                  .fill(0)
                                  .map((_, i) => (
                                    <tr
                                      key={i}
                                      className="border-b border-gray-100"
                                    >
                                      <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-64" />
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                      </td>
                                    </tr>
                                  ))
                              : queries.map((q, i) => (
                                  <tr
                                    key={i}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                  >
                                    <td
                                      className="px-6 py-4 text-gray-900 font-medium max-w-xs truncate"
                                      title={q.query}
                                    >
                                      {q.query}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                                      {q.clicks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600">
                                      {q.impressions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <Badge
                                        variant="secondary"
                                        className="font-medium"
                                      >
                                        {q.impressions
                                          ? (
                                              (q.clicks /
                                                q.impressions) *
                                              100
                                            ).toFixed(2) + "%"
                                          : "—"}
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

                {/* REPORT */}
                <TabsContent value="report">
                  <ReportTab url={blog} />
                </TabsContent>
              </Tabs>

              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <RefreshCw className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900">
                          Error
                        </h4>
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

/* ───────────────────────── DatePicker (shadcn) */
type DPProps = {
  label: string
  date: Date
  setDate: (d: Date) => void
}
function DatePicker({ label, date, setDate }: DPProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[160px] justify-start font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM dd, yyyy") : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
