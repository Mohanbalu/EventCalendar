"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Plus, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useEvents } from "@/hooks/use-events"

export function QuickAddEvent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [quickTitle, setQuickTitle] = useState("")
  const [quickDate, setQuickDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [quickTime, setQuickTime] = useState("09:00")

  const { addEvent } = useEvents()

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return

    const eventDate = new Date(`${quickDate}T${quickTime}`)

    addEvent({
      title: quickTitle.trim(),
      description: "",
      date: eventDate,
      recurrence: "none",
      category: "personal",
    })

    setQuickTitle("")
    setIsExpanded(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuickAdd()
    }
    if (e.key === "Escape") {
      setIsExpanded(false)
      setQuickTitle("")
    }
  }

  if (!isExpanded) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Quick add event...
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4 space-y-3">
        <Input
          placeholder="Event title..."
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
        />

        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={quickDate} onChange={(e) => setQuickDate(e.target.value)} className="flex-1" />
          </div>

          <div className="flex items-center gap-2 flex-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input type="time" value={quickTime} onChange={(e) => setQuickTime(e.target.value)} className="flex-1" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleQuickAdd} disabled={!quickTitle.trim()} className="flex-1">
            Add Event
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsExpanded(false)
              setQuickTitle("")
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
