"use client"

import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample blog data - replace with your actual data source
const blogPosts = [
  {
    id: 1,
    title: "Detecting and Defending Against Adverserial Prompts: Secure Your GenAI Systems",
    excerpt: "Explore comprehensive strategies to detect and defend against adverserial prompts in generative AI. Learn how embedding similarity, pattern matching, and red teaming can safeguard your AI applications from malicious prompt attacks.",
    imageUrl: "/image_1.png?height=200&width=400",
    date: "Mar 28, 2025",
    readTime: "12 min read",
    url: "/blog-one",
    status: "pending",
  },
  {
    id: 2,
    title: "Securing Large Language Models: A Deep Dive into Vulnerabilities and Mitigation Strategies",
    excerpt: "Generative AI powered by large language models (LLMs) is rapidly transforming enterprise operations—from customer service chatbots to automated analytics. However, as enterprises integrate these systems, they must also address emerging vulnerabilities. In this blog, we explore critical vulnerabilities affecting large language models, including prompt injection, context hijacking, and model jailbreaks. We also outline actionable mitigation strategies, such as prompt engineering, fine-tuning, red teaming, and the implementation of robust guardrails. By understanding these risks and applying layered security measures, organizations can better safeguard their generative AI deployments.",
    imageUrl: "/blog-two.png?height=200&width=400",
    date: "Apr 7",
    readTime: "12 min read",
    url: "/blog-two",
    status: "pending",
  },
  {
    id: 3,
    title: "Making Sense of AI Security Frameworks: Your Roadmap to OWASP, MITRE ATLAS, and the NIST RMF",
    excerpt: "Blog for approval",
    imageUrl: "/blog-three.png?height=200&width=400",
    date: "Apr 23",
    readTime: "12 min read",
    url: "https://docs.google.com/document/d/1cDA05JlWRbdEKBTbrSgFzhH7gBOyIEZ5j5iIPNhIItE/edit?usp=sharing",
    status: "pending",
  },
  {
    id: 4,
    title: "Building a Safer Tomorrow: How to Secure Your Retrieval-Augmented Generation (RAG) Applications, Inside and Out",
    excerpt: "Blog for approval",
    imageUrl: "/blog-four.png?height=200&width=400",
    date: "Apr 23",
    readTime: "12 min read",
    url: "https://docs.google.com/document/d/1DVh8IUCr6EGaeJNqBh_6Q1qqcx9_3gDK8816ZFWK3XM/edit?usp=sharing",
    status: "pending",
  },
  {
    id: 5,
    title: "Choosing a Generative AI Security Platform: Key Features and Gaps to Consider",
    excerpt: "Forward-looking CIOs and CISOs need more than vendor lists when choosing a GenAI security platform. This guide outlines key features, identifies gaps in current solutions, and offers actionable insight for evaluating enterprise-grade GenAI protection.",
    imageUrl: "/outline.png?height=200&width=400",
    date: "Apr 25",
    readTime: "12 min read",
    url: "/blog-five",
    status: "pending",
  },
  {
    id: 6,
    title: "Securing Enterprise AI Chatbots: Best Practices for Safe Deployment",
    excerpt: "LLM-powered chatbots present unique risks beyond traditional chatbot threats. Learn best practices for protecting AI systems from prompt injection, data leakage, and unmonitored output in an enterprise setting.",
    imageUrl: "/outline.png?height=200&width=400",
    date: "May 2",
    readTime: "12 min read",
    url: "/blog-six",
    status: "pending",
  },
  {
    id: 7,
    title: "What is a Generative AI Firewall and Do You Need One?",
    excerpt: "A GenAI firewall monitors prompts and model outputs for sensitive content or threats. Discover how this new security layer protects enterprise AI from data leaks, jailbreaks, and policy violations.",
    imageUrl: "/outline.png?height=200&width=400",
    date: "May 9",
    readTime: "12 min read",
    url: "/blog-seven",
    status: "pending",
  },
  {
    id: 8,
    title: "Preventing Data Leaks in Generative AI Applications",
    excerpt: "CISOs are rethinking data loss prevention in the age of GenAI. This article explains why conventional DLP tools fall short, and how new LLM-aware approaches like Cloudsine’s GenAI firewall close the gap.",
    imageUrl: "/outline.png?height=200&width=400",
    date: "May 16",
    readTime: "12 min read",
    url: "/blog-eight",
    status: "pending",
  },
  
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function BlogSection() {
  // Filter posts by status
  const publishedPosts = blogPosts.filter((post) => post.status === "published")
  const pendingPosts = blogPosts.filter((post) => post.status === "pending")

  // Blog card component to avoid repetition
  const BlogCard = ({ post }: { post: (typeof blogPosts)[0] }) => (
    <motion.div variants={itemVariants}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video overflow-hidden">
          <img
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Badge variant={post.status === "published" ? "default" : "outline"} className="rounded-full">
              {post.status === "published" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Published
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              )}
            </Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{post.date}</span>
            </div>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button variant="link" className="px-0 text-primary" asChild>
            <a href={post.url} className="flex items-center gap-1">
              Read more <ArrowRight className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <Tabs defaultValue="pending">
        <Card className="border bg-card/50 shadow-md backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Blogs</h2>
                <p className="text-muted-foreground mt-1">List of Blogs</p>
              </div>
              <TabsList className="bg-background/80 backdrop-blur-sm">
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <TabsContent value="published" className="mt-0">
              {publishedPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {publishedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10 p-10 text-center">
                  <CheckCircle className="mb-2 h-10 w-10 text-muted-foreground/60" />
                  <h3 className="mb-2 text-lg font-medium">No published blogs</h3>
                  <p className="text-sm text-muted-foreground">Your published blogs will appear here.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              {pendingPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {pendingPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10 p-10 text-center">
                  <Clock className="mb-2 h-10 w-10 text-muted-foreground/60" />
                  <h3 className="mb-2 text-lg font-medium">No pending blogs</h3>
                  <p className="text-sm text-muted-foreground">Blogs waiting for approval will appear here.</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  )
}

