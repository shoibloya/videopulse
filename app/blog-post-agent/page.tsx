"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

// New component: SOPArticleDisplay using shadcn and Tailwind CSS
const SOPArticleDisplay = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">
        Master Your Business Processes with the Best SOP Software in 2025
      </h1>

      {/* Intro */}
      <p>
        Imagine someone shows you how to craft the perfect croissant—flaky,
        buttery, golden brown. But you only get to watch once. Did they fold the
        dough twice or thrice? Was it chilled before baking? The end result? Something
        edible, but nowhere near the perfection you envisioned.
      </p>
      <p>
        Now, imagine receiving a detailed guide—step-by-step images, precise
        measurements, troubleshooting tips. Suddenly, you’re no longer just baking;
        you’re mastering a process. That’s exactly what Standard Operating Procedures
        (SOPs) do for businesses. And SOP software takes it even further—turning your
        everyday operations into foolproof, repeatable workflows.
      </p>

      {/* What is a SOP? */}
      <h2 className="text-2xl font-bold">
        What is a Standard Operating Procedure (SOP)?
      </h2>
      <p>
        A Standard Operating Procedure (SOP) is a structured document outlining the
        steps needed to complete a task consistently and efficiently. SOPs ensure teams
        follow best practices, reducing errors, improving efficiency, and maintaining
        quality.
      </p>

      {/* Benefits */}
      <h2 className="text-2xl font-bold">Benefits of Using SOP Software</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Consistency &amp; Accuracy</strong> – Everyone follows the same
          structured process, ensuring reliable outcomes.
        </li>
        <li>
          <strong>Time &amp; Cost Efficiency</strong> – Automating process documentation
          cuts training and execution time.
        </li>
        <li>
          <strong>Enhanced Training &amp; Onboarding</strong> – New hires can quickly grasp
          workflows without one-on-one training.
        </li>
        <li>
          <strong>Compliance &amp; Risk Management</strong> – Ensures regulatory compliance
          and minimizes mistakes.
        </li>
        <li>
          <strong>Collaboration &amp; Scalability</strong> – Teams can edit, update, and share
          SOPs easily.
        </li>
      </ul>

      {/* Why Businesses Need SOP Software */}
      <h2 className="text-2xl font-bold">Why Businesses Need SOP Software</h2>
      <p>
        Managing business operations efficiently is a challenge, especially as teams
        grow and processes evolve. SOP software simplifies documentation, streamlining
        workflows and ensuring best practices are followed across an organization. The
        right tool allows teams to create, maintain, and share SOPs effortlessly,
        reducing manual effort while improving accuracy and compliance.
      </p>
      <p>
        Businesses today need an SOP solution that integrates seamlessly into their
        existing systems, captures workflows with minimal friction, and provides a
        centralized knowledge base for all employees. Whether it's automating
        documentation, enhancing collaboration, or improving onboarding processes, an
        effective SOP tool can make all the difference in achieving operational
        excellence.
      </p>

      <hr className="border-t border-gray-300" />

      {/* Best SOP Software Compared */}
      <h2 className="text-2xl font-bold">Best SOP Software Compared</h2>
      <p>Below is a detailed comparison of the top SOP software options available in 2025.</p>

      {/* 1. Tracework.ai */}
      <h3 className="text-xl font-bold">1. Tracework.ai</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>Real-time process capture via Chrome extension</li>
            <li>Interactive SOPs with step-by-step images and annotations</li>
            <li>Teamspaces for seamless collaboration</li>
            <li>Secure, role-based access for data protection</li>
            <li>Custom branding options for professional SOPs</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Automates SOP documentation efficiently</li>
            <li>Enhances team collaboration and sharing</li>
            <li>High customization and security options</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>
              Currently supports only browser-based workflows (no desktop recording yet)
            </li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong>
          <ul className="list-disc pl-5">
            <li>
              <strong>Team Plan:</strong> $14/user/month (starts at 3 seats)
            </li>
            <li>
              <strong>Personal Plan:</strong> $19/user/month
            </li>
          </ul>
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 2. Clueso */}
      <h3 className="text-xl font-bold">2. Clueso</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>AI-powered process capture with smart step detection</li>
            <li>Professional video guides with AI voiceovers</li>
            <li>Automatic conversion of slides/PPTs into video-based SOPs</li>
            <li>Multi-language support with AI translations</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Quick automation for SOP creation</li>
            <li>High-quality training video output</li>
            <li>Supports branded documentation</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>May be too complex for small teams</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong> Custom pricing (enterprise-focused)
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 3. Scribe */}
      <h3 className="text-xl font-bold">3. Scribe</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>Automatic step-by-step capture via screen recording</li>
            <li>Chrome extension for easy access</li>
            <li>Basic formatting and editing options</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Simple and fast documentation process</li>
            <li>Beginner-friendly interface</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>Limited customization options</li>
            <li>May not work well for complex workflows</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong> $12–$23/user/month
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 4. Document360 */}
      <h3 className="text-xl font-bold">4. Document360</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>Comprehensive knowledge base management</li>
            <li>SEO optimization for SOP documentation</li>
            <li>Custom templates and analytics for tracking</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Excellent for compliance-heavy industries</li>
            <li>Strong version control and team collaboration</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>No automated process capture (manual documentation required)</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong>
          <ul className="list-disc pl-5">
            <li>Free plan available</li>
            <li>Paid plans start at $149/month</li>
          </ul>
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 5. Tango */}
      <h3 className="text-xl font-bold">5. Tango</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>Automated workflow capture for visual guides</li>
            <li>Screenshot annotation tools</li>
            <li>Team workspaces for collaboration</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Great for training and onboarding</li>
            <li>PDF export options for offline use</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>Limited advanced customization</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong>
          <ul className="list-disc pl-5">
            <li>Free (limited features)</li>
            <li>Pro version at $16/month</li>
          </ul>
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 6. Trainual */}
      <h3 className="text-xl font-bold">6. Trainual</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>Structured content organization for training</li>
            <li>Role-based assignments and tracking</li>
            <li>Interactive testing for employee training</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Ideal for onboarding and training new employees</li>
            <li>Easy-to-use structured learning approach</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>Lacks automated workflow documentation</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong> $8–$12/user/month
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 7. Process Street */}
      <h3 className="text-xl font-bold">7. Process Street</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>Checklist-based SOPs with workflow automation</li>
            <li>Drag-and-drop builder for process visualization</li>
            <li>Integration with other business tools</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Ideal for teams needing structured process execution</li>
            <li>Real-time collaboration tools</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>Manual creation of SOPs can be time-consuming</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong>
          <ul className="list-disc pl-5">
            <li>
              <strong>Startup Plan:</strong> $100/month
            </li>
            <li>
              <strong>Pro Plan:</strong> $415/month
            </li>
          </ul>
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* 8. Whale */}
      <h3 className="text-xl font-bold">8. Whale</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Unique Features:</strong>
          <ul className="list-disc pl-5">
            <li>AI-powered documentation and training flows</li>
            <li>Centralized knowledge repository with version control</li>
            <li>Integration with Slack and Microsoft Teams</li>
          </ul>
        </li>
        <li>
          <strong>Pros:</strong>
          <ul className="list-disc pl-5">
            <li>Automated onboarding processes</li>
            <li>High user adoption due to intuitive interface</li>
          </ul>
        </li>
        <li>
          <strong>Cons:</strong>
          <ul className="list-disc pl-5">
            <li>Pricing may be higher for small businesses</li>
          </ul>
        </li>
        <li>
          <strong>Pricing:</strong>
          <ul className="list-disc pl-5">
            <li>
              <strong>Scale Plan:</strong> $99/month
            </li>
            <li>Custom pricing for enterprise solutions</li>
          </ul>
        </li>
      </ul>

      <hr className="border-t border-gray-300" />

      {/* Summary Table */}
      <h2 className="text-2xl font-bold">Summary Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">SOP Software</th>
              <th className="px-4 py-2 border">Key Features</th>
              <th className="px-4 py-2 border">Pricing</th>
              <th className="px-4 py-2 border">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border font-bold">Tracework.ai</td>
              <td className="px-4 py-2 border">
                Real-time process capture, interactive SOPs, team workspaces
              </td>
              <td className="px-4 py-2 border">$14/user/month (Team)</td>
              <td className="px-4 py-2 border">Growing businesses &amp; teams</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Clueso</td>
              <td className="px-4 py-2 border">
                AI-powered process capture, video guides
              </td>
              <td className="px-4 py-2 border">Custom pricing</td>
              <td className="px-4 py-2 border">
                Enterprises needing video-based SOPs
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Scribe</td>
              <td className="px-4 py-2 border">
                Auto step-by-step capture via Chrome extension
              </td>
              <td className="px-4 py-2 border">$12–$23/user/month</td>
              <td className="px-4 py-2 border">
                Quick, simple documentation
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Document360</td>
              <td className="px-4 py-2 border">
                Knowledge base management, SEO optimization
              </td>
              <td className="px-4 py-2 border">Free; Paid from $149/month</td>
              <td className="px-4 py-2 border">
                Compliance-heavy industries
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Tango</td>
              <td className="px-4 py-2 border">
                Automated capture, screenshot annotation
              </td>
              <td className="px-4 py-2 border">Free; Pro at $16/month</td>
              <td className="px-4 py-2 border">Training &amp; onboarding</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Trainual</td>
              <td className="px-4 py-2 border">
                Role-based assignments, progress tracking
              </td>
              <td className="px-4 py-2 border">$8–$12/user/month</td>
              <td className="px-4 py-2 border">
                Employee training &amp; onboarding
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Process Street</td>
              <td className="px-4 py-2 border">
                Checklist-based workflows, automation
              </td>
              <td className="px-4 py-2 border">$100/month (Startup)</td>
              <td className="px-4 py-2 border">
                Teams needing structured workflows
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-bold">Whale</td>
              <td className="px-4 py-2 border">
                AI-powered documentation, Slack/MS Teams integration
              </td>
              <td className="px-4 py-2 border">$99/month (Scale)</td>
              <td className="px-4 py-2 border">
                Mid-to-large businesses
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="border-t border-gray-300" />

      {/* Call-to-Action */}
      <h2 className="text-2xl font-bold">Get Started Today</h2>
      <p>
        Your business runs on processes. The question is: are they documented,
        standardized, and easy to follow? If not, you need SOP software.
      </p>
      <p className="font-bold">
        Generate Free SOPs with Tracework.ai Today!
      </p>
    </div>
  )
}

// Types and Interfaces
interface Keyword {
  keyword: string
  intent: string
  difficulty: number
  volume: number
}

interface SearchResult {
  id: string
  title: string
  url: string
  description: string
  images: {
    id: string
    src: string
    alt: string
  }[]
}

// Sample Data
const keywordsData: Keyword[] = [
  { keyword: "SOP software", intent: "Commercial", difficulty: 3, volume: 1700 },
  { keyword: "SOP examples", intent: "Informational", difficulty: 19, volume: 3400 },
  { keyword: "SOP generator", intent: "Navigational", difficulty: 2, volume: 800 },
  { keyword: "SOP creator", intent: "Transactional", difficulty: 4, volume: 600 },
]

const searchResults: SearchResult[] = [
  {
    id: "magichow",
    title: "First Google Result: MagicHow",
    url: "https://www.magichow.co/blog/sop-software",
    description: "7 Best Standard Operating Procedure (SOP) Software & Tools",
    images: [
      {
        id: "mh1",
        src: "/magichow.png?height=600&width=800&text=MagicHow+1",
        alt: "MagicHow SOP Software Screenshot 1",
      },
      {
        id: "mh2",
        src: "/magichow-intro.png?height=600&width=800&text=MagicHow+2",
        alt: "MagicHow SOP Software Screenshot 2",
      },
      {
        id: "mh3",
        src: "/magichow-content.png?height=600&width=800&text=MagicHow+3",
        alt: "MagicHow SOP Software Screenshot 3",
      },
    ],
  },
  {
    id: "scribe",
    title: "Second Google Result: Scribe",
    url: "https://scribehow.com/library/sop-software",
    description: "9 Best Standard Operating Procedures (SOP) Software in 2025",
    images: [
      {
        id: "sc1",
        src: "/scribe.png?height=600&width=800&text=Scribe+1",
        alt: "Scribe SOP Software Screenshot 1",
      },
      {
        id: "sc2",
        src: "/scribe-intro.png?height=600&width=800&text=Scribe+2",
        alt: "Scribe SOP Software Screenshot 2",
      },
      {
        id: "sc3",
        src: "/scribe-content.png?height=600&width=800&text=Scribe+3",
        alt: "Scribe SOP Software Screenshot 3",
      },
    ],
  },
]

interface ModalProps {
  images: SearchResult["images"]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

function Modal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative mx-auto max-w-6xl w-full px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/90 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              <Image
                src={images[currentIndex].src || "/placeholder.svg"}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation()
                onPrevious()
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface ImageGalleryProps {
  images: SearchResult["images"]
  onImageClick: (index: number) => void
}

function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-muted"
          onClick={() => onImageClick(index)}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </motion.div>
      ))}
    </div>
  )
}

export default function Page() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentIndex: 0,
    currentImages: searchResults[0].images,
  })

  const handleImageClick = (
    resultImages: SearchResult["images"],
    index: number
  ) => {
    setModalState({
      isOpen: true,
      currentIndex: index,
      currentImages: resultImages,
    })
  }

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleNext = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.currentImages.length,
    }))
  }

  const handlePrevious = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        (prev.currentIndex - 1 + prev.currentImages.length) %
        prev.currentImages.length,
    }))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!modalState.isOpen) return
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "Escape") handleClose()
  }

  // Add keyboard event listeners
  useState(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalState.isOpen])

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <section className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            SEO Keyword Plan: SOP
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's the SEO plan and analysis for Tracework AI focusing on key SOP
            terms.
          </p>
        </header>

        {/* Keywords Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
            <CardDescription>
              Overview of target keywords and their metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Keyword</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead className="text-right">Difficulty</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywordsData.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {item.keyword}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {item.intent}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.difficulty}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.volume}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.map((result, idx) => (
          <div key={result.id}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{result.title}</CardTitle>
                <CardDescription>
                  Article URL:{" "}
                  <a
                    href={result.url}
                    className="text-primary hover:underline"
                  >
                    {result.description}
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  images={result.images}
                  onImageClick={(index) => handleImageClick(result.images, index)}
                />
              </CardContent>
            </Card>
            {/* Display the article after the second Google search result */}
            {idx === 1 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    Blog Article Outline (AI-Generated)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SOPArticleDisplay />
                </CardContent>
              </Card>
            )}
          </div>
        ))}

        {/* Modal */}
        <AnimatePresence>
          {modalState.isOpen && (
            <Modal
              images={modalState.currentImages}
              currentIndex={modalState.currentIndex}
              isOpen={modalState.isOpen}
              onClose={handleClose}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </AnimatePresence>

        {/* Widget */}
        <div className="mt-12">
          <elevenlabs-convai agent-id="3bZ3pmzs9igwDXgBjp7n" />
          <script
            src="https://elevenlabs.io/convai-widget/index.js"
            async
          />
        </div>
      </section>
    </main>
  )
}
