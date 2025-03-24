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
      date: "2025-03-24T00:00:00Z",
      colorIndex: 4,
      //location: "Conference Room A",
      tags: ["Admin"],
      completed: true, 
    },
    {
      id: 2,
      title: "Client Onboarded",
      description: "Start of Subscription",
      date: "2025-03-20T00:00:00Z",
      colorIndex: 3,
      //location: "Conference Room A",
      tags: ["Admin"],
      completed: true,
    },
    {
        id: 3,
        title: "First Blog Post",
        description: "Detecting and Defending Against Adversarial Prompts in Generative AI Systems. Description: Explore how adversarial prompts exploit the behavior of LLMs by crafting malicious input sequences. This blog covers detection strategies (embedding similarity, input pattern matching), response hardening techniques (output filtering, safety layers), and methods to evaluate prompt robustness during development and deployment.",
        date: "2025-03-27T00:00:00Z",
        colorIndex: 2,
        //location: "Conference Room A",
        tags: ["Blog"],
        completed: false,
    },
    {
      id: 4,
      title: "[Batch 1]: Backlink Request Emails",
      description: "Nuggt team will reach out to there partners to get Cloudsine listed on other higher authority blog sites.",
      date: "2025-04-11T00:00:00Z",
      colorIndex: 5,
      //location: "Conference Room A",
      tags: ["Backlinks"],
      completed: false,
  },
    {
      id: 5,
      title: "Second Blog Post",
      description: "A Deep Dive into LLM Vulnerabilities and How to Secure Generative AI Models. Description: A technical breakdown of critical vulnerabilities affecting large language models, including prompt injection, context hijacking, and model jailbreaks. This blog highlights how attackers exploit these weaknesses, discusses real-world case studies, and presents countermeasures through prompt engineering, fine-tuning, red teaming, and guardrail implementation to enhance LLM safety and resilience.",
      date: "2025-04-06T00:00:00Z",
      colorIndex: 2,
      //location: "Zoom",
      tags: ["Blog"],
      completed: false,
    },
    {
        id: 6,
        title: "Third Blogpost",
        description: "TBC based on the performance of the past two blog posts.",
        date: "2025-04-13T00:00:00Z",
        colorIndex: 2,
        //location: "Zoom",
        tags: ["Blog"],
        completed: false,
      },
    {
      id: 7,
      title: "Fourth Blog Post",
      description: "TBC based on the performance of the past two blog posts.",
      date: "2025-04-18T00:00:00Z",
      colorIndex: 2,
      //location: "Production",
      tags: ["Blog"],
      completed: false,
    },
    {
      id: 8,
      title: "Monthly Report",
      description: "Posting second blog post on the topic AI in Translation: Hype vs. Reality for Businesses. Goal is to set foundation for keywords like 'AI translation'",
      date: "2025-04-19T00:00:00Z",
      colorIndex: 4,
      //location: "Production",
      tags: ["Admin"],
      completed: false,
    },


    {
      id: 9,
      title: "Subscription Renewable",
      description: "Posting second blog post on the topic AI in Translation: Hype vs. Reality for Businesses. Goal is to set foundation for keywords like 'AI translation'",
      date: "2025-04-20T00:00:00Z",
      colorIndex: 3,
      //location: "Production",
      tags: ["Admin"],
      completed: false,
    },
  ];
  