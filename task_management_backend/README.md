# Voice-Enabled Task Tracker - Backend

A production-ready Node.js/Express backend for a voice-enabled task management application. Features intelligent speech-to-text parsing, task CRUD operations, and real-time voice input processing.

## 🎯 Features

- **Task Management**: Full CRUD operations for tasks
- **Voice Input Processing**: Intelligent NLP-based parsing of natural language task descriptions
- **Smart Date Parsing**: Handles relative dates ("tomorrow", "next Monday") and absolute dates
- **Priority Detection**: Automatically detects task priority from keywords
- **Kanban Support**: Organized tasks by status (TODO, IN_PROGRESS, DONE)
- **PostgreSQL + Prisma**: Type-safe database operations
- **Error Handling**: Comprehensive error handling with structured responses
- **Input Validation**: Zod-based request validation
- **TypeScript**: Full type safety

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Validation** | Zod |
| **Testing** | Jest |
| **Date Handling** | date-fns |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 12+ (or Docker)
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd task_management_backend
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL**
```bash
createdb task_tracker_db
```

**Option B: Docker**
```bash
docker run -d \
  --name postgres-task \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
docker exec -it postgres-task psql -U postgres -c "CREATE DATABASE task_tracker_db;"
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Update `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_tracker_db"
NODE_ENV="development"
PORT=3000
LOG_LEVEL="debug"
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

### 4. Prisma Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) View database in GUI
npm run prisma:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000/api/v1`

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   ├── env.ts             # Environment validation (Zod)
│   ├── database.ts        # Prisma client singleton
│   └── logger.ts          # Logging utility
├── middleware/            # Express middleware
│   ├── errorHandler.ts    # Global error handling
│   ├── requestLogger.ts   # Request/response logging
│   └── corsConfig.ts      # CORS configuration
├── modules/               # Feature modules
│   ├── health/            # Health check endpoints
│   ├── tasks/             # Task CRUD operations
│   │   ├── tasks.service.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.route.ts
│   │   ├── tasks.validation.ts
│   │   └── dtos/
│   └── voice/             # Voice parsing & creation
│       ├── voice.service.ts
│       ├── voice.controller.ts
│       ├── voice.route.ts
│       ├── voice.validation.ts
│       └── dtos/
├── types/                 # TypeScript type definitions
│   ├── index.ts
│   ├── task.types.ts
│   └── voice.types.ts
├── utils/                 # Utility functions
│   ├── voiceParser.ts     # NLP parsing engine
│   ├── dateParser.ts      # Date extraction
│   ├── priorityDetector.ts # Priority keywords
│   └── validators.ts      # Generic validators
├── routes/                # Route aggregation
│   └── index.ts
└── index.ts              # Server entry point
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-02T10:30:00.000Z"
}
```

### Tasks

#### Create Task (Manual)
```http
POST /tasks
Content-Type: application/json

{
  "title": "Review authentication module",
  "description": "Check edge cases and security",
  "priority": "HIGH",
  "dueDate": "2025-12-03T18:00:00Z",
  "status": "TODO"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review authentication module",
  "description": "Check edge cases and security",
  "priority": "HIGH",
  "dueDate": "2025-12-03T18:00:00Z",
  "status": "TODO",
  "rawTranscript": null,
  "createdAt": "2025-12-02T10:30:00.000Z",
  "updatedAt": "2025-12-02T10:30:00.000Z"
}
```

#### Get All Tasks
```http
GET /tasks?status=TODO&priority=HIGH&search=auth&sortBy=dueDate&sortOrder=asc
```

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Review authentication module",
      "priority": "HIGH",
      "status": "TODO",
      "dueDate": "2025-12-03T18:00:00Z",
      "createdAt": "2025-12-02T10:30:00.000Z",
      "updatedAt": "2025-12-02T10:30:00.000Z"
    }
  ]
}
```

#### Get Task by ID
```http
GET /tasks/:id
```

#### Update Task
```http
PATCH /tasks/:id
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "CRITICAL"
}
```

#### Delete Task
```http
DELETE /tasks/:id
```

**Response:** 204 No Content

### Voice Processing

#### Parse Transcript
```http
POST /voice/parse
Content-Type: application/json

{
  "transcript": "Create a high priority task to review the pull request by tomorrow evening",
  "timezone": "UTC"
}
```

**Response:**
```json
{
  "rawTranscript": "Create a high priority task to review the pull request by tomorrow evening",
  "parsed": {
    "title": "Review the pull request",
    "description": "Create a high priority task...",
    "priority": "HIGH",
    "dueDate": "2025-12-03T20:00:00.000Z",
    "status": "TODO"
  },
  "confidence": {
    "overall": 0.85,
    "title": 0.95,
    "priority": 0.90,
    "dueDate": 0.75
  },
  "parsedLogId": "660e8400-e29b-41d4-a716-446655440000"
}
```

#### Create Task from Voice
```http
POST /voice/create-task
Content-Type: application/json

{
  "transcript": "High priority task to review PR by tomorrow",
  "parsedData": {
    "title": "Review pull request",
    "priority": "HIGH",
    "dueDate": "2025-12-03T18:00:00Z",
    "status": "TODO"
  },
  "timezone": "UTC"
}
```

**Response:** Same as Create Task (201)

#### Get Parsing Log
```http
GET /voice/logs/:logId
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Test Files
- `tests/unit/voiceParser.test.ts` - Voice parsing logic
- `tests/unit/dateParser.test.ts` - Date extraction
- `tests/unit/priorityDetector.test.ts` - Priority detection

## 🛠️ Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm build

# Start production server
npm start

# Prisma commands
npm run prisma:generate     # Generate client
npm run prisma:migrate      # Run migrations
npm run prisma:studio       # Open Prisma Studio (GUI)

# Linting & Formatting
npm run lint                # ESLint check
npm run format              # Prettier formatting

# Database
npx prisma db push         # Sync schema (dev only)
npx prisma db seed         # Seed database (if configured)
```

## 🎤 Voice Parsing Strategy

### How It Works

1. **Transcript Input**: Frontend captures and sends text transcript
2. **Title Extraction**: Removes common preambles and cleans up text
3. **Priority Detection**: Searches for keywords (urgent, critical, high priority, etc.)
4. **Date Parsing**: Extracts relative dates ("tomorrow") and absolute dates
5. **Confidence Scoring**: Returns confidence for each extracted field
6. **Review Before Save**: Frontend shows parsed data for user confirmation

### Priority Keywords

- **CRITICAL**: "urgent", "critical", "ASAP", "immediately", "blocking"
- **HIGH**: "high priority", "important", "soon", "today"
- **MEDIUM**: (default if not matched)
- **LOW**: "low priority", "can wait", "whenever", "later"

### Date Patterns Supported

- Relative: "today", "tomorrow", "next Monday", "in 5 days", "in 2 weeks"
- Absolute: "15th January", "Jan 15", "January 15, 2025"
- With keywords: "by tomorrow", "due Friday", "before next week"

## 📊 Database Schema

### Task Model
```prisma
model Task {
  id               String    @id @default(uuid())
  title            String    @db.VarChar(200)
  description      String?   @db.Text
  status           TaskStatus @default(TODO)
  priority         Priority   @default(MEDIUM)
  dueDate          DateTime?
  rawTranscript    String?   @db.Text
  voiceParsingLogs VoiceParsingLog[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  @@index([status, priority])
  @@index([dueDate])
}
```

### VoiceParsingLog Model
```prisma
model VoiceParsingLog {
  id            String    @id @default(uuid())
  rawTranscript String    @db.Text
  parsedData    Json
  confidence    Float     @default(0.0)
  task          Task?     @relation(fields: [taskId], references: [id])
  taskId        String?   @db.Uuid
  createdAt     DateTime  @default(now())
  
  @@index([taskId])
  @@index([createdAt])
}
```

## 🔒 Error Handling

### Error Response Format
```json
{
  "error": "ValidationError",
  "message": "Title is required",
  "statusCode": 400,
  "details": null,
  "timestamp": "2025-12-02T10:30:00.000Z"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (delete)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## 🔐 Security Considerations

- Input validation on all endpoints (Zod)
- CORS configured and customizable
- No sensitive data in logs
- Type-safe database queries (Prisma)
- SQL injection protection via ORM

## 📈 Performance Optimization

- Database indexes on frequently queried columns
- Pagination ready (prepare for future implementation)
- Connection pooling via Prisma
- Efficient query patterns
- Response compression ready

## 🐛 Debugging

### Enable Debug Logs
```bash
LOG_LEVEL=debug npm run dev
```

### View Database
```bash
npm run prisma:studio
```

### Check Active Queries
```bash
# In another terminal
docker exec -it postgres-task psql -U postgres -d task_tracker_db -c "SELECT * FROM pg_stat_activity;"
```

## 🚢 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-db:5432/task_tracker_db
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

## 📝 Design Decisions

1. **Modular Architecture**: Each feature (tasks, voice) in separate modules for scalability
2. **Service Layer**: Business logic separated from HTTP layer
3. **Zod Validation**: Type-safe validation with automatic inference
4. **Regex-Based Parsing**: Simple, reliable, no external API dependency (scalable to LLM)
5. **Prisma ORM**: Type safety + migration support
6. **Global Error Handler**: Consistent error responses across all endpoints

## 🔄 Future Enhancements

- User authentication (JWT)
- Pagination for task lists
- Soft deletes for tasks
- Caching layer (Redis)
- WebSocket for real-time updates
- LLM-based voice parsing (OpenAI integration)
- Audit logs
- Rate limiting
- File attachments for tasks

## 📧 Support & Contribution

For issues, feature requests, or contributions, please refer to the main repository.

## 📄 License

MIT License - See LICENSE file for details
