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
      purpose: "Onboard StudyChat with Nuggt",
      status: "ready",
      widgetId: "8Rhjcql8ubCbW3JbZfbk", // widget embed id
      type: "inplace", // Example type
    },
    {
      id: "tools",
      name: "Tool Agent",
      purpose: "Add a pomodoro timer",
      status: "ready",
      widgetId: "CgUbMTZShN8R9uN404mU", // widget embed id
      type: "newpage",
      slug: "/tool" // Example type
    },
    {
      id: "blogs",
      name: "blogs that StudyChat Can Rank for",
      purpose: "Targeting blogs like best study tools",
      status: "upcoming",
      upcomingDate: "27th Feb",
      type: "inplace", // Example type
    },

  ]
}
