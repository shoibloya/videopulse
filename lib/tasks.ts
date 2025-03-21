// lib/tasks.ts
export type Task = {
  id: number
  title: string
  description: string
  date: string
  completed?: boolean
  location?: string
  tags?: string[]
  colorIndex?: number
}
  
  export const tasks: Task[] = [
    {
      id: 1,
      title: "Website Analysed",
      description: "Nuggt team analysed the website and created the blog and backlinks strategy.",
      date: "2025-03-21T00:00:00Z",
      colorIndex: 4,
      //location: "Conference Room A",
      tags: ["Admin"],
      completed: true, 
    },
    {
      id: 2,
      title: "Client Onboarded",
      description: "Start of Subscription",
      date: "2025-03-17T00:00:00Z",
      colorIndex: 3,
      //location: "Conference Room A",
      tags: ["Admin"],
      completed: true,
    },
    {
        id: 3,
        title: "First Blog Post",
        description: "The Importance of Storytelling in Video Production: How Engaging Narratives Enhance Brand Identity. Storytelling is a powerful way to evoke emotions and convey ideas.",
        date: "2025-03-26T00:00:00Z",
        colorIndex: 2,
        //location: "Conference Room A",
        tags: ["Blog"],
        completed: false,
    },
    {
      id: 4,
      title: "[Batch 1]: Backlink Request Emails",
      description: "Nuggt team will reach out to there partners to get Coco Pixels listed on other higher authority blog sites.",
      date: "2025-04-04T00:00:00Z",
      colorIndex: 5,
      //location: "Conference Room A",
      tags: ["Blog"],
      completed: false,
  },
  {
    id: 5,
    title: "[Batch 2]: Backlink Request Emails",
    description: "Nuggt team will reach out to there partners to get Coco Pixels listed on other higher authority blog sites.",
    date: "2025-04-11T00:00:00Z",
    colorIndex: 5,
    //location: "Conference Room A",
    tags: ["Blog"],
    completed: false,
},
    {
      id: 6,
      title: "Second Blog Post",
      description: "Top 5 Video Production Trends in 2025: Staying Ahead in a Rapidly Evolving Industry. Discussing current trends positions us as thought leaders who stay updated with industry advancements. This can attract clients looking for modern and innovative video solutions, enhancing our SEO by targeting trending keywords related to video production. ",
      date: "2025-04-02T00:00:00Z",
      colorIndex: 2,
      //location: "Zoom",
      tags: ["Blog"],
      completed: false,
    },
    {
        id: 7,
        title: "Third Blogpost",
        description: "Behind the Scenes: Our Process from Conceptualization to Final Cut. Offering a behind-the-scenes look at our production process can demonstrate transparency and build trust with potential clients.",
        date: "2025-04-09T00:00:00Z",
        colorIndex: 2,
        //location: "Zoom",
        tags: ["Blog"],
        completed: false,
      },
    {
      id: 8,
      title: "Fourth Blog Post",
      description: "Client Success Stories: How Our Video Solutions Transformed Brands. Sharing case studies or success stories provides social proof of our capabilities and effectiveness. It demonstrates real-world applications of our services and the positive outcomes achieved, which can be persuasive for potential clients considering our services.",
      date: "2025-04-14T00:00:00Z",
      colorIndex: 2,
      //location: "Production",
      tags: ["Blog"],
      completed: false,
    },
    {
      id: 9,
      title: "Monthly Report",
      description: "Posting second blog post on the topic AI in Translation: Hype vs. Reality for Businesses. Goal is to set foundation for keywords like 'AI translation'",
      date: "2025-04-16T00:00:00Z",
      colorIndex: 4,
      //location: "Production",
      tags: ["Admin"],
      completed: false,
    },


    {
      id: 10,
      title: "Subscription Renewable",
      description: "Posting second blog post on the topic AI in Translation: Hype vs. Reality for Businesses. Goal is to set foundation for keywords like 'AI translation'",
      date: "2025-04-17T00:00:00Z",
      colorIndex: 3,
      //location: "Production",
      tags: ["Admin"],
      completed: false,
    },
  ];
  