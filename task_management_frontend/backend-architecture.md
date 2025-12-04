# Voice-Enabled Task Tracker - Backend Architecture

## 1. Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod + Express Validator
- **Error Handling**: Custom error classes + middleware
- **Logging**: Winston or Pino
- **Voice Parsing**: Custom NLP utility using regex/pattern matching or LLM integration
- **Environment**: dotenv
- **Testing**: Jest (optional, for production)

## 2. Database Schema Design

### Core Models

#### Task
```
- id (UUID, PK)
- title (String, required)
- description (String, optional)
- status (Enum: TODO, IN_PROGRESS, DONE)
- priority (Enum: LOW, MEDIUM, HIGH, CRITICAL)
- dueDate (DateTime, optional)
- rawTranscript (String, optional) - original voice input
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### VoiceParsingLog (optional, for analytics/debugging)
```
- id (UUID, PK)
- rawTranscript (String)
- parsedData (JSON)
- confidence (Float) - parsing confidence score
- taskId (UUID, FK)
- createdAt (DateTime)
```

### Relationships
- One Task can have one VoiceParsingLog entry (optional)

---

## 3. Folder Structure

```
task_management_backend/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── index.ts                    # Entry point
│   ├── config/
│   │   ├── env.ts                  # Environment validation
│   │   ├── database.ts             # Database connection
│   │   └── logger.ts               # Logger configuration
│   ├── middleware/
│   │   ├── errorHandler.ts         # Global error handling
│   │   ├── requestValidator.ts     # Request validation
│   │   ├── requestLogger.ts        # Request/response logging
│   │   └── corsConfig.ts           # CORS configuration
│   ├── modules/
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.route.ts
│   │   │   ├── tasks.validation.ts
│   │   │   └── dtos/
│   │   │       ├── createTaskDto.ts
│   │   │       ├── updateTaskDto.ts
│   │   │       └── taskResponseDto.ts
│   │   ├── voice/
│   │   │   ├── voice.controller.ts
│   │   │   ├── voice.service.ts
│   │   │   ├── voice.route.ts
│   │   │   ├── voice.validation.ts
│   │   │   └── dtos/
│   │   │       ├── voiceParseDto.ts
│   │   │       └── voiceParseResponseDto.ts
│   │   └── health/
│   │       ├── health.controller.ts
│   │       └── health.route.ts
│   ├── utils/
│   │   ├── voiceParser.ts          # NLP logic for parsing voice
│   │   ├── dateParser.ts           # Date parsing utilities
│   │   ├── priorityDetector.ts     # Priority keyword detection
│   │   ├── validators.ts           # Custom validators
│   │   └── errors.ts               # Custom error classes
│   ├── types/
│   │   ├── index.ts                # Global type definitions
│   │   ├── task.types.ts           # Task-related types
│   │   └── voice.types.ts          # Voice-related types
│   └── routes/
│       └── index.ts                # Central route aggregator
├── tests/
│   ├── unit/
│   │   ├── voiceParser.test.ts
│   │   ├── dateParser.test.ts
│   │   └── priorityDetector.test.ts
│   └── integration/
│       ├── tasks.test.ts
│       └── voice.test.ts
└── README.md
```

---

## 4. API Endpoints Design

### Task Management Endpoints

#### Create Task (Manual)
```
POST /api/v1/tasks
Request Body:
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "enum: LOW | MEDIUM | HIGH | CRITICAL (default: MEDIUM)",
  "dueDate": "ISO 8601 datetime (optional)",
  "status": "enum: TODO | IN_PROGRESS | DONE (default: TODO)"
}

Response (201):
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "priority": "enum",
  "dueDate": "ISO datetime",
  "status": "enum",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}

Error (400):
{
  "error": "Bad Request",
  "message": "Validation error details",
  "details": [...validation errors]
}
```

#### Get All Tasks
```
GET /api/v1/tasks?status=TODO&priority=HIGH&search=keyword&sortBy=dueDate&sortOrder=asc
Response (200):
{
  "data": [...tasks],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "hasMore": false
  }
}
```

#### Get Task by ID
```
GET /api/v1/tasks/:id
Response (200): {...task}
Error (404): {error: "Task not found"}
```

#### Update Task
```
PATCH /api/v1/tasks/:id
Request Body: { ...fields to update }
Response (200): {...updated task}
```

#### Delete Task
```
DELETE /api/v1/tasks/:id
Response (204): No content
```

#### Get Tasks by Status (Kanban view)
```
GET /api/v1/tasks/kanban
Response (200):
{
  "todo": [...tasks],
  "inProgress": [...tasks],
  "done": [...tasks]
}
```

### Voice Parsing Endpoints

#### Parse Voice Input
```
POST /api/v1/voice/parse
Request Body:
{
  "transcript": "string (required)",
  "timezone": "string (optional, default: UTC)"
}

Response (200):
{
  "rawTranscript": "string",
  "parsed": {
    "title": "string",
    "description": "string (optional)",
    "priority": "enum",
    "dueDate": "ISO datetime (optional)",
    "status": "enum"
  },
  "confidence": {
    "overall": 0.85,
    "title": 0.95,
    "priority": 0.80,
    "dueDate": 0.75
  },
  "parsedLogId": "uuid"
}

Error (400):
{
  "error": "Failed to parse transcript",
  "message": "Transcript too short or unclear"
}
```

#### Create Task from Voice
```
POST /api/v1/voice/create-task
Request Body:
{
  "transcript": "string",
  "parsedData": {
    "title": "string",
    "description": "string (optional)",
    "priority": "enum",
    "dueDate": "ISO datetime (optional)",
    "status": "enum"
  },
  "timezone": "string (optional)"
}

Response (201):
{
  ...task,
  "voiceParseLogId": "uuid"
}
```

### Health Check
```
GET /api/v1/health
Response (200):
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "ISO datetime"
}
```

---

## 5. Voice Parsing Strategy

### Overview
Parse natural language to extract:
1. **Title**: Main task description
2. **Priority**: Keywords like "urgent", "high priority", "critical"
3. **Due Date**: Relative ("tomorrow", "next Monday") or absolute ("15th Jan")
4. **Status**: Default to "TODO" unless explicitly mentioned

### Priority Detection Keywords
```
CRITICAL: "urgent", "critical", "ASAP", "immediately", "blocking"
HIGH: "high priority", "important", "soon", "today"
MEDIUM: "medium", "normal", (default if not specified)
LOW: "low priority", "can wait", "whenever", "later"
```

### Date Parsing Patterns
```
Relative:
- "today", "tomorrow"
- "next Monday", "next week"
- "in X days", "in X weeks"
- "by Friday"

Absolute:
- "15th January", "Jan 15"
- "2025-01-15"
- "January 15th"
```

### Parsing Engine Approach
1. **Option A (Simple - Regex + Pattern Matching)**:
   - Use regex patterns for date matching
   - Keyword matching for priority
   - NLP library like `natural` for basic NLP

2. **Option B (Advanced - LLM Integration)**:
   - Use OpenAI API or similar for intelligent parsing
   - Send structured prompt to extract fields
   - Higher accuracy but adds API dependency

**Recommendation**: Start with Option A (in-house parsing) for reliability and cost. Can evolve to Option B for better accuracy.

---

## 6. Error Handling Strategy

### Custom Error Classes
```
- ValidationError: 400
- NotFoundError: 404
- ConflictError: 409
- InternalServerError: 500
- UnauthorizedError: 401 (future)
```

### Error Response Format
```
{
  "error": "ErrorType",
  "message": "Human-readable message",
  "statusCode": 400,
  "timestamp": "ISO datetime",
  "traceId": "uuid (for debugging)"
}
```

---

## 7. Validation & Security

### Input Validation
- Title: Required, 1-200 characters
- Description: Optional, max 2000 characters
- Due Date: Must be future date if provided
- Priority: Only allowed enum values
- Status: Only allowed enum values
- Transcript: Required, min 10 characters

### Sanitization
- Trim all string inputs
- Escape special characters
- Validate enum values strictly

---

## 8. Database Indexing

```sql
-- Indexes for performance
- tasks(status, priority) - for filtering
- tasks(dueDate) - for sorting/filtering by date
- tasks(createdAt) - for chronological queries
- voiceParsingLog(taskId) - for lookups
- voiceParsingLog(createdAt) - for log cleanup
```

---

## 9. Service Layer Architecture

### TaskService
- createTask()
- getTaskById()
- getAllTasks()
- updateTask()
- deleteTask()
- getTasksByStatus()
- filterTasks()

### VoiceService
- parseTranscript()
- createTaskFromVoice()
- getParsingLog()

### Benefits
- Business logic separated from HTTP layer
- Easier to test
- Reusable across multiple routes/controllers

---

## 10. Future Considerations

1. **Pagination**: Implement offset/limit pagination
2. **Sorting**: By priority, due date, created date
3. **Caching**: Redis for frequently accessed data
4. **Audit Logs**: Track all changes for compliance
5. **Rate Limiting**: Prevent abuse
6. **Authentication**: JWT-based (out of scope for now)
7. **Soft Deletes**: Mark as deleted instead of removing
8. **WebSockets**: Real-time updates (future)

---

## 11. Development Workflow

1. Setup PostgreSQL + Prisma migrations
2. Create DTOs and type definitions
3. Implement service layer first
4. Build controllers and routes
5. Add comprehensive error handling
6. Write unit tests for parsing logic
7. Write integration tests for APIs
8. Document all endpoints

---

## 12. Code Quality Standards

✅ **Must Have**:
- TypeScript strict mode
- Consistent naming conventions (camelCase for vars/functions, PascalCase for classes/types)
- JSDoc comments for public methods
- Error handling on all endpoints
- Input validation before processing
- Modular services
- Dependency injection where applicable

✅ **Should Have**:
- Unit tests for utils (dateParser, priorityDetector, voiceParser)
- Integration tests for API endpoints
- Logging for debugging
- .env.example with all required variables

✅ **Nice to Have**:
- Pre-commit hooks (Husky)
- Code linting (ESLint)
- Code formatting (Prettier)
- Performance monitoring

---

## Summary

This architecture prioritizes:
1. **Modularity**: Each concern (tasks, voice, health) in separate modules
2. **Separation of Concerns**: Controllers → Services → Repositories
3. **Type Safety**: Full TypeScript with strict types
4. **Error Handling**: Comprehensive error middleware
5. **Scalability**: Service-based architecture allows easy extension
6. **Testability**: Isolated services and utilities
7. **Maintainability**: Clear folder structure and conventions
