"use client"

import { useState, useEffect } from "react"
import { addDays, addWeeks, addMonths, isSameDay, isBefore } from "date-fns"
import type { Event } from "@/types/event"

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
        }))
        setEvents(parsedEvents)
      } catch (error) {
        console.error("Error loading events from localStorage:", error)
      }
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const addEvent = (eventData: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
    }

    // Check for conflicts
    const conflicts = checkEventConflicts(newEvent)
    if (conflicts.length > 0) {
      const conflictTitles = conflicts.map((e) => e.title).join(", ")
      if (!confirm(`This event conflicts with: ${conflictTitles}. Do you want to add it anyway?`)) {
        return
      }
    }

    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (eventId: string, eventData: Omit<Event, "id">) => {
    const updatedEvent = { ...eventData, id: eventId }

    // Check for conflicts (excluding the current event)
    const conflicts = checkEventConflicts(updatedEvent, eventId)
    if (conflicts.length > 0) {
      const conflictTitles = conflicts.map((e) => e.title).join(", ")
      if (!confirm(`This event conflicts with: ${conflictTitles}. Do you want to update it anyway?`)) {
        return
      }
    }

    setEvents((prev) => prev.map((event) => (event.id === eventId ? updatedEvent : event)))
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const moveEvent = (eventId: string, newDate: Date) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          const originalDate = new Date(event.date)
          const newDateTime = new Date(newDate)
          newDateTime.setHours(originalDate.getHours())
          newDateTime.setMinutes(originalDate.getMinutes())

          const updatedEvent = { ...event, date: newDateTime }

          // Check for conflicts
          const conflicts = checkEventConflicts(updatedEvent, eventId)
          if (conflicts.length > 0) {
            const conflictTitles = conflicts.map((e) => e.title).join(", ")
            if (!confirm(`Moving this event conflicts with: ${conflictTitles}. Do you want to move it anyway?`)) {
              return event // Return original event if user cancels
            }
          }

          return updatedEvent
        }
        return event
      }),
    )
  }

  const checkEventConflicts = (newEvent: Event, excludeEventId?: string): Event[] => {
    const newEventDate = new Date(newEvent.date)
    const conflicts: Event[] = []

    for (const event of events) {
      if (excludeEventId && event.id === excludeEventId) continue

      const eventDate = new Date(event.date)

      // Check if events are on the same day and time
      if (isSameDay(newEventDate, eventDate)) {
        const timeDiff = Math.abs(newEventDate.getTime() - eventDate.getTime())
        if (timeDiff < 60 * 60 * 1000) {
          // Within 1 hour
          conflicts.push(event)
        }
      }
    }

    return conflicts
  }

  const generateRecurringEvents = (event: Event, endDate: Date): Event[] => {
    const recurringEvents: Event[] = []
    let currentDate = new Date(event.date)

    while (isBefore(currentDate, endDate)) {
      switch (event.recurrence) {
        case "daily":
          currentDate = addDays(currentDate, 1)
          break
        case "weekly":
          currentDate = addWeeks(currentDate, 1)
          break
        case "monthly":
          currentDate = addMonths(currentDate, 1)
          break
        case "custom":
          if (event.customRecurrence) {
            const { interval, unit } = event.customRecurrence
            switch (unit) {
              case "days":
                currentDate = addDays(currentDate, interval)
                break
              case "weeks":
                currentDate = addWeeks(currentDate, interval)
                break
              case "months":
                currentDate = addMonths(currentDate, interval)
                break
            }
          }
          break
        default:
          return recurringEvents
      }

      if (isBefore(currentDate, endDate)) {
        recurringEvents.push({
          ...event,
          id: `${event.id}-${currentDate.getTime()}`,
          date: new Date(currentDate),
        })
      }
    }

    return recurringEvents
  }

  const getEventsForDate = (date: Date): Event[] => {
    const directEvents = events.filter((event) => isSameDay(new Date(event.date), date))
    const recurringEvents: Event[] = []

    // Generate recurring events for this date
    const endDate = addMonths(date, 12) // Look ahead 12 months for recurring events

    for (const event of events) {
      if (event.recurrence !== "none") {
        const generated = generateRecurringEvents(event, endDate)
        recurringEvents.push(...generated.filter((e) => isSameDay(new Date(e.date), date)))
      }
    }

    return [...directEvents, ...recurringEvents]
  }

  const getAllEvents = (): Event[] => {
    const allEvents: Event[] = [...events]
    const endDate = addMonths(new Date(), 12) // Look ahead 12 months

    for (const event of events) {
      if (event.recurrence !== "none") {
        const generated = generateRecurringEvents(event, endDate)
        allEvents.push(...generated)
      }
    }

    return allEvents
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    getEventsForDate,
    getAllEvents,
  }
}
