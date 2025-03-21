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
      purpose: "Onboard Coco Pixels with Nuggt",
      status: "ready",
      widgetId: "D1qdaBBDlMtTjeiTwOFy", // widget embed id
      type: "inplace", // Example type
    },
    {
      id: "monthly",
      name: "Monthly Reporting Agent (March-April)",
      purpose: "Reports from first month of subscription",
      status: "upcoming",
      upcomingDate: "16th March",
      type: "inplace", // Example type
    },

  ]
}
