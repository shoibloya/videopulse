"use client"

import { useState, useEffect } from "react"
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

// New component: AestheticTimerReport using shadcn and Tailwind CSS
const AestheticTimerReport = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold">
        Enhance Your Website with an Aesthetic Pomodoro Timer
      </h1>

      {/* Intro */}
      <p>
        In today's fast-paced digital world, productivity isn’t just about working hard—it’s about working smart. An aesthetic Pomodoro timer is more than just a countdown; it’s a subtle, engaging tool that encourages focus and balance. This report outlines why integrating a simple yet effective timer into your website can boost user engagement and overall productivity.
      </p>
      
      {/* What is a Pomodoro Timer? */}
      <h2 className="text-2xl font-bold">
        What is a Pomodoro Timer?
      </h2>
      <p>
        The Pomodoro Technique is a time management method that breaks work into intervals—typically 25 minutes of focused work followed by a 5-minute break. An effective Pomodoro timer not only tracks these intervals but also reinforces the rhythm of productivity.
      </p>

      {/* Why an Aesthetic Timer Matters */}
      <h2 className="text-2xl font-bold">Why an Aesthetic Timer Matters</h2>
      <p>
        Aesthetics play a crucial role in user experience. A well-designed timer:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Boosts Engagement</strong> – A visually pleasing timer captures attention and encourages regular use.
        </li>
        <li>
          <strong>Enhances Focus</strong> – By clearly demarcating work and break periods, it helps users maintain concentration.
        </li>
        <li>
          <strong>Improves Productivity</strong> – Structured time management can lead to more efficient workflows.
        </li>
        <li>
          <strong>Reflects Brand Identity</strong> – A minimalist and stylish design reinforces a modern, professional image.
        </li>
      </ul>

      {/* Key Features of an Effective Pomodoro Timer */}
      <h2 className="text-2xl font-bold">Key Features to Look For</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Simplicity</strong> – An uncluttered interface that is easy to understand and use.
        </li>
        <li>
          <strong>Customizability</strong> – Options to adjust work and break intervals to suit individual needs.
        </li>
        <li>
          <strong>Aesthetic Appeal</strong> – Visually harmonious design elements that blend with your website.
        </li>
        <li>
          <strong>Responsive Design</strong> – Seamless functionality across all devices.
        </li>
        <li>
          <strong>Subtle Animations</strong> – Smooth transitions and feedback that add a touch of elegance.
        </li>
      </ul>

      {/* Conclusion */}
      <h2 className="text-2xl font-bold">Conclusion &amp; Recommendation</h2>
      <p>
        Adding an aesthetic Pomodoro timer to your website is not just about time tracking—it’s about elevating the user experience. With its blend of functionality and design, this simple tool can transform the way visitors interact with your site, making productivity both enjoyable and visually appealing.
      </p>
      <p className="font-bold">
        Embrace simplicity. Enhance engagement. Boost productivity.
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

// Updated Keywords Data for Aesthetic Timer
const keywordsData: Keyword[] = [
  { keyword: "pomodoro timer", intent: "Informational", difficulty: 2, volume: 3000 },
  { keyword: "aesthetic timer", intent: "Commercial", difficulty: 4, volume: 1500 },
  { keyword: "minimalist timer", intent: "Informational", difficulty: 3, volume: 1000 },
  { keyword: "productivity timer", intent: "Transactional", difficulty: 3, volume: 1200 },
]

// Updated Search Results for Timer Tools
const searchResults: SearchResult[] = [
  {
    id: "timerx",
    title: "First Google Result: TimerX",
    url: "https://www.timerx.com/blog/aesthetic-pomodoro-timer",
    description: "Discover how TimerX redefines productivity with an aesthetic pomodoro timer.",
    images: [
      {
        id: "tx1",
        src: "/timerx.png?height=600&width=800&text=TimerX+1",
        alt: "TimerX Screenshot 1",
      },
      {
        id: "tx2",
        src: "/timerx-intro.png?height=600&width=800&text=TimerX+2",
        alt: "TimerX Screenshot 2",
      },
      {
        id: "tx3",
        src: "/timerx-content.png?height=600&width=800&text=TimerX+3",
        alt: "TimerX Screenshot 3",
      },
    ],
  },
  {
    id: "timerflow",
    title: "Second Google Result: TimerFlow",
    url: "https://www.timerflow.com/blog/designing-simple-timers",
    description: "Learn how TimerFlow integrates minimalist design with effective time management.",
    images: [
      {
        id: "tf1",
        src: "/timerflow.png?height=600&width=800&text=TimerFlow+1",
        alt: "TimerFlow Screenshot 1",
      },
      {
        id: "tf2",
        src: "/timerflow-intro.png?height=600&width=800&text=TimerFlow+2",
        alt: "TimerFlow Screenshot 2",
      },
      {
        id: "tf3",
        src: "/timerflow-content.png?height=600&width=800&text=TimerFlow+3",
        alt: "TimerFlow Screenshot 3",
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

  // Use `useEffect` to ensure this runs only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [modalState.isOpen])

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <section className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Enhance Your Website with an Aesthetic Pomodoro Timer
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover how a simple yet effective Pomodoro timer can transform your user experience, boost productivity, and add a touch of elegance to your site.
          </p>
        </header>

        {/* Keywords Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
            <CardDescription>
              Overview of target keywords and their metrics for timer tools
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
            {/* Display the report after the second search result */}
            {idx === 1 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    Aesthetic Timer Report (AI-Generated)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AestheticTimerReport />
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

        {/* Call-to-Action */}
        <div className="mt-12">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Ready to Boost Productivity?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Your website deserves a tool that not only helps your users manage their time but also elevates your site's design. An aesthetic Pomodoro timer is the perfect addition—simple, effective, and beautifully designed.
              </p>
              <p className="mt-2 font-bold">
                Add a Pomodoro Timer Today and Transform Your User Experience!
              </p>
              <Button className="mt-4 bg-primary text-white hover:bg-primary/90">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
