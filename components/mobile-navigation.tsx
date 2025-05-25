"use client"

import { useState } from "react"
import { format, addDays, subDays } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, Grid, List, Menu, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ViewMode = "month" | "week" | "day" | "agenda"

interface MobileNavigationProps {
  currentDate: Date
  viewMode: ViewMode
  searchTerm: string
  filterCategory: string
  categories: string[]
  onDateChange: (date: Date) => void
  onViewModeChange: (mode: ViewMode) => void
  onSearchChange: (term: string) => void
  onFilterChange: (category: string) => void
  onAddEvent: () => void
}

export function MobileNavigation({
  currentDate,
  viewMode,
  searchTerm,
  filterCategory,
  categories,
  onDateChange,
  onViewModeChange,
  onSearchChange,
  onFilterChange,
  onAddEvent,
}: MobileNavigationProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handlePrevious = () => {
    switch (viewMode) {
      case "day":
        onDateChange(subDays(currentDate, 1))
        break
      case "week":
        onDateChange(subDays(currentDate, 7))
        break
      default:
        onDateChange(subDays(currentDate, 30))
    }
  }

  const handleNext = () => {
    switch (viewMode) {
      case "day":
        onDateChange(addDays(currentDate, 1))
        break
      case "week":
        onDateChange(addDays(currentDate, 7))
        break
      default:
        onDateChange(addDays(currentDate, 30))
    }
  }

  const getViewTitle = () => {
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEE, MMM d")
      case "week":
        return format(currentDate, "MMM yyyy")
      case "agenda":
        return format(currentDate, "MMM yyyy")
      default:
        return format(currentDate, "MMMM yyyy")
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-lg font-semibold min-w-[120px] text-center">{getViewTitle()}</h1>

          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button size="sm" onClick={onAddEvent}>
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      {/* View Mode Selector */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(mode)}
            className="flex-1 text-xs"
          >
            {mode === "month" && <Grid className="h-3 w-3 mr-1" />}
            {mode === "week" && <List className="h-3 w-3 mr-1" />}
            {mode === "day" && <Calendar className="h-3 w-3 mr-1" />}
            {mode === "agenda" && <Menu className="h-3 w-3 mr-1" />}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg animate-in slide-in-from-top-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(searchTerm || filterCategory) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSearchChange("")
                onFilterChange("")
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
