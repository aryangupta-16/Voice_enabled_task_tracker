# Frontend Development Guide

## Architecture Overview

This frontend follows a **component-based, modular architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│          Application Shell (HomePage)           │
├─────────────────────────────────────────────────┤
│  UI Components (TaskCard, TaskForm, etc.)      │
├─────────────────────────────────────────────────┤
│  Custom Hooks (useTasks, useVoice)             │
├─────────────────────────────────────────────────┤
│  Services (api.ts, voiceRecognition.ts)        │
├─────────────────────────────────────────────────┤
│  Types & Utils                                  │
├─────────────────────────────────────────────────┤
│  External APIs (Backend, Web Speech API)       │
└─────────────────────────────────────────────────┘
```

## Component Organization

### Common Components (`src/components/common/`)
Reusable UI building blocks used throughout the application.

**Modal.tsx**
- Generic modal dialog
- Props: `isOpen`, `onClose`, `title`, `children`, `size`, `actions`
- Used for forms, reviews, dialogs

**Button.tsx**
- Styled button with variants
- Variants: `primary`, `secondary`, `danger`, `success`
- Sizes: `sm`, `md`, `lg`
- Supports loading state

**Alert.tsx**
- Notification/alert component
- Types: `success`, `error`, `warning`, `info`
- Auto-dismiss capability

### Task Components (`src/components/task/`)
Task management UI components.

**TaskCard.tsx**
- Displays individual task
- Shows: title, description, priority badge, due date, status
- Actions: edit, delete, status change
- Supports drag-and-drop (prepared)

**TaskForm.tsx**
- Create/Edit task form
- Fields: title, description, priority, status, due date
- Built-in validation
- Used in modal

**TaskFilter.tsx**
- Filter controls
- Filters: status, priority, search
- Reset button

### Voice Components (`src/components/voice/`)
Voice input specific components.

**VoiceInputButton.tsx**
- Toggle record button
- Shows recording state with visual feedback
- Browser support check

**VoiceParseReview.tsx**
- Review modal for parsed voice data
- Editable fields
- Confidence scores display
- Confirm/discard actions

## Hooks System

### useTasks Hook
```typescript
const { 
  tasks,           // Current tasks array
  loading,         // Loading state
  error,          // Error message
  fetchTasks,     // Fetch all tasks
  createTask,     // Create new task
  updateTask,     // Update existing task
  deleteTask,     // Delete task
  getTaskById,    // Get single task
  clearError      // Clear error state
} = useTasks();
```

**Implementation Pattern:**
- Uses `useState` for tasks, loading, error
- Uses `useCallback` for memoized functions
- Calls API through `taskService`
- Manages local cache of tasks

### useVoice Hook
```typescript
const {
  isRecording,       // Recording state
  transcript,        // Current transcript
  isParsingVoice,   // Parsing in progress
  parsedData,       // Parsed voice response
  error,            // Error message
  startRecording,   // Start recording
  stopRecording,    // Stop recording
  parseTranscript,  // Parse transcript
  createTaskFromVoice, // Create task from voice
  resetVoiceState,  // Clear voice state
  isVoiceSupported  // Browser support flag
} = useVoice();
```

**Implementation Pattern:**
- Uses Web Speech API wrapper
- Integrates with voice service
- Handles real-time transcript updates
- Manages parsing state

## Services Layer

### API Service (`services/api.ts`)

**Architecture:**
```typescript
fetchAPI<T>()              // Generic fetch wrapper
  ├── Error handling (APIError)
  ├── Headers management
  └── JSON serialization

taskService
  ├── createTask()
  ├── getAllTasks()
  ├── getTaskById()
  ├── updateTask()
  └── deleteTask()

voiceService
  ├── parseTranscript()
  ├── createTaskFromVoice()
  └── getParsingLog()

healthService
  └── checkHealth()
```

**Key Features:**
- Centralized API configuration via environment variable
- Generic error handling with custom `APIError` class
- Full TypeScript typing for all endpoints
- Request body validation through types
- Automatic URL encoding for query parameters

### Voice Recognition Service (`services/voiceRecognition.ts`)

**Web Speech API Wrapper:**
```typescript
startRecording(onResult, onError)  // Start recording
stopRecording()                     // Stop recording
isSupported()                       // Check browser support
getIsListening()                    // Get current state
```

**Features:**
- Cross-browser support (webkit prefix)
- Real-time interim results
- Final transcript compilation
- Error handling

## Type Definitions

All types are defined in `src/types/index.ts` for single source of truth.

**Core Types:**
```typescript
Task              // Task entity
TaskStatus        // Union type: TODO | IN_PROGRESS | DONE
Priority          // Union type: LOW | MEDIUM | HIGH | CRITICAL
CreateTaskDTO     // Create task request
UpdateTaskDTO     // Update task request
VoiceParseResponse // Voice parsing response
TaskFilterOptions // Filter options interface
KanbanBoard      // Board structure
```

**Benefits:**
- Type safety across frontend
- Matches backend schema
- IDE autocomplete support
- Easy refactoring

## Utility Functions

`utils/helpers.ts` contains pure utility functions:

**Date Functions:**
- `formatDate()` - Format date to readable string
- `formatTimeAgo()` - Relative time ("2 hours ago")
- `isOverdue()`, `isToday()`, `isTomorrow()` - Date checks
- `getDueDateStatus()` - User-friendly due date text

**Color/Style Functions:**
- `getPriorityColor()` - Tailwind color class for priority
- `getPriorityBadgeClass()` - Complete badge styling
- `getStatusColor()` - Tailwind color class for status
- `getColorFromString()` - Random color from string hash

**Text Functions:**
- `truncateText()` - Truncate with ellipsis
- `capitalize()` - Capitalize first letter
- `getPriorityLabel()`, `getStatusLabel()` - Readable labels

**Validation:**
- `validateEmail()` - Email regex validation

**Benefits:**
- Pure functions (no side effects)
- Testable
- Reusable across components
- Consistent formatting

## Data Flow

### Task Creation Flow
```
User Input → TaskForm Component
  ↓
Form Validation (validateForm())
  ↓
useTasks.createTask()
  ↓
taskService.createTask()
  ↓
API POST /tasks
  ↓
Update local tasks state
  ↓
Close modal + Show success alert
```

### Voice Task Creation Flow
```
User speaks → VoiceInputButton
  ↓
Web Speech API (voiceRecognitionService)
  ↓
Transcript → useVoice.parseTranscript()
  ↓
voiceService.parseTranscript()
  ↓
API POST /voice/parse
  ↓
Show VoiceParseReview Modal
  ↓
User reviews/edits (onConfirm)
  ↓
useVoice.createTaskFromVoice()
  ↓
API POST /voice/create-task
  ↓
Update tasks + Show success alert
```

### Task Update Flow
```
TaskCard → handleStatusChange()
  ↓
useTasks.updateTask()
  ↓
taskService.updateTask()
  ↓
API PATCH /tasks/:id
  ↓
Update local tasks array
  ↓
UI re-renders with updated task
```

## State Management Pattern

```typescript
// In component
const [selectedTask, setSelectedTask] = useState<Task | null>(null);
const [showModal, setShowModal] = useState(false);

// In hook
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(false);

// Updates
setTasks(prev => [newTask, ...prev])  // Immutable update
setLoading(true)                       // Loading state
setError(message)                      // Error handling
```

**Key Principles:**
- Use `useState` for component-level state
- Use custom hooks for business logic
- Update state immutably
- Clear errors on user action

## Error Handling Pattern

```typescript
try {
  const result = await createTask(taskData);
  if (result) {
    // Success
    setShowForm(false);
  }
} catch (err) {
  const message = err instanceof APIError 
    ? err.message 
    : 'Failed to create task';
  setError(message);
}
```

**Components:**
- `APIError` class for API errors
- Hook error states
- Alert component for display
- User-friendly messages

## Adding New Features

### Add a New Task Filter

1. **Update type** (`src/types/index.ts`):
```typescript
export interface TaskFilterOptions {
  // ... existing fields
  newFilter?: string;
}
```

2. **Add to hook** (`src/hooks/useTasks.ts`):
```typescript
const [newFilterState, setNewFilterState] = useState<string | null>(null);

// Update filteredTasks logic
```

3. **Update component** (`src/components/task/TaskFilter.tsx`):
```typescript
<select value={newFilter} onChange={(e) => onNewFilterChange(e.target.value)}>
  {/* Options */}
</select>
```

4. **Use in HomePage**:
```typescript
const [filterNew, setFilterNew] = useState(null);
// Pass to filter component
// Update filtered tasks logic
```

### Add a New Voice Feature

1. **Update voice hook** (`src/hooks/useVoice.ts`):
```typescript
const [newVoiceState, setNewVoiceState] = useState(initial);

const newVoiceFunction = useCallback(async () => {
  // Implementation
}, []);
```

2. **Update service** (`src/services/api.ts`):
```typescript
export const voiceService = {
  newVoiceEndpoint: async () => {
    return fetchAPI('/voice/new-endpoint', { method: 'POST' });
  }
};
```

3. **Create component** (`src/components/voice/NewComponent.tsx`):
```typescript
interface Props {
  // Props interface
}

export const NewComponent: React.FC<Props> = (props) => {
  // Component logic
};
```

## Performance Considerations

1. **Memoization**: Use `useCallback` for event handlers
2. **Component Props**: Avoid re-renders with proper dependency arrays
3. **Lazy Loading**: Consider code splitting for large components
4. **Image Optimization**: Next.js Image component (future)
5. **State Updates**: Batch state updates when possible

## Testing Approach (Future)

```typescript
// Unit tests for hooks
describe('useTasks', () => {
  it('should fetch tasks', async () => {
    // Test hook
  });
});

// Component tests
describe('TaskCard', () => {
  it('should display task data', () => {
    // Test component rendering
  });
});

// Integration tests
describe('Task Creation Flow', () => {
  it('should create task from form', async () => {
    // Test full flow
  });
});
```

## Accessibility (a11y)

- Semantic HTML elements
- ARIA labels for icons
- Keyboard navigation support
- Color contrast compliance
- Focus indicators

## Browser DevTools Tips

1. **React DevTools**: Inspect component state and props
2. **Network Tab**: Monitor API calls
3. **Console**: Check for errors
4. **Application Tab**: View local storage, cookies
5. **Performance Tab**: Monitor rendering performance

---

This guide should help maintain and extend the frontend codebase effectively!
