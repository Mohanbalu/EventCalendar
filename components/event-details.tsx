"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Event } from "@/types/event"
import { Edit, Trash2, Calendar, Clock, Repeat } from "lucide-react"

interface EventDetailsProps {
  event: Event
  onEdit: () => void
  onDelete: (eventId: string) => void
  onClose: () => void
}

export function EventDetails({ event, onEdit, onDelete, onClose }: EventDetailsProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id)
    }
  }

  const getRecurrenceText = () => {
    switch (event.recurrence) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "monthly":
        return "Monthly"
      case "custom":
        return `Every ${event.customRecurrence?.interval} ${event.customRecurrence?.unit}`
      default:
        return "No recurrence"
    }
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{event.title}</span>
            {event.category && (
              <span className={`px-2 py-1 rounded text-white text-xs ${getEventColor(event.category)}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(event.date), "h:mm a")}</span>
          </div>

          {event.recurrence !== "none" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Repeat className="h-4 w-4" />
              <span>{getRecurrenceText()}</span>
            </div>
          )}

          {event.description && (
            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
