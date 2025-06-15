/**
 * Canonical list of CloudSine blog posts *and* the in-app SEO-report
 * components that belong to them.
 *
 *  ▸ BLOG_URLS    – simple string array, unchanged usage
 *  ▸ BLOG_REPORTS – url → lazy loader for the <Report /> component
 *                   (or null for “coming soon”)
 */

 import type { ComponentType } from "react"

 /* ─────────────────────────── 1. URL list (order preserved) */
 export const BLOG_URLS: string[] = [
   "https://www.cloudsine.tech/how-to-secure-your-retrieval-augmented-generation-rag-applications/",
 ]
 
 /* ─────────────────────────── 2. Report mapping
    Keys *must* exactly match the strings in BLOG_URLS.
    Values are functions that import the report page on demand,
    so the heavy bundles load only when the user opens the “Report” tab. */
 export type ReportModule = { default: ComponentType<any> }
 
 export const BLOG_REPORTS: Record<string, (() => Promise<ReportModule>) | null> = {
   // Report 4 – RAG security  ➜  not written yet
   "https://www.cloudsine.tech/how-to-secure-your-retrieval-augmented-generation-rag-applications/":
     null,
 
   // Report 3 – AI Security Frameworks  (READY, lives at /report-three)
   "https://www.cloudsine.tech/making-sense-of-ai-security-frameworks-owasp-mitre-atlas-and-the-nist-rmf/":
     () => import("@/app/report-three/page"),
 
   // Report 2 – LLM Vulnerabilities  (READY, lives at /report-two)
   "https://www.cloudsine.tech/llm-vulnerabilities-8-critical-threats-and-how-to-mitigate-them/":
     () => import("@/app/report-two/page"),
 
   // Report 1 – Adversarial Prompts  (READY, lives at /report)
   "https://www.cloudsine.tech/detecting-and-defending-against-adversarial-prompts-in-generative-ai-systems/":
     () => import("@/app/report/page"),
 }
 
 /* ─────────────────────────── 3. Helper */
 export const isReportReady = (url: string): boolean =>
   typeof BLOG_REPORTS[url] === "function"
 
