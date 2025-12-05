# Voice-Enabled Task Tracker

A full-stack task management application that allows users to create tasks by speaking naturally. The system intelligently parses voice input to extract task details like title, priority, and due dates.

## Project Setup

### Prerequisites

**Frontend:**
- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser with Web Speech API support (Chrome, Edge, or Safari recommended)

**Backend:**
- Node.js 18 or higher
- PostgreSQL database (version 12 or higher)
- npm or yarn package manager

**Note:** You need an OpenAI API key for backend parsing. Voice recognition uses the browser's native Web Speech API for speech-to-text in the frontend; the resulting transcript is sent to the backend for LLM-based parsing.

### Installation Steps

**Backend Setup:**

1. Navigate to the backend directory:
```bash
cd task_management_backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your database connection:
```
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
PORT=3000
NODE_ENV=development
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

**Frontend Setup:**

1. Navigate to the frontend directory:
```bash
cd task_management_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with the backend API URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3001` (or 3000 if backend is on a different port)

### Email Configuration

Email sending and receiving functionality is not implemented in this project. The assignment scope focused on core task management and voice input features. Email notifications would be a future enhancement.

### Running Everything Locally

1. Start PostgreSQL database (if not already running):
```bash
# On macOS with Homebrew
brew services start postgresql

# On Linux
sudo systemctl start postgresql

# Or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

2. Start the backend server (in one terminal):
```bash
cd task_management_backend
npm run dev
```

3. Start the frontend server (in another terminal):
```bash
cd task_management_frontend
npm run dev
```

4. Open your browser and navigate to `http://localhost:3001` (or the port shown in the terminal)

### Seed Data and Initial Scripts

No seed data or initial scripts are provided. The application starts with an empty database. You can create tasks manually or using voice input to populate the database.

## Tech Stack

### Frontend
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4
- **Voice Recognition:** Web Speech API (browser native)
- **HTTP Client:** Fetch API (native)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod + Express Validator
- **Error Handling:** Custom error classes with middleware
- **Logging:** Winston or Pino

### Database
- **Type:** PostgreSQL
- **ORM:** Prisma for database access and migrations
- **Schema:** Tasks table with fields for title, description, status, priority, due date, and raw transcript

### AI Provider
- Frontend: Web Speech API converts audio to text locally.
- Backend: LangChain `createAgent` with OpenAI plus date/priority tools parses transcripts into `title`, `description`, `priority`, and `dueDate`.

### Email Solution
Email functionality is not implemented in this version. This was out of scope for the assignment requirements.

### Key Libraries

**Frontend:**
- next: 16.0.6
- react: 19.2.0
- react-dom: 19.2.0
- tailwindcss: ^4
- typescript: ^5

**Backend:**
- express: Web framework
- prisma: Database ORM
- zod: Runtime type validation
- winston/pino: Logging

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Main Endpoints

#### Health Check

**GET /health**

Check if the server and database are healthy.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

#### Task Management

**POST /tasks**

Create a new task manually.

**Request Body:**
```json
{
  "title": "Review authentication module",
  "description": "Check edge cases and security vulnerabilities",
  "priority": "HIGH",
  "dueDate": "2025-12-04T18:00:00Z",
  "status": "TODO"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review authentication module",
  "description": "Check edge cases and security vulnerabilities",
  "priority": "HIGH",
  "dueDate": "2025-12-04T18:00:00Z",
  "status": "TODO",
  "rawTranscript": null,
  "createdAt": "2025-12-03T10:30:45.123Z",
  "updatedAt": "2025-12-03T10:30:45.123Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Title is required",
  "statusCode": 400,
  "details": null,
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

**GET /tasks**

Retrieve all tasks with optional filtering.

**Query Parameters:**
- `status`: Filter by status (TODO, IN_PROGRESS, DONE)
- `priority`: Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)
- `search`: Search in title or description
- `sortBy`: Sort by dueDate, createdAt, or priority
- `sortOrder`: asc or desc
- `page`: Page number for pagination
- `limit`: Items per page

**Example Request:**
```
GET /tasks?status=TODO&priority=HIGH&search=auth
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Review authentication module",
      "description": "Check edge cases",
      "priority": "HIGH",
      "dueDate": "2025-12-04T18:00:00Z",
      "status": "TODO",
      "createdAt": "2025-12-03T10:30:45.123Z",
      "updatedAt": "2025-12-03T10:30:45.123Z"
    }
  ]
}
```

**GET /tasks/:id**

Get a specific task by ID.

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review authentication module",
  "description": "Check edge cases",
  "priority": "HIGH",
  "dueDate": "2025-12-04T18:00:00Z",
  "status": "TODO",
  "createdAt": "2025-12-03T10:30:45.123Z",
  "updatedAt": "2025-12-03T10:30:45.123Z"
}
```

**PATCH /tasks/:id**

Update one or more fields of an existing task.

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "priority": "CRITICAL"
}
```

**Response (200 OK):**
Returns the updated task object.

**DELETE /tasks/:id**

Delete a task by ID.

**Response (204 No Content):**
Empty response body.

#### Voice Parsing

**POST /voice/parse**

Parse a natural language transcript to extract task details.

**Request Body:**
```json
{
  "transcript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
  "timezone": "UTC"
}
```

**Response (200 OK):**
```json
{
  "rawTranscript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
  "parsed": {
    "title": "Review the pull request for the authentication module",
    "description": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
    "priority": "HIGH",
    "dueDate": "2025-12-04T20:00:00.000Z",
    "status": "TODO"
  },
  "confidence": {
    "overall": 0.85,
    "title": 0.95,
    "priority": 0.90,
    "dueDate": 0.75
  },
  "parsedLogId": "770e8400-e29b-41d4-a716-446655440002"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Invalid request",
  "statusCode": 400,
  "details": {
    "transcript": ["String must contain at least 10 character(s)"]
  },
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

**POST /voice/create-task**

Create a task directly from voice input (combines parsing and creation).

**Request Body:**
```json
{
  "transcript": "Remind me to send the project proposal to the client by next Wednesday, it's high priority",
  "parsedData": {
    "title": "Send the project proposal to the client",
    "description": "Send project proposal",
    "priority": "HIGH",
    "dueDate": "2025-12-10T09:00:00Z",
    "status": "TODO"
  },
  "timezone": "UTC"
}
```

**Response (201 Created):**
Returns the created task object with all fields populated.

## Decisions & Assumptions

### Key Design Decisions

**Voice Parsing Approach:**
Client STT (Web Speech API). Backend LangChain `createAgent` (OpenAI + date/priority tools) extracts structured fields. Only transcripts are sent; no audio.

**Database Schema:**
Tasks are stored with all fields including an optional `rawTranscript` field to preserve the original voice input. This allows for debugging parsing issues and provides transparency to users. A separate `VoiceParsingLog` table stores parsing attempts with confidence scores for analytics.

**Frontend Architecture:**
The frontend uses a modular component structure with custom hooks for business logic. I avoided Redux in favor of React hooks and context to keep the codebase simpler and more maintainable for a single-user application.

**Voice Recognition:**
Client-only STT; no audio streaming. Lower bandwidth and simpler infra. Chrome/Edge/Safari supported; Firefox limited.

**State Management:**
State is managed locally using React hooks and custom hooks. No global state management library was used since the application is single-user and doesn't require complex state synchronization.

### Assumptions
- Email: out of scope.
- Auth: single-user; no auth/multi-user.
- Browser: Chrome/Edge/Safari for Web Speech API; Firefox limited.
- Parsing: LLM + tools normalize dates/priorities; ambiguous phrasing may fallback to defaults.
- Transcript length: >=10 chars for usable context.
- Timezone: defaults to UTC unless provided.

**Why no frontend LLM or direct audio streaming:**
- In-browser LLMs are too heavy for perf/size; backend parsing is lighter to evolve.
- Audio streaming increases bandwidth and media handling; transcripts are small and stateless.
- Hosted STT (Whisper/OpenAI) per request adds cost/latency; Web Speech API is free and on-device.

## AI Tools Usage
- Copilot: boilerplate React/TypeScript and API helpers.
- Cursor: completions/refactors; TypeScript typings.
- ChatGPT/Claude: LangChain agent prompt/tool design, component structure, parsing/debugging.

### What Changed
- Moved from regex-only parsing to OpenAI-backed LangChain agent with date/priority tools.
- Tuned prompts/tools for better defaults and clearer edge-case handling.
