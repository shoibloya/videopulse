// lib/agents.ts
export type Agent = {
  id: string
  name: string
  purpose: string
  status: 'ready' | 'upcoming'
  widgetId?: string
  upcomingDate?: string
  type: 'inplace' | 'newpage' // Added type field
  slug?: string // Added slug field for 'newpage' agents
}

export async function getAgents(): Promise<Agent[]> {
  return [
    {
      id: "onboarding",
      name: "Onboarding Agent",
      purpose: "Onboard Tracework with Nuggt",
      status: "ready",
      widgetId: "43iMiW9BUtXFmZBor2YG", // widget embed id
      type: "inplace", // Example type
    },

    {
      id: "posthog",
      name: "PostHog Agent",
      purpose: "Connect posthog analytics for traffic data",
      status: "ready",
      type: "newpage", // Example type
      slug: "/posthog-agent", // Example URL slug
    },
    
    {
      id: "blog",
      name: "Blog Post Agent",
      purpose: "Going through first blog post",
      status: "ready",
      type: "newpage", // Example type
      slug: "/blog-post-agent", // Example URL slug
    },

    {
      id: "how-to-queries",
      name: "How To Queries Agent",
      purpose: "Targeting How To Guides like 'How to login on monday.com'",
      status: "upcoming",
      upcomingDate: "27th Feb",
      type: "inplace", // Example type
    },

  ]
}
