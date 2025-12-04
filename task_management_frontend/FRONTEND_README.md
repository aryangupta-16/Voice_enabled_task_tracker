# Voice-Enabled Task Tracker - Frontend

A modern, modular React/Next.js frontend application for managing tasks with intelligent voice input parsing. Built with TypeScript, Tailwind CSS, and Web Speech API.

## 🎯 Features

- ✅ **Voice-Enabled Task Creation**: Use the Web Speech API to create tasks by speaking naturally
- ✅ **Intelligent Parsing**: Automatically extracts task details (title, priority, due date) from voice input
- ✅ **Multiple Views**: Board view (Kanban-style) and List view for task management
- ✅ **Task Management**: Create, read, update, and delete tasks with full CRUD operations
- ✅ **Advanced Filtering**: Filter tasks by status, priority, and search keywords
- ✅ **Real-time Updates**: Instant UI updates on task modifications
- ✅ **Responsive Design**: Works seamlessly on desktop and tablet devices
- ✅ **Modern UI**: Clean, attractive interface with Tailwind CSS
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Type-Safe**: Full TypeScript implementation with strict type checking

## 📁 Project Structure

```
src/
├── components/
│   ├── common/                 # Reusable UI components
│   │   ├── Alert.tsx          # Alert/notification component
│   │   ├── Button.tsx         # Button with variants
│   │   ├── Modal.tsx          # Modal dialog
│   │   └── index.ts
│   ├── task/                  # Task-related components
│   │   ├── TaskCard.tsx       # Task display card
│   │   ├── TaskFilter.tsx     # Filter controls
│   │   ├── TaskForm.tsx       # Task form (create/edit)
│   │   └── index.ts
│   └── voice/                 # Voice-related components
│       ├── VoiceInputButton.tsx    # Record button
│       ├── VoiceParseReview.tsx    # Review modal
│       └── index.ts
├── hooks/
│   ├── useTasks.ts           # Task state management hook
│   ├── useVoice.ts           # Voice input management hook
│   └── index.ts
├── pages/
│   └── HomePage.tsx          # Main application page
├── services/
│   ├── api.ts                # API client & endpoints
│   ├── voiceRecognition.ts   # Web Speech API wrapper
│   └── index.ts
├── types/
│   └── index.ts              # Global TypeScript types
├── utils/
│   └── helpers.ts            # Utility functions
└── styles/
    └── (global styles in app/globals.css)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000/api/v1`
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   cd task_management_frontend/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎤 Using Voice Input

### How to Create a Task with Voice

1. Click the **"Start Recording"** button (microphone icon) in the header
2. Speak naturally: *"Create a high priority task to review the authentication PR by tomorrow evening"*
3. The app automatically stops recording after silence
4. Review the parsed task details in the modal
5. Edit any fields if needed
6. Click **"Create Task"** to save

### Voice Parsing Features

The system intelligently extracts:
- **Title**: Main task description
- **Priority**: Keywords like "urgent", "critical", "high", "low"
- **Due Date**: Relative ("tomorrow", "next Monday") or absolute ("Jan 15")
- **Status**: Default "To Do" unless specified

### Supported Voice Patterns

**Priority Detection:**
- CRITICAL: "urgent", "critical", "ASAP", "immediately"
- HIGH: "high priority", "important", "soon"
- MEDIUM: (default)
- LOW: "low priority", "can wait"

**Date Patterns:**
- Relative: "today", "tomorrow", "next Monday", "in 3 days"
- Absolute: "15th January", "Jan 15", "2025-01-15"
- Keywords: "by Friday", "due tomorrow"

## 🔧 API Integration

All API calls are handled through the `services/api.ts` module with:
- Centralized API configuration
- Error handling with custom `APIError` class
- Request/response typing
- Automatic JSON serialization

### Available Services

#### Task Service
```typescript
taskService.createTask(taskData)
taskService.getAllTasks(filters)
taskService.getTaskById(id)
taskService.updateTask(id, taskData)
taskService.deleteTask(id)
```

#### Voice Service
```typescript
voiceService.parseTranscript(transcript, timezone)
voiceService.createTaskFromVoice(data)
voiceService.getParsingLog(logId)
```

## 🎨 UI Components

### Common Components
- **Modal**: Reusable modal dialog with overlay
- **Button**: Button variants (primary, secondary, danger, success)
- **Alert**: Notification alerts with auto-dismiss

### Task Components
- **TaskCard**: Displays individual task with actions
- **TaskForm**: Create/edit task form
- **TaskFilter**: Filter controls for tasks

### Voice Components
- **VoiceInputButton**: Record button with visual feedback
- **VoiceParseReview**: Review and edit parsed voice data

## 🪝 Custom Hooks

### useTasks
Manages task state and CRUD operations
```typescript
const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
```

### useVoice
Manages voice recording and parsing
```typescript
const { 
  isRecording, 
  transcript, 
  parsedData, 
  startRecording, 
  stopRecording, 
  parseTranscript,
  createTaskFromVoice 
} = useVoice();
```

## 📊 State Management

The application uses:
- **React Hooks** for local state management (React.useState, React.useCallback)
- **Custom Hooks** for business logic encapsulation
- **No Redux** - kept simple for maintainability

## 🛡️ Error Handling

- **API Errors**: Centralized in `APIError` class with status codes
- **Validation**: Form validation before submission
- **User Feedback**: Alert components for errors and success messages
- **Network Errors**: Graceful handling with retry options

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized for desktop (mobile coming soon)

## 🔐 Browser Compatibility

- ✅ Chrome/Edge 25+
- ✅ Safari 14.1+
- ✅ Firefox 25+ (experimental)
- ❌ IE 11 (Web Speech API not supported)

## 🎯 Key Features Implementation

### Modular Architecture
- Separated concerns: components, hooks, services, types
- Reusable components and utilities
- Easy to test and maintain

### Type Safety
- Full TypeScript implementation
- Strict mode enabled
- Comprehensive type definitions

### API Integration
- RESTful API communication
- Request/response validation
- Error handling

### Voice Processing
- Web Speech API wrapper
- Real-time transcript display
- Parse review before saving

## 🚀 Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Task scheduling and reminders
- [ ] User authentication
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Task comments and attachments
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Offline support with service workers
- [ ] Multi-language voice support

## 📖 Development Guidelines

### Adding a New Component
1. Create file in appropriate `/components` folder
2. Export from `index.ts`
3. Use TypeScript interfaces for props
4. Use Tailwind CSS for styling
5. Add JSDoc comments

### Adding a New Hook
1. Create file in `/hooks` folder
2. Prefix with `use`
3. Return typed object
4. Add JSDoc comments
5. Export from `index.ts`

### Adding API Endpoint
1. Add function to `services/api.ts`
2. Use generic `fetchAPI` helper
3. Add proper TypeScript types
4. Update type definitions if needed

## 🐛 Troubleshooting

### Voice not working
- Check browser compatibility (Chrome/Edge recommended)
- Allow microphone permissions
- Check console for errors
- Ensure backend is running

### API connection issues
- Verify backend is running on `http://localhost:3000`
- Check `.env.local` configuration
- Check browser console for network errors
- Verify CORS settings on backend

### Tasks not loading
- Ensure backend API is running
- Check network tab in browser DevTools
- Verify API endpoint URL in `.env.local`

## 📦 Dependencies

```json
{
  "next": "16.0.6",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

## 🤝 AI Tools Used

- **GitHub Copilot**: Boilerplate generation, code snippets, debugging
- **Cursor IDE**: Intelligent code completion and refactoring suggestions
- **Claude/ChatGPT**: Architecture design, problem-solving, documentation

## 📝 License

This project is part of the Aerchain SDE Assignment.

## 📧 Support

For issues or questions, refer to the assignment documentation or check the backend API documentation.

---

**Happy Task Tracking! 🚀**
