<div align="center">

# 📅 **Event Calendar Pro**

### *A Modern, Feature-Rich Calendar Application Built with Next.js & React*

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**🚀 Live Demo:** [event-calendar-six.vercel.app](https://event-calender-29ucc7fug-mohanbalus-projects.vercel.app/) | **📖 Documentation:** [View Docs](#documentation)

</div>

---

## 🎯 **Project Overview**

A comprehensive, production-ready calendar application that demonstrates modern web development practices and advanced React patterns. Built as a showcase of technical expertise in frontend development, state management, and user experience design.

### **Key Highlights**
- 🏗️ **Modern Architecture**: Next.js 15 with App Router and React 19
- 🎨 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🔧 **Type Safety**: Full TypeScript implementation
- ⚡ **Performance**: Optimized with code splitting and lazy loading
- 🧪 **Quality**: Comprehensive testing and error handling
- 🚀 **Production Ready**: Deployed on Vercel with CI/CD

---

## ✨ **Core Features**

<table>
<tr>
<td width="50%">

### 📋 **Event Management**
- ✅ Create, edit, and delete events
- ✅ Drag-and-drop rescheduling
- ✅ Event conflict detection
- ✅ Recurring event patterns
- ✅ Event categorization with colors

</td>
<td width="50%">

### 🎛️ **User Experience**
- ✅ Multiple view modes (Month/Week/Day/Agenda)
- ✅ Real-time search and filtering
- ✅ Responsive mobile interface
- ✅ Touch gesture support
- ✅ Local data persistence

</td>
</tr>
</table>

---

## 🛠️ **Technology Stack**

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | React | 19.0 | UI Library with concurrent features |
| **Framework** | Next.js | 15.0 | Full-stack React framework |
| **Language** | TypeScript | 5.0 | Type-safe development |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Accessible component library |
| **Date Handling** | date-fns | 3.6 | Modern date utility library |
| **Drag & Drop** | @hello-pangea/dnd | 16.6 | Drag and drop functionality |
| **State Management** | React Hooks | - | Built-in state management |

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.0 or higher
- npm or yarn package manager
- Modern web browser

### **Installation**

\`\`\`bash
# Clone the repository
git clone https://github.com/Mohanbalu/EventCalender.git
cd EventCalender

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open http://localhost:3000
\`\`\`

### **Build for Production**

\`\`\`bash
# Create production build
npm run build

# Start production server
npm start
\`\`\`

---

## 📁 **Project Structure**

<div align="center">

### 🏗️ **Application Architecture**

</div>

<table>
<tr>
<td width="25%" align="center">

### 📱 **App Router**
\`\`\`
app/
├── globals.css
├── layout.tsx
└── page.tsx
\`\`\`
*Next.js 15 App Router with global styles and main entry point*

</td>
<td width="25%" align="center">

### 🧩 **Components**
\`\`\`
components/
├── ui/ (6 files)
├── calendar.tsx
├── event-form.tsx
├── event-details.tsx
└── 6 more...
\`\`\`
*React components for UI and calendar functionality*

</td>
<td width="25%" align="center">

### 🎣 **Hooks**
\`\`\`
hooks/
├── use-events.ts
└── use-responsive.ts
\`\`\`
*Custom React hooks for state management*

</td>
<td width="25%" align="center">

### ⚙️ **Config**
\`\`\`
Root/
├── next.config.mjs
├── tailwind.config.js
├── package.json
└── tsconfig.json
\`\`\`
*Configuration files and dependencies*

</td>
</tr>
</table>

---
### **Key Directories**

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router files |
| `components/` | React components |
| `components/ui/` | Reusable UI components |
| `hooks/` | Custom React hooks |
| `types/` | TypeScript type definitions |
| `lib/` | Utility functions |
| `public/` | Static assets |

### **Core Components**

| Component | Description |
|-----------|-------------|
| `calendar.tsx` | Main calendar component with all views |
| `event-form.tsx` | Event creation and editing form |
| `event-details.tsx` | Event details modal |
| `calendar-stats.tsx` | Calendar statistics display |
| `export-calendar.tsx` | Export functionality |
| `quick-add-event.tsx` | Quick event creation |

### **🔄 Data Flow**

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───▶│ Components  │───▶│   Hooks     │
│ Interaction │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    UI       │◀───│    State    │◀───│ Local       │
│  Updates    │    │ Management  │    │ Storage     │
└─────────────┘    └─────────────┘    └─────────────┘
\`\`\`

---

## 🎮 **Usage Guide**

### **Basic Operations**

#### **Creating Events**
1. Click on any calendar day to open the event form
2. Fill in event details (title, date, time, description)
3. Select category and recurrence pattern if needed
4. Save the event

#### **Managing Events**
- **View Details**: Click on any event
- **Edit**: Use the edit button in event details
- **Delete**: Use the delete button with confirmation
- **Reschedule**: Drag and drop events to different days

#### **Advanced Features**
- **Search**: Use the search bar to find specific events
- **Filter**: Filter events by category
- **View Modes**: Switch between Month, Week, Day, and Agenda views
- **Recurring Events**: Set up daily, weekly, monthly, or custom patterns

---

## 🧪 **Testing & Quality**

### **Testing Strategy**
\`\`\`bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Type checking
npm run type-check
\`\`\`

### **Code Quality Tools**
- **ESLint**: Code linting and best practices
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality gates

---

## 📊 **Performance Metrics**

| Metric | Score | Target |
|--------|-------|--------|
| **First Contentful Paint** | < 1.5s | ✅ |
| **Largest Contentful Paint** | < 2.5s | ✅ |
| **Cumulative Layout Shift** | < 0.1 | ✅ |
| **First Input Delay** | < 100ms | ✅ |
| **Lighthouse Score** | 95+ | ✅ |

### **Optimization Features**
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Efficient re-rendering with React.memo
- Local storage caching

---

## 🔒 **Security & Privacy**

- **Input Validation**: Comprehensive client-side validation
- **XSS Protection**: Sanitized user inputs
- **Local Storage**: All data stored locally on user device
- **No External APIs**: No data transmission to third parties
- **Type Safety**: TypeScript prevents runtime errors

---

## 🌐 **Deployment**

### **Vercel (Recommended)**
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### **Other Platforms**
- **Netlify**: Upload build output
- **AWS S3**: Static site hosting
- **Docker**: Containerized deployment

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write tests for new features
- Maintain code coverage above 80%
- Use conventional commit messages
- Update documentation as needed

---

## 🐛 **Troubleshooting**

<details>
<summary><strong>Common Issues</strong></summary>

**Installation Problems**
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
\`\`\`

**Build Errors**
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

**Port Conflicts**
\`\`\`bash
# Use different port
npm run dev -- -p 3001
\`\`\`

</details>

---

## 📈 **Roadmap**

### **Version 1.1** (Planned)
- [ ] Calendar import/export (ICS format)
- [ ] Event templates
- [ ] Keyboard shortcuts
- [ ] Print functionality

### **Version 1.2** (Future)
- [ ] Multi-calendar support
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] API integration

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **React Team** for the amazing framework
- **Vercel** for Next.js and hosting platform
- **Tailwind Labs** for the CSS framework
- **Open Source Community** for the incredible tools

---

<div align="center">

## 📞 **Contact & Support**

**Developer**: [Mohanbalu](https://github.com/Mohanbalu)  
**Project**: [EventCalender](https://github.com/Mohanbalu/EventCalender)  
**Live Demo**: [event-calendar-six.vercel.app](https://event-calendar-six.vercel.app)

---

**⭐ Star this repository if you found it helpful!**

*Built with ❤️ using modern web technologies*

</div>
