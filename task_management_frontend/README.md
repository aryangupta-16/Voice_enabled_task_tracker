# Voice-Enabled Task Tracker - Frontend

A modern, feature-rich React/Next.js frontend for an intelligent task management system with voice-to-text input parsing. Built with TypeScript, Tailwind CSS, and the Web Speech API.

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Backend API running on `http://localhost:3000/api/v1`

### Installation

```bash
# Clone and navigate
cd task_management_frontend/my-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## ✨ Features

- 🎤 **Voice Input**: Create tasks by speaking naturally using Web Speech API
- 🧠 **Smart Parsing**: Automatically extracts title, priority, and due date from voice
- 📊 **Dual Views**: Kanban board and list view for task management
- 🔍 **Advanced Filters**: Filter by status, priority, and search keywords
- ✏️ **Full CRUD**: Create, read, update, and delete tasks seamlessly
- 🎨 **Modern UI**: Beautiful Tailwind CSS design with responsive layout
- 🔒 **Type-Safe**: Full TypeScript implementation
- ⚡ **Real-time Updates**: Instant UI updates across all views

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI (Modal, Button, Alert)
│   ├── task/           # Task components (Card, Form, Filter)
│   └── voice/          # Voice components (Button, Review)
├── hooks/              # Custom React hooks
│   ├── useTasks.ts     # Task state management
│   └── useVoice.ts     # Voice input management
├── pages/
│   └── HomePage.tsx    # Main application page
├── services/           # API & external services
│   ├── api.ts          # API client
│   └── voiceRecognition.ts  # Web Speech API wrapper
├── types/
│   └── index.ts        # TypeScript type definitions
└── utils/
    └── helpers.ts      # Utility functions
```

## 🚀 Usage

### Creating a Task Manually

1. Click **"+ Add Task"** button
2. Fill in task details (title, description, priority, due date)
3. Click **"Create Task"**

### Creating a Task with Voice

1. Click **"Start Recording"** (microphone button)
2. Speak naturally: *"Create a high priority task to review authentication by tomorrow"*
3. Review the parsed data in the modal
4. Edit if needed and click **"Create Task"**

### Managing Tasks

- **Edit**: Click task title or "Edit" button
- **Change Status**: Use status dropdown on task card
- **Delete**: Click delete button with confirmation
- **Filter**: Use filter controls to narrow down tasks
- **Search**: Search by task title or description

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_TIMEZONE=UTC
```

## 🎤 Voice Features

### Supported Patterns

**Priority Keywords:**
- CRITICAL: "urgent", "critical", "ASAP", "immediately"
- HIGH: "important", "high priority", "soon"
- MEDIUM: default
- LOW: "low priority", "can wait"

**Date Patterns:**
- Relative: "today", "tomorrow", "next Monday", "in 3 days"
- Absolute: "15th January", "Jan 15", "2025-01-15"
- Keywords: "by Friday", "due tomorrow"

## 📱 Browser Support

- ✅ Chrome/Edge 25+
- ✅ Safari 14.1+
- ⚠️ Firefox 25+ (limited voice support)
- ❌ Internet Explorer

## 🏗️ Architecture

### Component Hierarchy
```
HomePage (main)
├── Header (controls)
├── Alerts (feedback)
├── TaskFilter (filtering)
├── Board/List View
│   └── TaskCard (items)
└── Modals
    ├── TaskForm
    └── VoiceParseReview
```

### State Management
- React Hooks for local state
- Custom hooks for business logic
- API service for backend communication
- No external state library (simple and modular)

### Data Flow
```
User Interaction
    ↓
Component Handler
    ↓
Hook/Service
    ↓
API Call
    ↓
State Update
    ↓
Component Re-render
```

## 🛠️ Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Adding Features

See `DEVELOPMENT_GUIDE.md` for:
- Detailed architecture overview
- Component development patterns
- Hook implementation guide
- API integration examples
- Styling conventions

## 🐛 Troubleshooting

### Voice not working
- Verify browser compatibility (Chrome/Edge recommended)
- Check microphone permissions
- Ensure backend API is running
- Check browser console for errors

### Tasks not loading
- Verify backend is running on `http://localhost:3000`
- Check `.env.local` configuration
- Inspect network tab for API errors

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## 📚 Documentation

- **[FRONTEND_README.md](./FRONTEND_README.md)** - Complete frontend documentation
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Architecture and development guide
- **[../api-endpoints.md](../api-endpoints.md)** - API documentation
- **[../backend-architecture.md](../backend-architecture.md)** - Backend design

## 🤝 Contributing

When modifying the codebase:
1. Keep components modular and reusable
2. Maintain TypeScript strict mode
3. Use meaningful variable/function names
4. Add JSDoc comments for public APIs
5. Update type definitions when changing data structures

## 📦 Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Voice API**: Web Speech API (browser native)
- **HTTP Client**: Fetch API (native)

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 📝 License

Part of the Aerchain SDE Assignment.

## 🚀 Next Steps

1. Start the development server
2. Create your first task using voice
3. Explore the Kanban board and list views
4. Check the DEVELOPMENT_GUIDE for architecture details
5. Customize and extend based on your needs

---

**Built with ❤️ for modern task management**
