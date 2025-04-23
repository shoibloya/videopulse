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
    tags: ["Admin"],
    completed: true,
  },
  {
    id: 2,
    title: "Client Onboarded",
    description: "Start of Subscription",
    date: "2025-03-20T00:00:00Z",
    colorIndex: 3,
    tags: ["Admin"],
    completed: true,
  },
  {
    id: 3,
    title: "Making Sense of AI Security Frameworks: Your Roadmap to OWASP, MITRE ATLAS, and the NIST RMF",
    description: "Blog for approval",
    date: "2025-04-23T00:00:00Z",
    colorIndex: 2,
    tags: ["Blog"],
    completed: false,
  },
  {
    id: 4,
    title: "Building a Safer Tomorrow: How to Secure Your Retrieval-Augmented Generation (RAG) Applications, Inside and Out",
    description: "Blog for approval",
    date: "2025-04-23T00:00:00Z",
    colorIndex: 2,
    tags: ["Blog"],
    completed: false,
  },
  {
    id: 5,
    title: "Choosing a Generative AI Security Platform: Key Features and Gaps to Consider",
    description: "Forward-looking CIOs and CISOs need more than vendor lists when choosing a GenAI security platform. This guide outlines key features, identifies gaps in current solutions, and offers actionable insight for evaluating enterprise-grade GenAI protection.",
    date: "2025-04-25T00:00:00Z",
    colorIndex: 2,
    tags: ["Blog"],
    completed: false,
  },
  {
    id: 6,
    title: "Securing Enterprise AI Chatbots: Best Practices for Safe Deployment",
    description: "LLM-powered chatbots present unique risks beyond traditional chatbot threats. Learn best practices for protecting AI systems from prompt injection, data leakage, and unmonitored output in an enterprise setting.",
    date: "2025-05-02T00:00:00Z",
    colorIndex: 2,
    tags: ["Blog"],
    completed: false,
  },
  {
    id: 7,
    title: "What is a Generative AI Firewall and Do You Need One?",
    description: "A GenAI firewall monitors prompts and model outputs for sensitive content or threats. Discover how this new security layer protects enterprise AI from data leaks, jailbreaks, and policy violations.",
    date: "2025-05-09T00:00:00Z",
    colorIndex: 2,
    tags: ["Blog"],
    completed: false,
  },
  {
    id: 8,
    title: "Preventing Data Leaks in Generative AI Applications",
    description: "CISOs are rethinking data loss prevention in the age of GenAI. This article explains why conventional DLP tools fall short, and how new LLM-aware approaches like Cloudsine’s GenAI firewall close the gap.",
    date: "2025-05-16T00:00:00Z",
    colorIndex: 2,
    tags: ["Blog"],
    completed: false,
  },
  {
    id: 9,
    title: "Subscription Renewable",
    description: "Renewal of the client subscription for continued service.",
    date: "2025-05-20T00:00:00Z",
    colorIndex: 3,
    tags: ["Admin"],
    completed: false,
  }
]
