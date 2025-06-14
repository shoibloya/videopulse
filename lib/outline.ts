/* -------------------------------------------------------------------------- */
/*  Outline model                                                             */
/* -------------------------------------------------------------------------- */

export type Keyword = {
  keyword: string
  intent:
    | "Transactional"
    | "Informational"
    | "Navigational"
    | "Commercial"
}

export interface Outline {
  slug: string
  date: string
  seoTitle: string
  seoDescription: string
  articleTitle: string
  gapHeading: string
  gapBody: string
  fillGapHeading: string
  fillGapBody: string
  keywords: Keyword[]
}

/* -------------------------------------------------------------------------- */
/*  SaaS Animated Video & Tech Simplification Outlines                        */
/* -------------------------------------------------------------------------- */

export const outlines: Outline[] = [
  /* ───────────── 1. SaaS Conversions via Animated Video ───────────── */
  {
    slug: "saas-animated-video-conversion",
    date: "June 20, 2025",
    seoTitle:
      "SEO Keyword Plan: Boosting SaaS Conversions Using Animated Product Videos",
    seoDescription:
      "A strategic guide for SaaS marketers on how to use animated videos to improve engagement, reduce bounce rates, and increase product signups.",
    articleTitle:
      "Increase SaaS Conversions with Animated Product Videos: A Strategic Guide",
    gapHeading: "Content Gap",
    gapBody:
      "Most current articles focus on high-level animation benefits but skip over post-production, ROI tracking, personalization, and the integration of video assets into multi-channel SaaS sales funnels.",
    fillGapHeading: "How to Fill the Gap",
    fillGapBody:
      "Create a comprehensive guide that combines explainer video storytelling with insights on post-production optimization, ROI calculators, funnel-based animation formats, and interactive media examples. Support the strategy with embedded templates, calculators, and annotated case study videos.",
    keywords: [
      { keyword: "SaaS product video animation", intent: "Informational" },
      { keyword: "explainer videos for SaaS conversions", intent: "Informational" },
      { keyword: "animated onboarding video SaaS", intent: "Informational" },
      { keyword: "how animation boosts SaaS engagement", intent: "Informational" },
      { keyword: "SaaS sales funnel animated video", intent: "Informational" },
      { keyword: "interactive animated demo SaaS", intent: "Informational" },
    ],
  },

  /* ───────────── 2. Simplifying Tech Concepts for Business ───────────── */
  {
    slug: "simplify-tech-for-business",
    date: "June 25, 2025",
    seoTitle:
      "SEO Keyword Plan: How to Simplify Technical Concepts for Business Decision Makers",
    seoDescription:
      "A guide for tech consultants and SaaS leaders on communicating complex technologies to non-technical stakeholders using visual aids, analogies, and measurable frameworks.",
    articleTitle:
      "How to Simplify Technical Concepts for Non-Technical Business Decision Makers",
    gapHeading: "Content Gap",
    gapBody:
      "Few resources show how to quantify ROI from simplified technical communication or offer interactive frameworks for tailoring content by executive level. Emerging engagement formats like live dashboards and real-time simulations are underrepresented.",
    fillGapHeading: "How to Fill the Gap",
    fillGapBody:
      "Publish a business-oriented guide to tech simplification that includes visual decision tools, plain-language matrices, interactive examples, and customizable frameworks for different audience types. Back it with real-world use cases and before/after success stories.",
    keywords: [
      { keyword: "simplify technical concepts for executives", intent: "Informational" },
      { keyword: "explain tech to non-technical stakeholders", intent: "Informational" },
      { keyword: "tech communication for business leaders", intent: "Informational" },
      { keyword: "framework to simplify tech investment", intent: "Informational" },
      { keyword: "how to communicate complex tech ideas", intent: "Informational" },
      { keyword: "interactive tools for tech decision making", intent: "Informational" },
    ],
  },

  /* ───────────── 3. Reducing SaaS Video Production Costs ───────────── */
  {
    slug: "reduce-saas-video-production-costs",
    date: "June 27, 2025",
    seoTitle:
      "SEO Keyword Plan: Reducing Video Production Costs for SaaS Product Launches",
    seoDescription:
      "A cost-saving guide for SaaS marketers looking to launch product videos using budget-friendly tools, templates, and DIY production workflows.",
    articleTitle:
      "How to Reduce Video Production Costs for SaaS Marketing Without Sacrificing Quality",
    gapHeading: "Content Gap",
    gapBody:
      "While SaaS cost optimization is common, few resources target video-specific cost strategies like in-house production tips, ROI measurement, and real case studies of budget-conscious product launches.",
    fillGapHeading: "How to Fill the Gap",
    fillGapBody:
      "Build a how-to guide that features step-by-step low-budget video creation tips, downloadable production templates, and real ROI calculators. Include live-action vs. animation cost comparisons and embedded success stories of SaaS launches on a tight budget.",
    keywords: [
      { keyword: "cut video costs for SaaS launch", intent: "Informational" },
      { keyword: "DIY video production SaaS marketing", intent: "Informational" },
      { keyword: "affordable SaaS explainer video tools", intent: "Informational" },
      { keyword: "budget video strategy SaaS launch", intent: "Informational" },
      { keyword: "video template for SaaS product demo", intent: "Informational" },
      { keyword: "SaaS video production ROI calculator", intent: "Informational" },
    ],
  },
];