"use client"

import { Calendar } from "@/components/calendar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Event Calendar</h1>
          <p className="text-muted-foreground text-center">
            Manage your events with drag-and-drop, recurring events, and more
          </p>
        </div>
        <Calendar />
      </div>
    </div>
  )
}
