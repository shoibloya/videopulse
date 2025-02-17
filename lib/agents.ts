// lib/agents.ts
export type Agent = {
    id: string
    name: string
    purpose: string
    status: 'ready' | 'upcoming'
    widgetId?: string
    upcomingDate?: string
  }
  
  export async function getAgents(): Promise<Agent[]> {
    return [
      {
        id: "onboarding",
        name: "Onboarding Agent",
        purpose: "Onboard Tracework with Nuggt",
        status: "ready",
        widgetId: "43iMiW9BUtXFmZBor2YG", // widget embed id
      },
      {
        id: "blog",
        name: "Blog Post Agent",
        purpose: "Going through first blog post",
        status: "upcoming",
        upcomingDate: "19th Feb",
      },
    ]
  }
  