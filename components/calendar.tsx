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
  addDays,
  isSameMonth,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Search, Grid, List, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EventForm } from "./event-form"
import { EventDetails } from "./event-details"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useEvents } from "@/hooks/use-events"
import type { Event } from "@/types/event"
import { cn } from "@/lib/utils"

type ViewMode = "month" | "week" | "day" | "agenda"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const { events, addEvent, updateEvent, deleteEvent, moveEvent, getEventsForDate, getAllEvents } = useEvents()

  // Calculate date ranges based on view mode
  const getDateRange = () => {
    switch (viewMode) {
      case "day":
        return [currentDate]
      case "week":
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return eachDayOfInterval({ start: weekStart, end: weekEnd })
      case "agenda":
        const agendaStart = startOfMonth(currentDate)
        const agendaEnd = endOfMonth(currentDate)
        return eachDayOfInterval({ start: agendaStart, end: agendaEnd })
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
      case "agenda":
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
      case "agenda":
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
        const weekStart = startOfWeek(currentDate)
        const weekEnd = endOfWeek(currentDate)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "agenda":
        return `${format(currentDate, "MMMM yyyy")} Agenda`
      case "month":
      default:
        return format(currentDate, "MMMM yyyy")
    }
  }

  const filterEvents = (events: Event[]) => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "" || (event.category && event.category === filterCategory)
      return matchesSearch && matchesCategory
    })
  }

  // Mobile Day View
  const renderDayView = () => {
    const dayEvents = filterEvents(getEventsForDate(currentDate))
    const hours = eachHourOfInterval({
      start: startOfDay(currentDate),
      end: endOfDay(currentDate),
    })

    return (
      <div className="space-y-4">
        {/* Day Header */}
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{format(currentDate, "EEEE")}</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{format(currentDate, "d")}</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">{format(currentDate, "MMMM yyyy")}</p>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground bg-muted/30 rounded-xl">
              <Grid className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No events today</p>
              <Button variant="outline" size="sm" onClick={() => handleDateClick(currentDate)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          ) : (
            dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "p-4 rounded-xl text-white cursor-pointer shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]",
                  getEventColor(event.category),
                )}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <p className="text-sm opacity-90 mb-2">{format(new Date(event.date), "h:mm a")}</p>
                    {event.description && <p className="text-sm opacity-80 line-clamp-2">{event.description}</p>}
                    {event.category && (
                      <span className="inline-block mt-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                        {event.category}
                      </span>
                    )}
                  </div>
                  {event.recurrence !== "none" && <span className="text-2xl opacity-80">🔄</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Mobile Week View
  const renderWeekView = () => {
    return (
      <div className="space-y-3">
        {calendarDays.map((day) => {
          const dayEvents = filterEvents(getEventsForDate(day))
          const isCurrentDay = isToday(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md",
                isCurrentDay && "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
                !isCurrentMonth && "opacity-60",
                "active:scale-[0.98]",
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className={cn("font-semibold text-lg", isCurrentDay && "text-blue-600 dark:text-blue-400")}>
                    {format(day, "EEE, MMM d")}
                  </h4>
                  {isCurrentDay && <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Today</span>}
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-sm p-2 rounded-lg text-white truncate transition-all hover:scale-[1.02]",
                      getEventColor(event.category),
                      "cursor-pointer",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEventClick(event)
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-xs opacity-80">{format(new Date(event.date), "h:mm a")}</span>
                    </div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{dayEvents.length - 3} more events
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Mobile Agenda View
  const renderAgendaView = () => {
    const allEvents = getAllEvents()
    const monthEvents = allEvents.filter((event) => isSameMonth(new Date(event.date), currentDate))
    const filteredEvents = filterEvents(monthEvents)

    // Group events by date
    const eventsByDate = filteredEvents.reduce(
      (acc, event) => {
        const dateKey = format(new Date(event.date), "yyyy-MM-dd")
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(event)
        return acc
      },
      {} as Record<string, Event[]>,
    )

    const sortedDates = Object.keys(eventsByDate).sort()

    return (
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            <Grid className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No events this month</p>
            <Button variant="outline" size="sm" onClick={() => handleDateClick(new Date())}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            const date = new Date(dateKey)
            const dayEvents = eventsByDate[dateKey]
            const isCurrentDay = isToday(date)

            return (
              <div key={dateKey} className="space-y-2">
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    isCurrentDay && "bg-blue-50 dark:bg-blue-950",
                  )}
                >
                  <div className={cn("text-center min-w-[60px]", isCurrentDay && "text-blue-600 dark:text-blue-400")}>
                    <div className="text-xs font-medium">{format(date, "EEE").toUpperCase()}</div>
                    <div className="text-2xl font-bold">{format(date, "d")}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{format(date, "MMMM d, yyyy")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="ml-4 space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg text-white cursor-pointer transition-all hover:scale-[1.02]",
                        getEventColor(event.category),
                      )}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm opacity-90">{format(new Date(event.date), "h:mm a")}</p>
                          {event.description && (
                            <p className="text-sm opacity-80 mt-1 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        {event.recurrence !== "none" && <span className="text-lg opacity-80">🔄</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-xl font-bold text-center flex-1">{getViewTitle()}</h1>

          <Button
            size="sm"
            onClick={() => {
              setSelectedDate(new Date())
              setShowEventForm(true)
              setSelectedEvent(null)
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={handlePrevPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="text-xs px-2"
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="icon" onClick={handleNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Search */}
        {showMobileMenu && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
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
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePrevPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-semibold min-w-[250px] text-center">{getViewTitle()}</h2>
              <Button variant="outline" size="icon" onClick={handleNextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex border rounded-lg p-1 bg-muted">
                {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                  >
                    {mode === "month" && <Grid className="h-4 w-4 mr-2" />}
                    {mode === "week" && <List className="h-4 w-4 mr-2" />}
                    {mode === "day" && <Grid className="h-4 w-4 mr-2" />}
                    {mode === "agenda" && <Menu className="h-4 w-4 mr-2" />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>

                {categories.length > 0 && (
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                )}

                <Button
                  onClick={() => {
                    setSelectedDate(new Date())
                    setShowEventForm(true)
                    setSelectedEvent(null)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>
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
            Clear Filters
          </Button>
        </div>
      )}

      {/* Mobile Views */}
      <div className="block lg:hidden">
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "agenda" && renderAgendaView()}
        {viewMode === "month" && renderWeekView()} {/* Use week view for mobile month */}
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden lg:block">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="border rounded-lg overflow-hidden">
            {/* Day Headers - only show for month/week view */}
            {(viewMode === "month" || viewMode === "week") && (
              <div className="grid grid-cols-7 bg-muted">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-4 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* Calendar Days */}
            {viewMode === "month" || viewMode === "week" ? (
              <div className="grid grid-cols-7">
                {calendarDays.map((day) => {
                  const allDayEvents = getEventsForDate(day)
                  const dayEvents = filterEvents(allDayEvents)

                  const isCurrentMonth = viewMode === "month" ? isSameMonth(day, currentDate) : true
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
                          )}
                          onClick={() => handleDateClick(day)}
                        >
                          <div
                            className={cn(
                              "text-sm font-medium mb-1",
                              isCurrentDay && "text-blue-600 dark:text-blue-400",
                            )}
                          >
                            {format(day, "d")}
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
                                      "text-xs p-1 rounded text-white truncate",
                                      getEventColor(event.category),
                                      snapshot.isDragging && "opacity-50",
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEventClick(event)
                                    }}
                                  >
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
            ) : viewMode === "day" ? (
              renderDayView()
            ) : (
              renderAgendaView()
            )}
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
            <span key={category} className={cn("px-2 py-1 rounded text-white text-xs", getEventColor(category))}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
