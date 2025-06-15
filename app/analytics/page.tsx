/* pages/analytics/page.tsx */
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
  Gauge,
  LayoutList,
} from "lucide-react"

/* ---------- types ---------- */
type SiteEntry = { siteUrl: string; displayName: string }
type DailyRow = { date: string; clicks: number; impressions: number }
type QueryRow = { query: string; clicks: number; impressions: number }
type PageRow  = { page: string; clicks: number; impressions: number }
type Summary  = { clicks: number; impressions: number; ctr: number; position: number }

/* ---------- helpers ---------- */
const COLORS = {
  clicks: "#7c3aed",
  impressions: "#10b981",
  grid: "#e2e8f0",
}
const formatDateLabel = (yyyymmdd: string) =>
  `${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`

const normaliseSiteUrl = (id: string) =>
  id.startsWith("sc-domain:")
    ? id
    : id.endsWith("/")
    ? id
    : id + "/"

const buildFilter = (page: string | null) =>
  page
    ? {
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
      }
    : {}

/* ---------- lazily-loaded blog report ---------- */
const ReportTab = ({ url }: { url: string | null }) => {
  if (!url) return <p className="text-center py-10 text-gray-600">No report in “All pages” view.</p>
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

/* ---------- main component ---------- */
export default function AnalyticsPage() {
  /* ----- state ----- */
  const [token,   setToken]   = useState<string | null>(null)
  const [sites,   setSites]   = useState<SiteEntry[]>([])
  const [siteUrl, setSiteUrl] = useState<string | null>(null)

  const [page, setPage]   = useState<string | null>(null)           // null  -> All pages
  const [start, setStart] = useState<Date>(() => new Date(2025, 2, 1))
  const [end,   setEnd]   = useState<Date>(() => new Date())

  const [summary, setSummary] = useState<Summary | null>(null)
  const [daily,   setDaily]   = useState<DailyRow[]>([])
  const [queries, setQueries] = useState<QueryRow[]>([])
  const [pages,   setPages]   = useState<PageRow[]>([])

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  /* ----- Google sign-in ----- */
  const signIn = useCallback(() => {
    if (!window.google?.accounts?.oauth2) return
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

  /* ----- list Search Console properties ----- */
  const listSites = useCallback(async () => {
    if (!token) return
    try {
      const res  = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)
      const entries: SiteEntry[] = (json.siteEntry ?? [])
        .filter((s: any) =>
          ["siteOwner", "siteFullUser"].includes(s.permissionLevel),
        )
        .map((s: any) => {
          const { siteUrl } = s
          const displayName = siteUrl.startsWith("sc-domain:")
            ? `${siteUrl.slice(10)} (domain)`
            : siteUrl.replace(/^https?:\/\//, "")
          return { siteUrl, displayName }
        })
      setSites(entries)
    } catch (e: any) {
      setError(e.message ?? "Could not list sites.")
    }
  }, [token])

  useEffect(() => { if (token) listSites() }, [token, listSites])

  /* ----- fetch analytics (site-wide or page-specific) ----- */
  const fetchAnalytics = useCallback(async () => {
    if (!token || !siteUrl) return
    setLoading(true)
    setError(null)

    const api = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      normaliseSiteUrl(siteUrl),
    )}/searchAnalytics/query`
    const startDate = format(start, "yyyy-MM-dd")
    const endDate   = format(end,   "yyyy-MM-dd")

    try {
      /* 1️⃣ aggregate summary row (clicks / impressions / ctr / position) */
      const summaryBody = {
        startDate,
        endDate,
        rowLimit: 1,
        ...buildFilter(page),
      }
      const summaryJson = await (
        await fetch(api, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(summaryBody),
        })
      ).json()
      if (summaryJson.error) throw new Error(summaryJson.error.message)
      const sRow = summaryJson.rows?.[0] ?? { clicks:0, impressions:0, ctr:0, position:0 }
      setSummary({
        clicks: sRow.clicks,
        impressions: sRow.impressions,
        ctr: sRow.ctr,
        position: sRow.position,
      })

      /* 2️⃣ daily trend */
      const dailyBody = {
        startDate,
        endDate,
        dimensions: ["date"],
        rowLimit: 1000,
        ...buildFilter(page),
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
      setDaily(dailyRows.sort((a, b) => a.date.localeCompare(b.date)))

      /* 3️⃣ top queries */
      const queryBody = {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 25,
        orderBy: [{ field: "clicks", desc: true }],
        ...buildFilter(page),
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
      setQueries(queryRows)

      /* 4️⃣ top pages (site-wide only) */
      if (!page) {
        const pageBody = {
          startDate,
          endDate,
          dimensions: ["page"],
          rowLimit: 25,
          orderBy: [{ field: "clicks", desc: true }],
        }
        const pageJson = await (
          await fetch(api, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pageBody),
          })
        ).json()
        if (pageJson.error) throw new Error(pageJson.error.message)
        const pageRows: PageRow[] = (pageJson.rows ?? []).map((r: any) => ({
          page: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
        }))
        setPages(pageRows)
      } else {
        setPages([])
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to fetch analytics.")
    } finally {
      setLoading(false)
    }
  }, [token, siteUrl, page, start, end])

  /* auto-refresh when deps change */
  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  /* ----- derived totals ----- */
  const totalClicks      = summary?.clicks      ?? 0
  const totalImpressions = summary?.impressions ?? 0
  const avgCTR           = summary ? (summary.ctr * 100).toFixed(2) : "0.00"
  const avgPosition      = summary ? summary.position.toFixed(1)     : "—"

  /* ----- tooltip component ----- */
  const TooltipBox = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((e: any, i: number) => (
          <p key={i} style={{ color: e.color }} className="text-sm">
            {e.name}: <span className="font-semibold">{e.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    ) : null

  /* ---------- UI ---------- */
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* ----- header / auth ----- */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Search Console Analytics
                </h1>
                <p className="text-gray-600">
                  Site &amp; Blog Performance Dashboard
                </p>
              </div>
            </div>

            {/* sign-in card */}
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
                        Sign in with Google to access your Search Console data
                      </p>
                    </div>
                    <Button onClick={signIn} className="w-full">
                      Sign in with Google
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* property / page selectors */}
            {token && (
              <Card className="p-4">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* property */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Property
                    </label>
                    <Select
                      value={siteUrl ?? undefined}
                      onValueChange={(v) => {
                        setSiteUrl(v)
                        setPage(null)        // reset to “All pages”
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

                  {/* page / blog selector */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Page
                    </label>
                    <Select
                      disabled={!siteUrl}
                      value={page ?? ""}
                      onValueChange={(v) => setPage(v || null)}
                    >
                      <SelectTrigger className="w-[420px]">
                        <SelectValue placeholder="All pages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All pages</SelectItem>
                        {BLOG_URLS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u.replace(/^https?:\/\//, "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* date pickers */}
                  <div className="flex gap-2">
                    <DatePicker label="Start" date={start} setDate={setStart} />
                    <DatePicker label="End"   date={end}   setDate={setEnd}   />
                  </div>

                  {/* refresh */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchAnalytics}
                    disabled={loading}
                    className="flex items-center gap-2 mt-6"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
              </Card>
            )}
          </header>

          {/* ----- analytics section ----- */}
          {token && siteUrl && (
            <>
              {/* summary cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* clicks */}
                <SummaryCard
                  loading={loading}
                  title="Total Clicks"
                  value={totalClicks.toLocaleString()}
                  icon={<Users className="h-4 w-4 text-violet-600" />}
                  bg="violet-500"
                />
                {/* impressions */}
                <SummaryCard
                  loading={loading}
                  title="Total Impressions"
                  value={totalImpressions.toLocaleString()}
                  icon={<Eye className="h-4 w-4 text-emerald-600" />}
                  bg="emerald-500"
                />
                {/* ctr */}
                <SummaryCard
                  loading={loading}
                  title="Click-Through Rate"
                  value={`${avgCTR}%`}
                  icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
                  bg="orange-500"
                />
                {/* position */}
                <SummaryCard
                  loading={loading}
                  title="Average Position"
                  value={avgPosition}
                  icon={<Gauge className="h-4 w-4 text-sky-600" />}
                  bg="sky-500"
                />
              </div>

              {/* detail tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[700px]">
                  <TabsTrigger value="overview" className="flex gap-2 items-center">
                    <LineChartIcon className="h-4 w-4" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="queries" className="flex gap-2 items-center">
                    <PieChartIcon className="h-4 w-4" /> Queries
                  </TabsTrigger>
                  <TabsTrigger value="pages" className="flex gap-2 items-center">
                    <LayoutList className="h-4 w-4" /> Pages
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex gap-2 items-center">
                    <FileText className="h-4 w-4" /> Report
                  </TabsTrigger>
                </TabsList>

                {/* ----- overview ----- */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex gap-2 items-center">
                        <LineChartIcon className="h-5 w-5 text-violet-600" /> Daily Performance
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 break-all">
                        {page ?? "All pages"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-[360px] w-full" />
                      ) : (
                        <div className="h-[360px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={daily.map((d) => ({ ...d, date: formatDateLabel(d.date) }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                              <XAxis dataKey="date" tickLine={{ stroke: COLORS.grid }} axisLine={{ stroke: COLORS.grid }} fontSize={12} />
                              <YAxis tickLine={{ stroke: COLORS.grid }} axisLine={{ stroke: COLORS.grid }} fontSize={12} />
                              <Tooltip content={<TooltipBox />} />
                              <Line type="monotone" dataKey="clicks"      stroke={COLORS.clicks}      strokeWidth={3} dot={{ r: 4, fill: COLORS.clicks }}      name="Clicks" />
                              <Line type="monotone" dataKey="impressions" stroke={COLORS.impressions} strokeWidth={3} dot={{ r: 4, fill: COLORS.impressions }} name="Impressions" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ----- queries ----- */}
                <TabsContent value="queries">
                  <DataTable
                    title="Top Search Queries"
                    loading={loading}
                    rows={queries}
                    getKey={(r) => r.query}
                    cols={[
                      { header: "Query",        render: (r) => r.query,       className: "text-gray-900 font-medium max-w-xs truncate",    numeric: false },
                      { header: "Clicks",       render: (r) => r.clicks,      numeric: true },
                      { header: "Impressions",  render: (r) => r.impressions, numeric: true, textClass: "text-gray-600" },
                      { header: "CTR",          render: (r) => (r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(2) + "%" : "—"), numeric: true, badge: true },
                    ]}
                  />
                </TabsContent>

                {/* ----- pages (only populated in site-wide view) ----- */}
                <TabsContent value="pages">
                  {page ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <p className="text-gray-600">Switch to “All pages” to see top-performing URLs.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <DataTable
                      title="Top Pages"
                      loading={loading}
                      rows={pages}
                      getKey={(r) => r.page}
                      cols={[
                        { header: "Page",         render: (r) => r.page.replace(/^https?:\/\//, ""), className: "text-gray-900 font-medium max-w-xs truncate", numeric: false },
                        { header: "Clicks",       render: (r) => r.clicks,      numeric: true },
                        { header: "Impressions",  render: (r) => r.impressions, numeric: true, textClass: "text-gray-600" },
                        { header: "CTR",          render: (r) => (r.impressions ? ((r.clicks / r.impressions) * 100).toFixed(2) + "%" : "—"), numeric: true, badge: true },
                      ]}
                    />
                  )}
                </TabsContent>

                {/* ----- report (blog-specific only) ----- */}
                <TabsContent value="report">
                  <ReportTab url={page} />
                </TabsContent>
              </Tabs>

              {/* error banner */}
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <RefreshCw className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900">Error</h4>
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

/* ---------- reusable sub-components ---------- */

/* summary card */
function SummaryCard({
  loading,
  title,
  value,
  icon,
  bg,
}: {
  loading: boolean
  title: string
  value: string
  icon: React.ReactNode
  bg: string            /* tailwind color e.g. sky-500 */
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-${bg}/10 rounded-full -mr-10 -mt-10`} />
      <CardHeader className="pb-2">
        <CardTitle className="flex gap-2 items-center text-sm text-gray-600 font-medium">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

/* generic table for queries / pages */
function DataTable<T>({
  title,
  loading,
  rows,
  cols,
  getKey,
}: {
  title: string
  loading: boolean
  rows: T[]
  cols: {
    header: string
    render: (r: T) => string | number
    numeric?: boolean
    className?: string
    textClass?: string
    badge?: boolean
  }[]
  getKey: (r: T, idx: number) => string | number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50/80 sticky top-0">
              <tr>
                {cols.map((c) => (
                  <th
                    key={c.header}
                    className={`px-6 py-4 ${c.numeric ? "text-right" : "text-left"} font-semibold text-gray-900`}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {cols.map((c, j) => (
                          <td key={j} className={`px-6 py-4 ${c.numeric ? "text-right" : ""}`}>
                            <Skeleton className={`h-4 ${c.numeric ? "w-12 ml-auto" : "w-64"}`} />
                          </td>
                        ))}
                      </tr>
                    ))
                : rows.map((r, i) => (
                    <tr
                      key={getKey(r, i)}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      {cols.map((c, j) => {
                        const content = c.render(r)
                        return (
                          <td
                            key={j}
                            className={`px-6 py-4 ${c.numeric ? "text-right" : ""} ${c.textClass ?? ""}`}
                          >
                            {c.badge ? (
                              <Badge variant="secondary" className="font-medium">
                                {content}
                              </Badge>
                            ) : (
                              <span
                                className={`${c.className ?? ""}`}
                                title={typeof content === "string" ? content : undefined}
                              >
                                {content}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

/* date picker */
type DPProps = { label: string; date: Date; setDate: (d: Date) => void }
function DatePicker({ label, date, setDate }: DPProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[160px] justify-start font-normal">
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
