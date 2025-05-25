"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useEvents } from "@/hooks/use-events"

export function ExportCalendar() {
  const [isOpen, setIsOpen] = useState(false)
  const { getAllEvents } = useEvents()

  const exportToICS = () => {
    const events = getAllEvents()

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Event Calendar//Event Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ]

    events.forEach((event) => {
      const startDate = new Date(event.date)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${event.id}@eventcalendar.com`,
        `DTSTART:${format(startDate, "yyyyMMdd'T'HHmmss")}`,
        `DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
        event.category ? `CATEGORIES:${event.category.toUpperCase()}` : "",
        `CREATED:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
        "END:VEVENT",
      )
    })

    icsContent.push("END:VCALENDAR")

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `calendar-${format(new Date(), "yyyy-MM-dd")}.ics`
    link.click()
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const exportToCSV = () => {
    const events = getAllEvents()

    const csvContent = [
      "Title,Date,Time,Description,Category,Recurrence",
      ...events.map((event) =>
        [
          `"${event.title}"`,
          format(new Date(event.date), "yyyy-MM-dd"),
          format(new Date(event.date), "HH:mm"),
          `"${event.description}"`,
          event.category || "",
          event.recurrence,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `calendar-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const exportToJSON = () => {
    const events = getAllEvents()
    const jsonContent = JSON.stringify(events, null, 2)

    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `calendar-${format(new Date(), "yyyy-MM-dd")}.json`
    link.click()
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Calendar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Choose a format to export your calendar events:</p>

          <div className="space-y-2">
            <Button onClick={exportToICS} className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Export as ICS (Calendar File)
              <span className="ml-auto text-xs text-muted-foreground">Import to other calendars</span>
            </Button>

            <Button onClick={exportToCSV} variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV (Spreadsheet)
              <span className="ml-auto text-xs text-muted-foreground">Open in Excel/Sheets</span>
            </Button>

            <Button onClick={exportToJSON} variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export as JSON (Backup)
              <span className="ml-auto text-xs text-muted-foreground">Full data backup</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
