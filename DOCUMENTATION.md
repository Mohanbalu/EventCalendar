# 📚 **Event Calendar Pro - Complete Documentation**

<div align="center">

![Documentation](https://img.shields.io/badge/Documentation-Complete-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Last Updated](https://img.shields.io/badge/Last%20Updated-2024-orange?style=for-the-badge)

</div>

---

## 📖 **Table of Contents**

1. [🚀 Getting Started](#-getting-started)
2. [🏗️ Architecture](#️-architecture)
3. [🧩 Components API](#-components-api)
4. [🎣 Hooks Documentation](#-hooks-documentation)
5. [🔧 Types & Interfaces](#-types--interfaces)
6. [⚙️ Configuration](#️-configuration)
7. [🎨 Styling Guide](#-styling-guide)
8. [📱 Mobile Features](#-mobile-features)
9. [🔄 State Management](#-state-management)
10. [🧪 Testing Guide](#-testing-guide)
11. [🚀 Deployment](#-deployment)
12. [🐛 Troubleshooting](#-troubleshooting)
13. [🤝 Contributing](#-contributing)

---

## 🚀 **Getting Started**

### **Prerequisites**

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18.0+ | Runtime environment |
| npm/yarn | Latest | Package management |
| Git | Latest | Version control |
| Modern Browser | Latest | Development testing |

### **Installation Steps**

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/Mohanbalu/EventCalender.git
cd EventCalender

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Open browser
open http://localhost:3000
\`\`\`

### **Development Scripts**

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
\`\`\`

---

## 🏗️ **Architecture**

### **Project Structure Overview**

\`\`\`
event-calendar/
├── app/                    # Next.js App Router
├── components/             # React Components
│   ├── ui/                # shadcn/ui components
│   └── [feature].tsx      # Feature components
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── lib/                   # Utility functions
└── public/               # Static assets
\`\`\`

### **Data Flow Architecture**

\`\`\`mermaid
graph TD
    A[User Interaction] --> B[UI Components]
    B --> C[Custom Hooks]
    C --> D[Local Storage]
    C --> E[State Management]
    E --> B
    D --> C
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
\`\`\`

### **Component Hierarchy**

\`\`\`
App (page.tsx)
└── Calendar
    ├── EventForm
    ├── EventDetails
    ├── CalendarStats
    ├── ExportCalendar
    ├── QuickAddEvent
    ├── MobileNavigation
    ├── ResponsiveEventCard
    └── TouchGestures
\`\`\`

---

## 🧩 **Components API**

### **Calendar Component**

**Location:** `components/calendar.tsx`

#### **Props**

\`\`\`typescript
interface CalendarProps {
  initialDate?: Date;
  viewMode?: 'month' | 'week' | 'day' | 'agenda';
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}
\`\`\`

#### **Usage**

\`\`\`tsx
import { Calendar } from '@/components/calendar'

export default function App() {
  return (
    <Calendar 
      initialDate={new Date()}
      viewMode="month"
      onEventClick={(event) => console.log(event)}
      onDateClick={(date) => console.log(date)}
    />
  )
}
\`\`\`

#### **Features**

- ✅ Multiple view modes (Month, Week, Day, Agenda)
- ✅ Drag and drop event rescheduling
- ✅ Real-time search and filtering
- ✅ Responsive design for all devices
- ✅ Touch gesture support
- ✅ Event conflict detection

---

### **EventForm Component**

**Location:** `components/event-form.tsx`

#### **Props**

\`\`\`typescript
interface EventFormProps {
  event?: Event | null;
  selectedDate?: Date | null;
  onSubmit: (event: Omit<Event, 'id'>) => void;
  onClose: () => void;
}
\`\`\`

#### **Usage**

\`\`\`tsx
import { EventForm } from '@/components/event-form'

function MyComponent() {
  const handleSubmit = (eventData) => {
    // Handle event creation/update
  }

  return (
    <EventForm
      selectedDate={new Date()}
      onSubmit={handleSubmit}
      onClose={() => setShowForm(false)}
    />
  )
}
\`\`\`

#### **Form Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | Event title |
| description | string | ❌ | Event description |
| date | Date | ✅ | Event date |
| time | string | ✅ | Event time |
| category | string | ❌ | Event category |
| recurrence | RecurrenceType | ❌ | Recurrence pattern |

---

### **EventDetails Component**

**Location:** `components/event-details.tsx`

#### **Props**

\`\`\`typescript
interface EventDetailsProps {
  event: Event;
  onEdit: () => void;
  onDelete: (eventId: string) => void;
  onClose: () => void;
}
\`\`\`

#### **Usage**

\`\`\`tsx
import { EventDetails } from '@/components/event-details'

function MyComponent() {
  return (
    <EventDetails
      event={selectedEvent}
      onEdit={() => setShowEditForm(true)}
      onDelete={(id) => deleteEvent(id)}
      onClose={() => setSelectedEvent(null)}
    />
  )
}
\`\`\`

---

### **UI Components**

#### **Button Component**

\`\`\`tsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
\`\`\`

#### **Input Component**

\`\`\`tsx
import { Input } from '@/components/ui/input'

<Input 
  type="text" 
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
\`\`\`

#### **Dialog Component**

\`\`\`tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
\`\`\`

---

## 🎣 **Hooks Documentation**

### **useEvents Hook**

**Location:** `hooks/use-events.ts`

#### **API**

\`\`\`typescript
interface UseEventsReturn {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Omit<Event, 'id'>) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newDate: Date) => void;
  getEventsForDate: (date: Date) => Event[];
  getAllEvents: () => Event[];
}
\`\`\`

#### **Usage**

\`\`\`tsx
import { useEvents } from '@/hooks/use-events'

function MyComponent() {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsForDate 
  } = useEvents()

  // Add new event
  const handleAddEvent = () => {
    addEvent({
      title: 'New Event',
      description: 'Event description',
      date: new Date(),
      recurrence: 'none',
      category: 'personal'
    })
  }

  // Get events for specific date
  const todayEvents = getEventsForDate(new Date())

  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
\`\`\`

#### **Features**

- ✅ **Local Storage Persistence**: Automatically saves to localStorage
- ✅ **Conflict Detection**: Warns about overlapping events
- ✅ **Recurring Events**: Supports daily, weekly, monthly, custom patterns
- ✅ **Event Filtering**: Filter by date, category, search terms
- ✅ **Drag & Drop**: Move events between dates

---

### **useResponsive Hook**

**Location:** `hooks/use-responsive.ts`

#### **API**

\`\`\`typescript
interface UseResponsiveReturn {
  screenSize: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
\`\`\`

#### **Usage**

\`\`\`tsx
import { useResponsive } from '@/hooks/use-responsive'

function MyComponent() {
  const { isMobile, isTablet, isDesktop, screenSize } = useResponsive()

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
\`\`\`

#### **Breakpoints**

| Screen Size | Width Range | Usage |
|-------------|-------------|-------|
| Mobile | < 768px | Phone layouts |
| Tablet | 768px - 1024px | Tablet layouts |
| Desktop | > 1024px | Desktop layouts |

---

## 🔧 **Types & Interfaces**

### **Event Type**

**Location:** `types/event.ts`

\`\`\`typescript
export interface Event {
  id: string;                    // Unique identifier
  title: string;                 // Event title
  description: string;           // Event description
  date: Date;                    // Event date and time
  recurrence: RecurrenceType;    // Recurrence pattern
  category?: string;             // Event category
  customRecurrence?: CustomRecurrence; // Custom recurrence settings
}
\`\`\`

### **Recurrence Types**

\`\`\`typescript
export type RecurrenceType = 
  | 'none'     // No recurrence
  | 'daily'    // Every day
  | 'weekly'   // Every week
  | 'monthly'  // Every month
  | 'custom'   // Custom pattern

export interface CustomRecurrence {
  interval: number;              // Interval count
  unit: 'days' | 'weeks' | 'months'; // Interval unit
}
\`\`\`

### **Component Props Types**

\`\`\`typescript
// Calendar view modes
export type ViewMode = 'month' | 'week' | 'day' | 'agenda';

// Event categories
export type EventCategory = 
  | 'work' 
  | 'personal' 
  | 'health' 
  | 'social' 
  | 'travel';

// Event colors mapping
export const EVENT_COLORS: Record<EventCategory, string> = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  health: 'bg-red-500',
  social: 'bg-purple-500',
  travel: 'bg-orange-500'
};
\`\`\`

---

## ⚙️ **Configuration**

### **Next.js Configuration**

**File:** `next.config.mjs`

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,    // Skip ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true,     // Skip TypeScript errors during builds
  },
  images: {
    unoptimized: true,          // Disable image optimization
  },
}

export default nextConfig
\`\`\`

### **Tailwind Configuration**

**File:** `tailwind.config.js`

\`\`\`javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... more colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
\`\`\`

### **TypeScript Configuration**

**File:** `tsconfig.json`

\`\`\`json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`

---

## 🎨 **Styling Guide**

### **Design System**

#### **Color Palette**

\`\`\`css
:root {
  /* Light mode */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  --muted: 0 0% 96.1%;
  --accent: 0 0% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
}

.dark {
  /* Dark mode */
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --secondary: 0 0% 14.9%;
  --muted: 0 0% 14.9%;
  --accent: 0 0% 14.9%;
  --destructive: 0 62.8% 30.6%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
}
\`\`\`

#### **Typography**

\`\`\`css
/* Font sizes */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }

/* Font weights */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
\`\`\`

#### **Spacing**

\`\`\`css
/* Padding/Margin scale */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
\`\`\`

### **Component Styling Patterns**

#### **Event Cards**

\`\`\`tsx
// Event card styling
const eventCardStyles = cn(
  "p-3 rounded-lg cursor-pointer transition-all",
  "hover:shadow-md active:scale-[0.98]",
  "border-l-4 shadow-sm",
  getEventColor(event.category),
  "text-white"
)
\`\`\`

#### **Calendar Grid**

\`\`\`tsx
// Calendar day cell styling
const dayStyles = cn(
  "min-h-[120px] p-2 border-r border-b",
  "cursor-pointer transition-colors",
  isToday && "bg-blue-50 dark:bg-blue-950",
  !isCurrentMonth && "bg-muted/50 text-muted-foreground"
)
\`\`\`

---

## 📱 **Mobile Features**

### **Responsive Design**

#### **Breakpoint Strategy**

\`\`\`tsx
// Mobile-first approach
<div className="block md:hidden">
  {/* Mobile view */}
</div>

<div className="hidden md:block lg:hidden">
  {/* Tablet view */}
</div>

<div className="hidden lg:block">
  {/* Desktop view */}
</div>
\`\`\`

#### **Touch Gestures**

**Component:** `components/touch-gestures.tsx`

\`\`\`tsx
import { TouchGestures } from '@/components/touch-gestures'

<TouchGestures
  onSwipeLeft={() => handleNextPeriod()}
  onSwipeRight={() => handlePrevPeriod()}
  onSwipeUp={() => handleViewChange()}
  onSwipeDown={() => handleViewChange()}
>
  <CalendarContent />
</TouchGestures>
\`\`\`

#### **Mobile Navigation**

**Features:**
- ✅ Collapsible menu
- ✅ Touch-friendly buttons (44px minimum)
- ✅ Swipe navigation
- ✅ Optimized layouts for small screens

### **Performance Optimizations**

\`\`\`css
/* Mobile-specific optimizations */
@media screen and (max-width: 768px) {
  /* Ensure touch targets are at least 44px */
  button, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }

  /* Prevent zoom on iOS */
  input, textarea, select {
    font-size: 16px;
  }

  /* Smooth scrolling */
  .scroll-smooth {
    -webkit-overflow-scrolling: touch;
  }
}
\`\`\`

---

## 🔄 **State Management**

### **Local Storage Strategy**

#### **Data Persistence**

\`\`\`typescript
// Automatic save to localStorage
useEffect(() => {
  localStorage.setItem('calendar-events', JSON.stringify(events))
}, [events])

// Load from localStorage on mount
useEffect(() => {
  const savedEvents = localStorage.getItem('calendar-events')
  if (savedEvents) {
    try {
      const parsedEvents = JSON.parse(savedEvents).map(event => ({
        ...event,
        date: new Date(event.date)
      }))
      setEvents(parsedEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }
}, [])
\`\`\`

#### **State Structure**

\`\`\`typescript
// Global state shape
interface AppState {
  events: Event[];
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  searchTerm: string;
  filterCategory: string;
  showEventForm: boolean;
  selectedEvent: Event | null;
}
\`\`\`

### **Event Management**

#### **CRUD Operations**

\`\`\`typescript
// Create
const addEvent = (eventData: Omit<Event, 'id'>) => {
  const newEvent = { ...eventData, id: generateId() }
  setEvents(prev => [...prev, newEvent])
}

// Read
const getEventsForDate = (date: Date) => {
  return events.filter(event => 
    isSameDay(new Date(event.date), date)
  )
}

// Update
const updateEvent = (id: string, eventData: Omit<Event, 'id'>) => {
  setEvents(prev => 
    prev.map(event => 
      event.id === id ? { ...eventData, id } : event
    )
  )
}

// Delete
const deleteEvent = (id: string) => {
  setEvents(prev => prev.filter(event => event.id !== id))
}
\`\`\`

#### **Conflict Detection**

\`\`\`typescript
const checkEventConflicts = (newEvent: Event, excludeId?: string) => {
  return events.filter(event => {
    if (excludeId && event.id === excludeId) return false
    
    const eventDate = new Date(event.date)
    const newEventDate = new Date(newEvent.date)
    
    // Check if events are on same day and within 1 hour
    if (isSameDay(newEventDate, eventDate)) {
      const timeDiff = Math.abs(newEventDate.getTime() - eventDate.getTime())
      return timeDiff < 60 * 60 * 1000 // 1 hour
    }
    
    return false
  })
}
\`\`\`

---

## 🧪 **Testing Guide**

### **Testing Setup**

#### **Dependencies**

\`\`\`json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0"
  }
}
\`\`\`

#### **Jest Configuration**

\`\`\`javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
\`\`\`

### **Test Examples**

#### **Component Testing**

\`\`\`tsx
// __tests__/Calendar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from '@/components/calendar'

describe('Calendar Component', () => {
  test('renders calendar grid', () => {
    render(<Calendar />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  test('handles date click', () => {
    const onDateClick = jest.fn()
    render(<Calendar onDateClick={onDateClick} />)
    
    const dateCell = screen.getByText('15')
    fireEvent.click(dateCell)
    
    expect(onDateClick).toHaveBeenCalled()
  })
})
\`\`\`

#### **Hook Testing**

\`\`\`tsx
// __tests__/useEvents.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useEvents } from '@/hooks/use-events'

describe('useEvents Hook', () => {
  test('adds new event', () => {
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.addEvent({
        title: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        recurrence: 'none'
      })
    })

    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0].title).toBe('Test Event')
  })
})
\`\`\`

### **Testing Commands**

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Calendar.test.tsx
\`\`\`

---

## 🚀 **Deployment**

### **Vercel Deployment**

#### **Automatic Deployment**

1. **Connect Repository**
   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   \`\`\`

2. **Environment Variables**
   \`\`\`bash
   # Set environment variables
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NODE_ENV
   \`\`\`

3. **Build Configuration**
   \`\`\`json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs"
   }
   \`\`\`

#### **Custom Domain**

\`\`\`bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS
# Add CNAME record: www -> cname.vercel-dns.com
# Add A record: @ -> 76.76.19.61
\`\`\`

### **Other Deployment Options**

#### **Netlify**

\`\`\`bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
NEXT_PUBLIC_APP_URL=https://yourapp.netlify.app
\`\`\`

#### **Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
