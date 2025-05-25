"use client"

import { useMemo } from "react"
import { isThisMonth, isThisWeek, isToday } from "date-fns"
import { Calendar, Clock, Repeat, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEvents } from "@/hooks/use-events"

export function CalendarStats() {
  const { getAllEvents } = useEvents()

  const stats = useMemo(() => {
    const allEvents = getAllEvents()

    const todayEvents = allEvents.filter((event) => isToday(new Date(event.date)))
    const thisWeekEvents = allEvents.filter((event) => isThisWeek(new Date(event.date)))
    const thisMonthEvents = allEvents.filter((event) => isThisMonth(new Date(event.date)))
    const recurringEvents = allEvents.filter((event) => event.recurrence !== "none")

    const categoryStats = allEvents.reduce(
      (acc, event) => {
        const category = event.category || "uncategorized"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      today: todayEvents.length,
      thisWeek: thisWeekEvents.length,
      thisMonth: thisMonthEvents.length,
      recurring: recurringEvents.length,
      total: allEvents.length,
      categories: categoryStats,
    }
  }, [getAllEvents])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.today}</div>
          <p className="text-xs text-muted-foreground">{stats.today === 1 ? "event" : "events"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisWeek}</div>
          <p className="text-xs text-muted-foreground">{stats.thisWeek === 1 ? "event" : "events"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisMonth}</div>
          <p className="text-xs text-muted-foreground">{stats.thisMonth === 1 ? "event" : "events"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recurring</CardTitle>
          <Repeat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recurring}</div>
          <p className="text-xs text-muted-foreground">{stats.recurring === 1 ? "event" : "events"}</p>
        </CardContent>
      </Card>
    </div>
  )
}
