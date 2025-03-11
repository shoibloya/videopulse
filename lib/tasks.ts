// lib/tasks.ts

export interface Task {
    id: number;
    title: string;
    description: string;
    date: string; // ISO date string
    colorIndex?: number; // Optional: index to choose a color from the palette
    location?: string;
    tags?: string[];
  }
  
  export const tasks: Task[] = [
    {
      id: 1,
      title: "Client Onboarded",
      description: "Start of Subscription",
      date: "2025-03-10T00:00:00Z",
      colorIndex: 3,
      //location: "Conference Room A",
      tags: ["Admin"],
    },
    {
        id: 2,
        title: "Connecting Posthog for analytics",
        description: "Connecting analytics tools to understand human behavior and track traffic from google.",
        date: "2025-03-12T00:00:00Z",
        colorIndex: 2,
        //location: "Conference Room A",
        tags: ["Technical"],
    },
    {
      id: 3,
      title: "First Blog Post",
      description: "Posting first blog post on the topic 'how to translate a document'. Goal is to target basic keywords like: 'translate document', 'document translation' etc.",
      date: "2025-03-13T00:00:00Z",
      colorIndex: 1,
      //location: "Zoom",
      tags: ["Blog"],
    },
    {
        id: 4,
        title: "Internal Linking Inspection",
        description: "Linking pages properly and debugging slow website load time.",
        date: "2025-03-14T00:00:00Z",
        colorIndex: 1,
        //location: "Zoom",
        tags: ["Blog"],
      },
    {
      id: 5,
      title: "Second Blog Post",
      description: "Posting second blog post on the topic AI in Translation: Hype vs. Reality for Businesses. Goal is to set foundation for keywords like 'AI translation'",
      date: "2025-03-15T00:00:00Z",
      colorIndex: 1,
      //location: "Production",
      tags: ["Blog"],
    },
    {
      id: 6,
      title: "Week 1 Report",
      description: "Reporting on previous week. Approval for next week.",
      date: "2025-03-17T00:00:00Z",
      colorIndex: 3,
      //location: "Meeting Room B",
      tags: ["Admin"],
    },
    {
      id: 7,
      title: "Dedicated Page for English to Spanish (TBC)",
      description: "Posting a dedicated page for each language translation. The page will contain case studies for that particular translation. The exact translation to be decided based on inputs from the client.",
      date: "2025-03-19T00:00:00Z",
      colorIndex: 4,
      //location: "Skype",
      tags: ["Language Page"],
    },
    {
      id: 8,
      title: "Dedicated Page for English to Portugese (TBC)",
      description: "Posting a dedicated page for each language translation. The page will contain case studies for that particular translation. The exact translation to be decided based on inputs from the client.",
      date: "2025-03-21T00:00:00Z",
      colorIndex: 4,
      //location: "Restaurant",
      //tags: ["Team", "Lunch"],
    },
    {
        id: 9,
        title: "Week 2 Report",
        description: "Reporting on previous week. Approval for next week.",
        date: "2025-03-24T00:00:00Z",
        colorIndex: 3,
        //location: "Restaurant",
        tags: ["Admin"],
      },
      {
        id: 10,
        title: "AI translation Tool",
        description: "A simple tool that allows users to instantly translate from one language to another.",
        date: "2025-03-27T00:00:00Z",
        colorIndex: 5,
        //location: "Restaurant",
        tags: ["Tool"],
      },
      {
        id: 11,
        title: "Week 3 Report",
        description: "Reporting on previous week. Approval for next week.",
        date: "2025-03-31T00:00:00Z",
        colorIndex: 3,
        //location: "Restaurant",
        tags: ["Admin"],
      },
      {
        id: 12,
        title: "Week 4 Report",
        description: "Reporting on previous week. Approval for next week.",
        date: "2025-04-07T00:00:00Z",
        colorIndex: 3,
        //location: "Restaurant",
        tags: ["Admin"],
      },
      {
        id: 13,
        title: "Subscription Renewable Date",
        description: "Subscription Renewable Date",
        date: "2025-04-07T00:00:00Z",
        colorIndex: 3,
        //location: "Restaurant",
        tags: ["Admin"],
      },
  ];
  