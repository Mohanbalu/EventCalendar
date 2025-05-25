"use client"

import { format } from "date-fns"
import { Clock, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/event"

interface ResponsiveEventCardProps {
  event: Event
  variant?: "compact" | "detailed" | "list"
  onClick?: () => void
  className?: string
}

export function ResponsiveEventCard({ event, variant = "compact", onClick, className }: ResponsiveEventCardProps) {
  const getEventColor = (category: string | undefined) => {
    const colors: Record<string, string> = {
      work: "bg-blue-500 border-blue-600",
      personal: "bg-green-500 border-green-600",
      health: "bg-red-500 border-red-600",
      social: "bg-purple-500 border-purple-600",
      travel: "bg-orange-500 border-orange-600",
      default: "bg-gray-500 border-gray-600",
    }
    return colors[category || "default"] || colors.default
  }

  const getTextColor = (category: string | undefined) => {
    const colors: Record<string, string> = {
      work: "text-blue-50",
      personal: "text-green-50",
      health: "text-red-50",
      social: "text-purple-50",
      travel: "text-orange-50",
      default: "text-gray-50",
    }
    return colors[category || "default"] || colors.default
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
          "border-l-4 shadow-sm",
          getEventColor(event.category),
          getTextColor(event.category),
          className,
        )}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{event.title}</h4>
            <p className="text-xs opacity-90">{format(new Date(event.date), "h:mm a")}</p>
          </div>
          {event.recurrence !== "none" && <Repeat className="h-3 w-3 opacity-80 flex-shrink-0 ml-1" />}
        </div>
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div
        className={cn(
          "p-3 rounded-xl cursor-pointer transition-all hover:shadow-md active:scale-[0.98]",
          "border-l-4 bg-white dark:bg-gray-800 shadow-sm",
          getEventColor(event.category).replace("bg-", "border-"),
          className,
        )}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-center">
            <div className="text-xs font-medium text-muted-foreground">
              {format(new Date(event.date), "MMM").toUpperCase()}
            </div>
            <div className="text-lg font-bold">{format(new Date(event.date), "d")}</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">{event.title}</h4>
              {event.recurrence !== "none" && <Repeat className="h-4 w-4 text-muted-foreground" />}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(event.date), "h:mm a")}
              </div>

              {event.category && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    getEventColor(event.category),
                    getTextColor(event.category),
                  )}
                >
                  {event.category}
                </span>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Detailed variant
  return (
    <div
      className={cn(
        "p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]",
        "border shadow-md",
        getEventColor(event.category),
        getTextColor(event.category),
        className,
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center gap-2 mt-1 opacity-90">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{format(new Date(event.date), "EEEE, MMMM d 'at' h:mm a")}</span>
            </div>
          </div>
          {event.recurrence !== "none" && (
            <div className="flex items-center gap-1 opacity-80">
              <Repeat className="h-4 w-4" />
              <span className="text-xs">Recurring</span>
            </div>
          )}
        </div>

        {event.description && <p className="text-sm opacity-90 line-clamp-3">{event.description}</p>}

        <div className="flex items-center justify-between">
          {event.category && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
          )}

          <div className="text-xs opacity-75">Tap to view details</div>
        </div>
      </div>
    </div>
  )
}
