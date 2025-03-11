"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { tasks as importedTasks, type Task as TaskType } from "@/lib/tasks"
import { cn } from "@/lib/utils"

interface CalendarDay {
  date: Date
  currentMonth: boolean
  isToday: boolean
}

export default function TaskCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Define color options with a refined palette
  const colorOptions = [
    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
    { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
    { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
    { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-500" },
    { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", dot: "bg-cyan-500" },
  ]

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate to current month
  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  // Helper to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  // Generate calendar days, including days from adjacent months to fill the grid
  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const startDay = firstDayOfMonth.getDay() // 0 (Sun) to 6 (Sat)
    const calendarDays: CalendarDay[] = []
    const today = new Date()

    // Previous month days (if needed)
    if (startDay > 0) {
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = startDay - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthLastDay - i)
        calendarDays.push({
          date,
          currentMonth: false,
          isToday: isSameDay(date, today),
        })
      }
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      calendarDays.push({
        date,
        currentMonth: true,
        isToday: isSameDay(date, today),
      })
    }

    // Next month days (to complete the week grid)
    const remainder = calendarDays.length % 7
    if (remainder > 0) {
      const cellsToAdd = 7 - remainder
      for (let i = 1; i <= cellsToAdd; i++) {
        const date = new Date(year, month + 1, i)
        calendarDays.push({
          date,
          currentMonth: false,
          isToday: isSameDay(date, today),
        })
      }
    }
    return calendarDays
  }

  const calendarDays = generateCalendarDays(currentDate)

  // When a task is clicked, set it as the selected task and open the dialog
  const handleTaskClick = (task: TaskType, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  // Format time from date string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get tasks for a given day
  const getDayTasks = (dayObj: CalendarDay) => {
    return importedTasks.filter((task) => {
      const taskDate = new Date(task.date)
      return isSameDay(taskDate, dayObj.date)
    })
  }

  // CSS for hiding scrollbars (since we can't use globals.css)
  const scrollbarHideStyle = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
  } as React.CSSProperties

  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Task Calendar</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentMonth}
            className="text-xs bg-background/80 backdrop-blur-sm"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="rounded-full hover:bg-background/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous month</span>
          </Button>
          <h3 className="text-2xl font-bold">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="rounded-full hover:bg-background/80 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div
              key={day}
              className={cn("font-medium text-sm py-2", (index === 0 || index === 6) && "text-muted-foreground")}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {calendarDays.map((dayObj, index) => {
            const dayTasks = getDayTasks(dayObj)
            const isWeekend = dayObj.date.getDay() === 0 || dayObj.date.getDay() === 6

            return (
              <div
                key={index}
                className={cn(
                  "border rounded-lg p-1 md:p-2 h-28 md:h-36 flex flex-col transition-all duration-200",
                  dayObj.currentMonth ? "bg-card" : "bg-muted/30 text-muted-foreground",
                  dayObj.isToday && "ring-2 ring-primary ring-offset-2",
                  isWeekend && dayObj.currentMonth && "bg-muted/10"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full",
                      dayObj.isToday && "bg-primary text-primary-foreground",
                      !dayObj.isToday && "text-foreground"
                    )}
                  >
                    {dayObj.date.getDate()}
                  </div>
                  {dayTasks.length > 0 && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1 bg-background/80">
                      {dayTasks.length}
                    </Badge>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1" style={scrollbarHideStyle}>
                  {dayTasks.slice(0, 3).map((task) => {
                    // Use the task's colorIndex if provided; otherwise, fall back to a default based on task id.
                    const colorIndex =
                      typeof task.colorIndex !== "undefined"
                        ? task.colorIndex % colorOptions.length
                        : (task.id - 1) % colorOptions.length
                    const colorClass = colorOptions[colorIndex]

                    return (
                      <div
                        key={task.id}
                        onClick={(e) => handleTaskClick(task, e)}
                        className={cn(
                          "cursor-pointer text-xs p-1 rounded-md border transition-all",
                          colorClass.bg,
                          colorClass.border,
                          colorClass.text,
                          "hover:shadow-sm hover:translate-y-[-1px]"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", colorClass.dot)} />
                          <span className="font-medium truncate">{task.title}</span>
                        </div>
                        <div className="text-[10px] mt-0.5 opacity-80 flex items-center">
                          <Clock className="w-2.5 h-2.5 mr-0.5" />
                          {formatTime(task.date)}
                        </div>
                      </div>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-muted-foreground px-1">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      {/* Task Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedTask(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="py-4 space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{selectedTask.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(selectedTask.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {formatTime(selectedTask.date)}
                  </span>
                </div>

                {selectedTask.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{selectedTask.location}</span>
                  </div>
                )}
              </div>

              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedTask.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
