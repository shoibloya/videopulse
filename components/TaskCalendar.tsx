"use client"

import { useMemo, useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, MapPin, Tag, Clock, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { tasks as importedTasks, type Task as TaskType } from "@/lib/tasks"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function TaskListView() {
  const TASKS_PER_PAGE = 4
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate total pages
  const totalTasks = importedTasks.length
  const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE)

  // Get current page tasks
  const currentTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE
    return [...importedTasks]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(startIndex, startIndex + TASKS_PER_PAGE)
  }, [currentPage])

  // Format date for grouping
  const formatDateKey = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate completion statistics
  const stats = useMemo(() => {
    const completedTasks = importedTasks.filter((task) => task.completed).length
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      total: totalTasks,
      completed: completedTasks,
      percentage: completionPercentage,
    }
  }, [totalTasks])

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    // Group by date
    const grouped = currentTasks.reduce<Record<string, TaskType[]>>((acc, task) => {
      const dateKey = formatDateKey(task.date)
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(task)
      return acc
    }, {})

    return grouped
  }, [currentTasks])

  // Handle pagination
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  // Define color options with a refined palette
  const colorOptions = [
    {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
      dot: "bg-blue-500",
    },
    {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
    {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500",
    },
    {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-800",
      text: "text-violet-700 dark:text-violet-300",
      dot: "bg-violet-500",
    },
    {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-200 dark:border-cyan-800",
      text: "text-cyan-700 dark:text-cyan-300",
      dot: "bg-cyan-500",
    },
  ]

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="shadow-xl border-0 overflow-hidden bg-white dark:bg-gray-950 w-full max-w-5xl mx-auto">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Task List</h2>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {stats.completed}/{stats.total} completed
              </span>
              <span className="text-muted-foreground">({stats.percentage}%)</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full">
            <Progress value={stats.percentage} className="h-2" />
          </div>
        </div>
      </CardHeader>

      {/* List Content */}
      <CardContent className="p-6 pt-3">
        <div className="relative min-h-[400px] flex flex-col">
          {/* Vertical progress line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted z-0"></div>

          <div className="flex-1">
            {Object.entries(groupedTasks).map(([dateKey, dateTasks]) => (
              <div key={dateKey} className="mb-6 last:mb-0 relative">
                <div className="flex items-center mb-2">
                  <div className="flex-1 h-px bg-border" />
                  <div className="px-4 py-1 rounded-full bg-muted text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dateKey}</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Accordion type="multiple" className="space-y-3 pl-6">
                  {dateTasks.map((task) => {
                    const colorIndex =
                      typeof task.colorIndex !== "undefined"
                        ? task.colorIndex % colorOptions.length
                        : (task.id - 1) % colorOptions.length
                    const colorClass = colorOptions[colorIndex]
                    const isCompleted = task.completed

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        {/* Task completion marker */}
                        <div
                          className={cn(
                            "absolute left-0 w-6 h-6 rounded-full -translate-x-[19px] z-10 flex items-center justify-center",
                            isCompleted ? "bg-primary" : "bg-muted border-2 border-border",
                          )}
                        >
                          {isCompleted && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                        </div>

                        <AccordionItem value={String(task.id)} className="border-0">
                          {/* Collapsed Task Summary */}
                          <div
                            className={cn(
                              "flex items-center gap-3 px-6 py-4 rounded-lg border transition-all",
                              isCompleted ? "bg-muted/30 border-muted" : "hover:border-primary/30 hover:shadow-sm",
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", colorClass.dot)} />
                                <span
                                  className={cn(
                                    "font-medium truncate",
                                    isCompleted && "line-through text-muted-foreground",
                                  )}
                                >
                                  {task.title}
                                </span>
                              </div>

                              <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(task.date).toLocaleDateString()}</span>

                                {task.tags && task.tags.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Tag className="h-3 w-3" />
                                      <span>{task.tags.length} tags</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <AccordionTrigger className="p-0 hover:no-underline" />
                          </div>

                          {/* Expanded Task Details */}
                          <AccordionContent>
                            <div
                              className={cn(
                                "p-6 mt-2 rounded-lg border",
                                colorClass.bg,
                                colorClass.border,
                                colorClass.text,
                              )}
                            >
                              <p className="mb-4 text-sm leading-relaxed">{task.description}</p>

                              <div className="space-y-2">
                                <div className="text-sm flex items-center gap-2">
                                  <CalendarIcon className="w-4 h-4 opacity-70" />
                                  <span>{formatDate(task.date)}</span>
                                </div>

                                {task.location && (
                                  <div className="text-sm flex items-center gap-2">
                                    <MapPin className="w-4 h-4 opacity-70" />
                                    <span>{task.location}</span>
                                  </div>
                                )}

                                {task.tags && task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-3">
                                    {task.tags.map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                <div className="pt-2 text-sm">
                                  <span className="font-medium">Status: </span>
                                  <span>{isCompleted ? "Completed" : "Pending"}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    )
                  })}
                </Accordion>
              </div>
            ))}

            {/* Empty state when no tasks on current page */}
            {Object.keys(groupedTasks).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted rounded-full p-3 mb-4">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No tasks on this page</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Try navigating to a different page to view more tasks.
                </p>
              </div>
            )}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 text-sm text-muted-foreground flex justify-between">
        <div>
          Showing {Math.min(TASKS_PER_PAGE, currentTasks.length)} of {stats.total} tasks
        </div>
        <div>
          {stats.completed} completed, {stats.total - stats.completed} pending
        </div>
      </CardFooter>
    </Card>
  )
}

