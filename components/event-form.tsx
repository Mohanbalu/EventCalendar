"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Event, RecurrenceType } from "@/types/event"

interface EventFormProps {
  event?: Event | null
  selectedDate?: Date | null
  onSubmit: (event: Omit<Event, "id">) => void
  onClose: () => void
}

export function EventForm({ event, selectedDate, onSubmit, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    recurrence: "none" as RecurrenceType,
    category: "",
    customRecurrence: {
      interval: 1,
      unit: "weeks" as "days" | "weeks" | "months",
    },
  })

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date)
      setFormData({
        title: event.title,
        description: event.description,
        date: format(eventDate, "yyyy-MM-dd"),
        time: format(eventDate, "HH:mm"),
        recurrence: event.recurrence,
        category: event.category || "",
        customRecurrence: event.customRecurrence || {
          interval: 1,
          unit: "weeks",
        },
      })
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: "09:00",
      }))
    }
  }, [event, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.date || !formData.time) {
      alert("Please fill in all required fields")
      return
    }

    const eventDate = new Date(`${formData.date}T${formData.time}`)

    const eventData: Omit<Event, "id"> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: eventDate,
      recurrence: formData.recurrence,
      category: formData.category || undefined,
      customRecurrence: formData.recurrence === "custom" ? formData.customRecurrence : undefined,
    }

    onSubmit(eventData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomRecurrenceChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      customRecurrence: {
        ...prev.customRecurrence,
        [field]: value,
      },
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Recurrence</Label>
            <Select
              value={formData.recurrence}
              onValueChange={(value) => handleInputChange("recurrence", value as RecurrenceType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Recurrence</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.recurrence === "custom" && (
            <div className="space-y-2">
              <Label>Custom Recurrence</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={formData.customRecurrence.interval}
                  onChange={(e) => handleCustomRecurrenceChange("interval", Number.parseInt(e.target.value))}
                  className="w-20"
                />
                <Select
                  value={formData.customRecurrence.unit}
                  onValueChange={(value) => handleCustomRecurrenceChange("unit", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{event ? "Update Event" : "Add Event"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
