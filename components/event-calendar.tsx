"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfWeek as getWeekStart,
  endOfWeek as getWeekEnd,
  addDays,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Search, Calendar, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EventForm } from "./event-form"
import { EventDetails } from "./event-details"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useEvents } from "@/hooks/use-events"
import type { Event } from "@/types/event"
import { cn } from "@/lib/utils"

type ViewMode = "month" | "week" | "day"

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [viewMode, setViewMode] = useState<ViewMode>("month")

  const { events, addEvent, updateEvent, deleteEvent, moveEvent, getEventsForDate, getAllEvents } = useEvents()

  // Calculate date ranges based on view mode
  const getDateRange = () => {
    switch (viewMode) {
      case "day":
        return [currentDate]
      case "week":
        const weekStart = getWeekStart(currentDate)
        const weekEnd = getWeekEnd(currentDate)
        return eachDayOfInterval({ start: weekStart, end: weekEnd })
      case "month":
      default:
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const calendarStart = startOfWeek(monthStart)
        const calendarEnd = endOfWeek(monthEnd)
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }
  }

  const calendarDays = getDateRange()

  const categories = Array.from(
    new Set(
      getAllEvents()
        .map((event) => event.category)
        .filter((category): category is string => Boolean(category)),
    ),
  )

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventForm(true)
    setSelectedEvent(null)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventForm(false)
  }

  const handlePrevPeriod = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, -1))
        break
      case "week":
        setCurrentDate(addDays(currentDate, -7))
        break
      case "month":
        setCurrentDate(subMonths(currentDate, 1))
        break
    }
  }

  const handleNextPeriod = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1))
        break
      case "week":
        setCurrentDate(addDays(currentDate, 7))
        break
      case "month":
        setCurrentDate(addMonths(currentDate, 1))
        break
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const eventId = result.draggableId
    const newDate = new Date(result.destination.droppableId)

    moveEvent(eventId, newDate)
  }

  const handleEventSubmit = (eventData: Omit<Event, "id">) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setShowEventForm(false)
    setSelectedEvent(null)
    setSelectedDate(null)
  }

  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId)
    setSelectedEvent(null)
  }

  const getEventColor = (category: string | undefined) => {
    const colors: Record<string, string> = {
      work: "bg-blue-500",
      personal: "bg-green-500",
      health: "bg-red-500",
      social: "bg-purple-500",
      travel: "bg-orange-500",
      default: "bg-gray-500",
    }
    return colors[category || "default"] || colors.default
  }

  const getViewTitle = () => {
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy")
      case "week":
        const weekStart = getWeekStart(currentDate)
        const weekEnd = getWeekEnd(currentDate)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "month":
      default:
        return format(currentDate, "MMMM yyyy")
    }
  }

  const renderMobileView = () => {
    if (viewMode === "day") {
      const dayEvents = getEventsForDate(currentDate).filter((event) => {
        const matchesSearch =
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === "" || (event.category && event.category === filterCategory)
        return matchesSearch && matchesCategory
      })

      return (
        <div className="space-y-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">{format(currentDate, "EEEE")}</h3>
            <p className="text-2xl font-bold">{format(currentDate, "d")}</p>
            <p className="text-sm text-muted-foreground">{format(currentDate, "MMMM yyyy")}</p>
          </div>

          <div className="space-y-2">
            {dayEvents.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No events for this day</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => handleDateClick(currentDate)}>
                  Add Event
                </Button>
              </div>
            ) : (
              dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn("p-3 rounded-lg text-white cursor-pointer", getEventColor(event.category))}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm opacity-90">{format(new Date(event.date), "h:mm a")}</p>
                      {event.description && <p className="text-sm opacity-75 mt-1">{event.description}</p>}
                    </div>
                    {event.recurrence !== "none" && <span className="text-lg">🔄</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )
    }

    // Week view for mobile
    if (viewMode === "week") {
      return (
        <div className="space-y-2">
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDate(day).filter((event) => {
              const matchesSearch =
                searchTerm === "" ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
              const matchesCategory = filterCategory === "" || (event.category && event.category === filterCategory)
              return matchesSearch && matchesCategory
            })

            const isCurrentDay = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer",
                  isCurrentDay && "bg-blue-50 dark:bg-blue-950 border-blue-200",
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className={cn("font-medium", isCurrentDay && "text-blue-600")}>{format(day, "EEE, MMM d")}</h4>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn("text-xs p-1 rounded text-white truncate", getEventColor(event.category))}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col space-y-4">
        {/* Top row - Navigation and Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold text-center flex-1 mx-4">{getViewTitle()}</h2>

          <Button
            onClick={() => {
              setSelectedDate(new Date())
              setShowEventForm(true)
              setSelectedEvent(null)
            }}
            size="sm"
            className="shrink-0"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Event</span>
          </Button>
        </div>

        {/* Second row - View modes and search */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
          {/* View Mode Buttons */}
          <div className="flex border rounded-lg p-1 bg-muted">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="flex-1 sm:flex-none"
            >
              <Grid className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Month</span>
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="flex-1 sm:flex-none"
            >
              <List className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Week</span>
            </Button>
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="flex-1 sm:flex-none"
            >
              <Calendar className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Day</span>
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            {categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background min-w-[120px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Indicator */}
      {(searchTerm || filterCategory) && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border">
          <Search className="h-4 w-4 text-blue-600" />
          <span className="text-sm">
            {searchTerm && `Searching for: "${searchTerm}"`}
            {searchTerm && filterCategory && " • "}
            {filterCategory && `Category: ${filterCategory}`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setFilterCategory("")
            }}
            className="ml-auto text-xs"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Calendar Views */}
      {/* Mobile View (Day/Week list) */}
      <div className="block md:hidden">{renderMobileView()}</div>

      {/* Desktop View (Grid) */}
      <div className="hidden md:block">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="border rounded-lg overflow-hidden">
            {/* Day Headers - only show for month/week view */}
            {viewMode !== "day" && (
              <div className={cn("grid bg-muted", viewMode === "week" ? "grid-cols-7" : "grid-cols-7")}>
                {(viewMode === "week"
                  ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                ).map((day) => (
                  <div key={day} className="p-4 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* Calendar Days */}
            <div
              className={cn(
                "grid",
                viewMode === "day" ? "grid-cols-1" : viewMode === "week" ? "grid-cols-7" : "grid-cols-7",
              )}
            >
              {calendarDays.map((day) => {
                const allDayEvents = getEventsForDate(day)
                const dayEvents = allDayEvents.filter((event) => {
                  const matchesSearch =
                    searchTerm === "" ||
                    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchTerm.toLowerCase())
                  const matchesCategory = filterCategory === "" || (event.category && event.category === filterCategory)
                  return matchesSearch && matchesCategory
                })

                const isCurrentMonth = viewMode === "month" ? day.getMonth() === currentDate.getMonth() : true
                const isCurrentDay = isToday(day)

                return (
                  <Droppable key={day.toISOString()} droppableId={day.toISOString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "min-h-[120px] p-2 border-r border-b cursor-pointer transition-colors",
                          !isCurrentMonth && "bg-muted/50 text-muted-foreground",
                          isCurrentDay && "bg-blue-50 dark:bg-blue-950",
                          snapshot.isDraggingOver && "bg-blue-100 dark:bg-blue-900",
                          viewMode === "day" && "min-h-[400px]",
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        <div
                          className={cn("text-sm font-medium mb-1", isCurrentDay && "text-blue-600 dark:text-blue-400")}
                        >
                          {viewMode === "day" ? format(day, "EEEE, MMMM d") : format(day, "d")}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.map((event, index) => (
                            <Draggable key={event.id} draggableId={event.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "text-xs p-1 rounded text-white cursor-pointer truncate",
                                    getEventColor(event.category || "default"),
                                    snapshot.isDragging && "opacity-50",
                                    viewMode === "day" && "text-sm p-2",
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEventClick(event)
                                  }}
                                >
                                  {viewMode === "day" && (
                                    <div className="font-medium">{format(new Date(event.date), "h:mm a")}</div>
                                  )}
                                  {event.title}
                                  {event.recurrence !== "none" && <span className="ml-1">🔄</span>}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              })}
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={selectedEvent}
          selectedDate={selectedDate}
          onSubmit={handleEventSubmit}
          onClose={() => {
            setShowEventForm(false)
            setSelectedEvent(null)
            setSelectedDate(null)
          }}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && !showEventForm && (
        <EventDetails
          event={selectedEvent}
          onEdit={() => {
            setShowEventForm(true)
          }}
          onDelete={handleEventDelete}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Legend */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Categories:</span>
          {categories.map((category) => (
            <Badge key={category} className={cn("text-white", getEventColor(category))}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
