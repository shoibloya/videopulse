"use client";

import { useEffect, useMemo, useState } from "react";
import { ref as dbRef, onValue, set, child } from "firebase/database";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle, Clock, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COMPANY_NAME = "Cloudsine";

// Sample blog data - replace with your actual data source
const seedPosts = [
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

type BlogCore = (typeof seedPosts)[number];
type BlogPost = BlogCore & { key: string };

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  /* ---------- fetch live list & seed missing ---------- */
  useEffect(() => {
    const listRef = dbRef(db, `blogUploadsNew/${COMPANY_NAME}`);

    const unsub = onValue(listRef, (snap) => {
      const raw = snap.val() ?? {};
      const loaded: BlogPost[] = Object.entries(raw).map(([key, val]) => ({
        key,
        ...(val as BlogCore),
      }));
      setPosts(loaded);

      /* seed once */
      seedPosts.forEach((p) => {
        if (!loaded.some((l) => l.id === p.id)) {
          set(child(listRef, String(p.id)), p);
        }
      });
    });

    return () => unsub();
  }, []);

  /* ---------- splits ---------- */
  const { published, pending } = useMemo(() => {
    return {
      published: posts.filter((p) => p.status === "published"),
      pending: posts.filter((p) => p.status === "pending"),
    };
  }, [posts]);

  /* ---------- animations ---------- */
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /* ---------- card ---------- */
  const BlogCard = ({ post }: { post: BlogPost }) => (
    <motion.div variants={item}>
      <Card className="relative h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video overflow-hidden">
          <img
            src={post.imageUrl || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        <Link
          href={`/blog-upload/${post.key}`}
          className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Link>

        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant={post.status === "published" ? "default" : "outline"}
              className="rounded-full"
            >
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
              <span>
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(post.date))}
              </span>
            </div>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h3 className="mb-2 line-clamp-2 font-semibold">{post.title}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button variant="link" className="px-0 text-primary" asChild>
            <a
              href={post.url}
              className="flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  /* ---------- render ---------- */
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Tabs defaultValue="pending">
        <Card className="border bg-card/50 shadow-md backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Blogs</h2>
                <p className="mt-1 text-muted-foreground">List of Blogs</p>
              </div>
              <TabsList className="bg-background/80 backdrop-blur-sm">
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <TabsContent value="published" className="mt-0">
              {published.length ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {published.map((p) => (
                    <BlogCard key={p.key} post={p} />
                  ))}
                </div>
              ) : (
                <Empty state="published" />
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              {pending.length ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {pending.map((p) => (
                    <BlogCard key={p.key} post={p} />
                  ))}
                </div>
              ) : (
                <Empty state="pending" />
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  );
}

/* ---------- empty state ---------- */
function Empty({ state }: { state: "published" | "pending" }) {
  const Icon = state === "published" ? CheckCircle : Clock;
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10 p-10 text-center">
      <Icon className="mb-2 h-10 w-10 text-muted-foreground/60" />
      <h3 className="mb-2 text-lg font-medium">
        {state === "published" ? "No published blogs" : "No pending blogs"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {state === "published"
          ? "Your published blogs will appear here."
          : "Blogs waiting for approval will appear here."}
      </p>
    </div>
  );
}

