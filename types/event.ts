export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom"

export interface CustomRecurrence {
  interval: number
  unit: "days" | "weeks" | "months"
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  recurrence: RecurrenceType
  category?: string
  customRecurrence?: CustomRecurrence
}
