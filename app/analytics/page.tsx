/* pages/analytics/page.tsx */
"use client"

import {
  useState, useEffect, useCallback, lazy, Suspense,
} from "react"
import Script from "next/script"
import { format } from "date-fns"
import { BLOG_URLS, BLOG_REPORTS } from "@/lib/blogPosts"
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts"
import {
  CalendarIcon, Eye, Users, LineChartIcon, PieChartIcon,
  RefreshCw, TrendingUp, FileText, Gauge, LayoutList, Globe,
} from "lucide-react"

/* ───────────────────────────────────────── constants & sentinels ── */
const COLORS = { clicks: "#7c3aed", impressions: "#10b981", grid: "#e2e8f0" }
const ALL_PAGES     = "__ALL_PAGES__"
const ALL_COUNTRIES = "__ALL_COUNTRIES__"           // ⇦ new

/* quick ISO-3166-1 alpha-3 → name map for prettifying */
const COUNTRY_NAMES: Record<string, string> = {
  USA:"United States", IND:"India", SGP:"Singapore", GBR:"United Kingdom",
  CAN:"Canada", AUS:"Australia", PHL:"Philippines", IDN:"Indonesia",
  // add more if you like; unknown codes will just show the code
}

/* ─────────────────────────────────────────── types ── */
type SiteEntry = { siteUrl:string; displayName:string }
type DailyRow  = { date:string; clicks:number; impressions:number }
type QueryRow  = { query:string; clicks:number; impressions:number }
type PageRow   = { page:string;  clicks:number; impressions:number }
type CountryRow= { country:string; clicks:number; impressions:number }
type Summary   = { clicks:number; impressions:number; ctr:number; position:number }

/* ─────────────────────────────────── helpers ── */
const formatDateLabel = (yyyymmdd:string)=>`${yyyymmdd.slice(4,6)}/${yyyymmdd.slice(6,8)}`
const normaliseSiteUrl = (id:string)=>id.startsWith("sc-domain:")?id:id.endsWith("/")?id:id+"/"

/* build one dimensionFilterGroup with ANDed filters (page and/or country) */
function buildFilter(page:string|null, country:string|null){
  const filters=[]
  if(page)    filters.push({ dimension:"page",    operator:"equals", expression:page })
  if(country) filters.push({ dimension:"country", operator:"equals", expression:country })
  return filters.length
    ? { dimensionFilterGroups:[{ groupType:"and", filters }] }
    : {}
}

/* lazy-loaded blog report */
const ReportTab = ({ url }:{ url:string|null })=>{
  if(!url) return <p className="text-center py-10 text-gray-600">No report in “All pages” view.</p>
  const loader = BLOG_REPORTS[url]
  if(!loader)  return <p className="text-center py-10 text-gray-600">Report coming soon 🚧</p>
  const Report = lazy(loader)
  return <Suspense fallback={<p className="text-center py-10">Loading report…</p>}><Report/></Suspense>
}

/* ─────────────────────────────────────── main ── */
export default function AnalyticsPage(){
  /* state */
  const [token,setToken]               = useState<string|null>(null)
  const [sites,setSites]               = useState<SiteEntry[]>([])
  const [siteUrl,setSiteUrl]           = useState<string|null>(null)

  const [page,setPage]                 = useState<string|null>(null)     // null⇢all
  const [country,setCountry]           = useState<string|null>(null)     // null⇢all
  const [countryOptions,setCountryOptions] = useState<string[]>([])      // ISO codes

  const [start,setStart]               = useState<Date>(()=>new Date(2025,2,1))
  const [end,setEnd]                   = useState<Date>(()=>new Date())

  const [summary,setSummary]           = useState<Summary|null>(null)
  const [daily,setDaily]               = useState<DailyRow[]>([])
  const [queries,setQueries]           = useState<QueryRow[]>([])
  const [pages,setPages]               = useState<PageRow[]>([])
  const [countries,setCountries]       = useState<CountryRow[]>([])

  const [loading,setLoading]           = useState(false)
  const [error,setError]               = useState<string|null>(null)

  /* sign-in */
  const signIn=useCallback(()=>{
    if(!window.google?.accounts?.oauth2) return
    const client=window.google.accounts.oauth2.initTokenClient({
      client_id:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope:"https://www.googleapis.com/auth/webmasters.readonly openid email profile",
      prompt:"",
      callback:(resp:any)=>
        resp.access_token?setToken(resp.access_token):setError("Login cancelled or failed."),
    })
    client.requestAccessToken()
  },[])

  /* list properties */
  useEffect(()=>{ if(!token) return
    ;(async()=>{
      try{
        const res=await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites",
          {headers:{Authorization:`Bearer ${token}`}})
        const json=await res.json(); if(json.error) throw new Error(json.error.message)
        setSites((json.siteEntry??[])
          .filter((s:any)=>["siteOwner","siteFullUser"].includes(s.permissionLevel))
          .map((s:any)=>({siteUrl:s.siteUrl,
            displayName:s.siteUrl.startsWith("sc-domain:")
              ?`${s.siteUrl.slice(10)} (domain)`
              :s.siteUrl.replace(/^https?:\/\//,"") })))
      }catch(e:any){ setError(e.message??"Could not list sites.") }
    })()
  },[token])

  /* fetch analytics (and available country list) */
  const fetchAnalytics=useCallback(async()=>{
    if(!token||!siteUrl) return
    setLoading(true); setError(null)

    const api=`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(normaliseSiteUrl(siteUrl))}/searchAnalytics/query`
    const startDate=format(start,"yyyy-MM-dd"), endDate=format(end,"yyyy-MM-dd")
    const commonFetch=async(body:any)=>(await(await fetch(api,{
      method:"POST",
      headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
      body:JSON.stringify(body),
    })).json())

    try{
      /* summary */
      const sJson=await commonFetch({startDate,endDate,rowLimit:1,...buildFilter(page,country)})
      if(sJson.error) throw new Error(sJson.error.message)
      const s=sJson.rows?.[0]??{clicks:0,impressions:0,ctr:0,position:0}
      setSummary({clicks:s.clicks,impressions:s.impressions,ctr:s.ctr,position:s.position})

      /* daily trend */
      const dJson=await commonFetch({startDate,endDate,dimensions:["date"],rowLimit:1000,...buildFilter(page,country)})
      if(dJson.error) throw new Error(dJson.error.message)
      setDaily((dJson.rows??[]).map((r:any)=>({date:r.keys[0].replace(/-/g,""),clicks:r.clicks,impressions:r.impressions}))
        .sort((a,b)=>a.date.localeCompare(b.date)))

      /* top queries */
      const qJson=await commonFetch({startDate,endDate,dimensions:["query"],rowLimit:25,orderBy:[{field:"clicks",desc:true}],...buildFilter(page,country)})
      if(qJson.error) throw new Error(qJson.error.message)
      setQueries((qJson.rows??[]).map((r:any)=>({query:r.keys[0],clicks:r.clicks,impressions:r.impressions})))

      /* top pages (only if All pages) */
      if(!page){
        const pJson=await commonFetch({startDate,endDate,dimensions:["page"],rowLimit:25,orderBy:[{field:"clicks",desc:true}],...buildFilter(null,country)})
        if(pJson.error) throw new Error(pJson.error.message)
        setPages((pJson.rows??[]).map((r:any)=>({page:r.keys[0],clicks:r.clicks,impressions:r.impressions})))
      }else setPages([])

      /* top countries (only if All countries) */
      if(!country){
        const cJson=await commonFetch({startDate,endDate,dimensions:["country"],rowLimit:25,orderBy:[{field:"clicks",desc:true}],...buildFilter(page,null)})
        if(cJson.error) throw new Error(cJson.error.message)
        setCountries((cJson.rows??[]).map((r:any)=>({country:r.keys[0],clicks:r.clicks,impressions:r.impressions})))
        /* keep list of codes for selector */
        setCountryOptions((cJson.rows??[]).map((r:any)=>r.keys[0]))
      }else setCountries([])
    }catch(e:any){ setError(e.message??"Failed to fetch analytics.") }
    finally{ setLoading(false) }
  },[token,siteUrl,page,country,start,end])

  useEffect(()=>{ fetchAnalytics() },[fetchAnalytics])

  /* ───────────── derived numbers ── */
  const clicks=summary?.clicks??0, imps=summary?.impressions??0
  const avgCTR=summary ? (summary.ctr*100).toFixed(2) : "0.00"
  const position=summary ? summary.position.toFixed(1) : "—"
  const TooltipBox=({active,payload,label}:any)=>active&&payload?.length
    ?<div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((e:any,i:number)=><p key={i} style={{color:e.color}} className="text-sm">
          {e.name}: <span className="font-semibold">{e.value.toLocaleString()}</span></p>)}
      </div>:null

/* ───────────────────────────────────────────────────────────── render ── */

return(<>
<Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive"/>
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
<div className="container mx-auto max-w-7xl px-4 py-8">

{/* header & auth */}
<header className="mb-8">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-violet-100 rounded-lg"><TrendingUp className="h-6 w-6 text-violet-600"/></div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Search Console Analytics</h1>
      <p className="text-gray-600">Site, Page &amp; Country Performance</p>
    </div>
  </div>

  {!token&&(
    <Card className="max-w-md">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto"><Users className="h-8 w-8 text-blue-600"/></div>
          <h3 className="font-semibold text-lg">Connect Your Account</h3>
          <p className="text-gray-600 text-sm mb-4">Sign in with Google to access Search Console data</p>
          <Button onClick={signIn} className="w-full">Sign in with Google</Button>
        </div>
      </CardContent>
    </Card>)}

  {token&&(
    <Card className="p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* property */}
        <Selector label="Property" value={siteUrl??undefined} onChange={(v)=>{setSiteUrl(v); setPage(null); setCountry(null)}} placeholder="Choose property" options={sites.map(s=>({value:s.siteUrl,label:s.displayName}))} w="280px"/>

        {/* page */}
        <Selector
          label="Page"
          value={page??ALL_PAGES}
          onChange={(v)=>setPage(v===ALL_PAGES?null:v)}
          placeholder="All pages"
          disabled={!siteUrl}
          options={[
            {value:ALL_PAGES,label:"All pages"},
            ...BLOG_URLS.map(u=>({value:u,label:u.replace(/^https?:\/\//,"")})),
          ]}
          w="420px"
        />

        {/* country */}
        <Selector
          label="Country"
          value={country??ALL_COUNTRIES}
          onChange={(v)=>setCountry(v===ALL_COUNTRIES?null:v)}
          placeholder="All countries"
          disabled={!siteUrl}
          options={[
            {value:ALL_COUNTRIES,label:"All countries"},
            ...countryOptions.map(c=>({value:c,label:COUNTRY_NAMES[c.toUpperCase()]??c.toUpperCase()})),
          ]}
          w="220px"
        />

        {/* dates */}
        <div className="flex gap-2">
          <DatePicker label="Start" date={start} setDate={setStart}/>
          <DatePicker label="End"   date={end}   setDate={setEnd}/>
        </div>

        {/* refresh */}
        <Button size="sm" variant="outline" onClick={fetchAnalytics} disabled={loading}
          className="flex items-center gap-2 mt-6">
          <RefreshCw className={`h-4 w-4 ${loading?"animate-spin":""}`}/>
          {loading?"Loading…":"Refresh"}
        </Button>
      </div>
    </Card>)}
</header>

{/* dashboard */}
{token&&siteUrl&&(
  <>
  {/* KPIs */}
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
    <Kpi loading={loading} title="Total Clicks"        value={clicks.toLocaleString()}  icon={<Users      className="h-4 w-4 text-violet-600"/>} bg="violet-500"/>
    <Kpi loading={loading} title="Total Impressions"  value={imps.toLocaleString()}    icon={<Eye        className="h-4 w-4 text-emerald-600"/>} bg="emerald-500"/>
    <Kpi loading={loading} title="Click-Through Rate" value={`${avgCTR}%`}             icon={<TrendingUp className="h-4 w-4 text-orange-600"/>} bg="orange-500"/>
    <Kpi loading={loading} title="Average Position"   value={position}                 icon={<Gauge      className="h-4 w-4 text-sky-600"/>}    bg="sky-500"/>
  </div>

  {/* tabs */}
  <Tabs defaultValue="overview" className="space-y-6">
    <TabsList className="grid w-full grid-cols-5 lg:w-[840px]">
      <TabsTrigger value="overview"  ><LineChartIcon className="h-4 w-4"/> Overview</TabsTrigger>
      <TabsTrigger value="queries"   ><PieChartIcon  className="h-4 w-4"/> Queries</TabsTrigger>
      <TabsTrigger value="pages"     ><LayoutList    className="h-4 w-4"/> Pages</TabsTrigger>
      <TabsTrigger value="countries" ><Globe         className="h-4 w-4"/> Countries</TabsTrigger>
      <TabsTrigger value="report"    ><FileText      className="h-4 w-4"/> Report</TabsTrigger>
    </TabsList>

    {/* overview */}
    <TabsContent value="overview" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><LineChartIcon className="h-5 w-5 text-violet-600"/> Daily Performance</CardTitle>
          <CardDescription className="text-sm text-gray-600 break-all">
            {(page??"All pages")+" | "+(country?COUNTRY_NAMES[country.toUpperCase()]??country.toUpperCase():"All countries")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading?<Skeleton className="h-[360px] w-full"/>:
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily.map(d=>({...d,date:formatDateLabel(d.date)}))}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid}/>
                <XAxis dataKey="date" tickLine={{stroke:COLORS.grid}} axisLine={{stroke:COLORS.grid}} fontSize={12}/>
                <YAxis tickLine={{stroke:COLORS.grid}} axisLine={{stroke:COLORS.grid}} fontSize={12}/>
                <Tooltip content={<TooltipBox/>}/>
                <Line type="monotone" dataKey="clicks" stroke={COLORS.clicks} strokeWidth={3} dot={{r:4,fill:COLORS.clicks}} name="Clicks"/>
                <Line type="monotone" dataKey="impressions" stroke={COLORS.impressions} strokeWidth={3} dot={{r:4,fill:COLORS.impressions}} name="Impressions"/>
              </LineChart>
            </ResponsiveContainer>
          </div>}
        </CardContent>
      </Card>
    </TabsContent>

    {/* queries */}
    <TabsContent value="queries">
      <Table title="Top Search Queries" loading={loading} rows={queries} keyFn={(r)=>r.query}
        cols={[
          {header:"Query",       render:(r)=>r.query,                                    cell:"text-gray-900 font-medium max-w-xs truncate"},
          {header:"Clicks",      render:(r)=>r.clicks,      num:1},
          {header:"Impressions", render:(r)=>r.impressions, num:1, extra:"text-gray-600"},
          {header:"CTR",         render:(r)=>r.impressions?((r.clicks/r.impressions)*100).toFixed(2)+"%":"—", badge:1},
        ]}/>
    </TabsContent>

    {/* pages */}
    <TabsContent value="pages">
      {page?
        <Card className="text-center py-8"><CardContent><p className="text-gray-600">Switch to “All pages” to see top pages.</p></CardContent></Card>
        :
        <Table title="Top Pages" loading={loading} rows={pages} keyFn={(r)=>r.page}
          cols={[
            {header:"Page",       render:(r)=>r.page.replace(/^https?:\/\//,""),         cell:"text-gray-900 font-medium max-w-xs truncate"},
            {header:"Clicks",     render:(r)=>r.clicks,      num:1},
            {header:"Impressions",render:(r)=>r.impressions, num:1, extra:"text-gray-600"},
            {header:"CTR",        render:(r)=>r.impressions?((r.clicks/r.impressions)*100).toFixed(2)+"%":"—", badge:1},
          ]}/>
      }
    </TabsContent>

    {/* countries */}
    <TabsContent value="countries">
      {country?
        <Card className="text-center py-8"><CardContent><p className="text-gray-600">Switch to “All countries” to see country breakdown.</p></CardContent></Card>
        :
        <Table title="Top Countries" loading={loading} rows={countries} keyFn={(r)=>r.country}
          cols={[
            {header:"Country",     render:(r)=>COUNTRY_NAMES[r.country.toUpperCase()]??r.country.toUpperCase(), cell:"text-gray-900 font-medium"},
            {header:"Clicks",      render:(r)=>r.clicks,      num:1},
            {header:"Impressions", render:(r)=>r.impressions, num:1, extra:"text-gray-600"},
            {header:"CTR",         render:(r)=>r.impressions?((r.clicks/r.impressions)*100).toFixed(2)+"%":"—", badge:1},
          ]}/>
      }
    </TabsContent>

    {/* report */}
    <TabsContent value="report"><ReportTab url={page}/></TabsContent>
  </Tabs>

  {error&&<Card className="border-red-200 bg-red-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-red-100 rounded-full"><RefreshCw className="h-4 w-4 text-red-600"/></div><div><h4 className="font-semibold text-red-900">Error</h4><p className="text-red-700 text-sm">{error}</p></div></div></CardContent></Card>}
  </>)}
</div></div></>)
}

/* ────────────────────────── tiny helper components ── */
function Selector({label,value,onChange,options,placeholder,disabled,w}:{label:string,value:string|undefined,onChange:(v:string)=>void,options:{value:string,label:string}[],placeholder:string,disabled?:boolean,w:string}){
  return(<div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[${w}]`}>
        <SelectValue placeholder={placeholder}/>
      </SelectTrigger>
      <SelectContent>
        {options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>)
}
function Kpi({loading,title,value,icon,bg}:{loading:boolean,title:string,value:string,icon:React.ReactNode,bg:string}){
  return(<Card className="relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-20 h-20 bg-${bg}/10 rounded-full -mr-10 -mt-10`}/>
    <CardHeader className="pb-2"><CardTitle className="flex gap-2 items-center text-sm text-gray-600 font-medium">{icon}{title}</CardTitle></CardHeader>
    <CardContent>{loading?<Skeleton className="h-8 w-24"/>:<p className="text-3xl font-bold text-gray-900">{value}</p>}</CardContent>
  </Card>)
}
function Table<T>({title,loading,rows,cols,keyFn}:{title:string,loading:boolean,rows:T[],cols:{header:string;render:(r:T)=>string|number;num?:1;cell?:string;extra?:string;badge?:1}[],keyFn:(r:T)=>string|number}){
  return(<Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
    <thead className="border-b bg-gray-50/80 sticky top-0"><tr>
      {cols.map(c=><th key={c.header} className={`px-6 py-4 ${c.num?"text-right":"text-left"} font-semibold text-gray-900`}>{c.header}</th>)}
    </tr></thead>
    <tbody>
      {loading?Array(8).fill(0).map((_,i)=><tr key={i} className="border-b border-gray-100">{cols.map((c,j)=><td key={j} className={`px-6 py-4 ${c.num?"text-right":""}`}><Skeleton className={`h-4 ${c.num?"w-12 ml-auto":"w-64"}`}/></td>)}</tr>):
      rows.map((r,i)=><tr key={keyFn(r)} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        {cols.map((c,j)=>{const val=c.render(r);return(<td key={j} className={`px-6 py-4 ${c.num?"text-right":""} ${c.extra??""}`}>
          {c.badge?<Badge variant="secondary" className="font-medium">{val}</Badge>
                   :<span className={c.cell??""} title={typeof val==="string"?val:undefined}>{val}</span>}
        </td>)})}
      </tr>)}
    </tbody></table></div></CardContent></Card>)
}
type DPProps={label:string;date:Date;setDate:(d:Date)=>void}
function DatePicker({label,date,setDate}:DPProps){
  return(<div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Popover><PopoverTrigger asChild>
      <Button variant="outline" className="w-[160px] justify-start font-normal">
        <CalendarIcon className="mr-2 h-4 w-4"/>{date?format(date,"MMM dd, yyyy"):label}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(d)=>d&&setDate(d)} initialFocus/></PopoverContent></Popover>
  </div>)
}
