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
      purpose: "Onboard Ladon Translation with Nuggt",
      status: "ready",
      widgetId: "85QTYmLq1yvusZoTlFZD", // widget embed id
      type: "inplace", // Example type
    },
    {
      id: "blogs",
      name: "Blog Post Report",
      purpose: "First blog post update",
      status: "upcoming",
      upcomingDate: "7th March",
      type: "inplace", // Example type
    },

  ]
}
