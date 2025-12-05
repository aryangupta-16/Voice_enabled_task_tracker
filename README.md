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

**Note:** This project does not require any external API keys. Voice recognition uses the browser's native Web Speech API, and voice parsing is handled by a custom regex-based parser on the backend.

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
The application uses a custom-built natural language processing utility that relies on regex patterns and keyword matching rather than external AI services. This approach was chosen for:
- No external API dependencies or costs
- Predictable parsing behavior
- Full control over parsing logic
- Fast response times

The parser extracts task details by:
- Matching priority keywords (urgent, critical, high priority, etc.)
- Parsing date patterns (relative like "tomorrow" or absolute like "Jan 15")
- Identifying task titles from natural language structure

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
I chose to implement a custom regex-based parser instead of using an external LLM service like OpenAI. This decision was made because:
- No external API dependencies means no API keys needed and no costs
- Predictable behavior makes testing easier
- Faster response times without network calls
- Full control over parsing logic allows for easy customization

The parser uses pattern matching for:
- Priority detection through keyword matching (urgent, critical, high priority, etc.)
- Date parsing using regex patterns for both relative ("tomorrow", "next Monday") and absolute ("Jan 15", "2025-01-15") dates
- Title extraction by identifying the main task description in natural language

**Database Schema:**
Tasks are stored with all fields including an optional `rawTranscript` field to preserve the original voice input. This allows for debugging parsing issues and provides transparency to users. A separate `VoiceParsingLog` table stores parsing attempts with confidence scores for analytics.

**Frontend Architecture:**
The frontend uses a modular component structure with custom hooks for business logic. I avoided Redux in favor of React hooks and context to keep the codebase simpler and more maintainable for a single-user application.

**Voice Recognition:**
The application uses the browser's native Web Speech API rather than a third-party service. This eliminates the need for API keys and works offline in supported browsers. The trade-off is browser compatibility, but Chrome, Edge, and Safari all support it well.

**State Management:**
State is managed locally using React hooks and custom hooks. No global state management library was used since the application is single-user and doesn't require complex state synchronization.

### Assumptions

**Email Functionality:**
I assumed email sending and receiving was out of scope for this assignment. The requirements focused on task management and voice input, so email notifications were not implemented.

**User Authentication:**
The application is designed as a single-user system. No authentication or multi-user support was implemented, as this was explicitly listed as out of scope.

**Browser Support:**
I assumed users would use modern browsers (Chrome, Edge, or Safari) for voice input functionality. Firefox has limited Web Speech API support, and Internet Explorer is not supported.

**Date Parsing:**
The parser assumes users will speak dates in common formats. Complex date expressions or ambiguous references might not parse correctly. The system defaults to sensible values when parsing fails.

**Priority Detection:**
Priority is detected through keyword matching. If no priority keywords are found, the system defaults to MEDIUM priority. This assumes users will explicitly mention priority when it matters.

**Voice Input Length:**
The system assumes voice transcripts will be at least 10 characters long. Very short inputs might not provide enough context for meaningful parsing.

**Timezone Handling:**
Dates are parsed in UTC by default unless a timezone is specified. This assumes the backend and frontend can coordinate timezone handling appropriately.

## AI Tools Usage

### Tools Used

I used several AI tools during development:

**GitHub Copilot:**
Used extensively for boilerplate code generation, especially for React components and TypeScript interfaces. Copilot helped speed up initial component structure and common patterns like form handling and API calls.

**Cursor IDE:**
The intelligent code completion and refactoring suggestions in Cursor were helpful for maintaining consistent code style and catching potential issues early. It also assisted with TypeScript type definitions and error handling patterns.

**Claude/ChatGPT:**
Used for architectural decisions and problem-solving when stuck on specific implementation challenges. These tools helped with:
- Designing the voice parsing algorithm
- Structuring the component hierarchy
- Planning the database schema
- Debugging complex date parsing logic

### What They Helped With

**Boilerplate Generation:**
Copilot was particularly useful for generating repetitive code like API service functions, TypeScript interfaces, and React component structures. This saved significant time on initial setup.

**Debugging:**
When encountering issues with date parsing or voice recognition, I used ChatGPT to brainstorm solutions and understand edge cases I might have missed.

**Design Decisions:**
Claude helped me think through the trade-offs between using an LLM for parsing versus building a custom parser. The discussion helped clarify that a regex-based approach would be sufficient for the assignment scope.

**Code Review:**
I used AI tools to review my code structure and suggest improvements for modularity and maintainability. This helped ensure the codebase followed best practices.

### Notable Prompts and Approaches

**Voice Parsing Algorithm:**
I asked ChatGPT to help design a regex-based parser that could handle various date formats and priority keywords. The conversation helped me identify patterns I might have missed, like handling "by Friday" versus "before Friday".

**Component Architecture:**
I used Claude to discuss the best way to structure React components for the task management features. This led to the decision to separate UI components from business logic using custom hooks.

**Error Handling:**
I prompted Copilot to generate consistent error handling patterns across the codebase, ensuring all API calls had proper error handling and user feedback.

### What I Learned and Changed

**Initial Approach:**
I initially considered using OpenAI's API for voice parsing, thinking it would provide better accuracy. However, after discussing with AI tools and considering the requirements, I realized a custom parser would be more appropriate.

**Date Parsing:**
Early versions of the date parser were too strict. Through testing and AI-assisted debugging, I learned to handle more edge cases and provide better fallbacks when parsing fails.

**Component Structure:**
Initially, I had business logic mixed with UI components. AI tools helped me refactor to a cleaner separation using custom hooks, making the code more testable and maintainable.

**Type Safety:**
Working with TypeScript and AI tools helped me understand the importance of strict typing. The tools suggested better type definitions that caught bugs early in development.

**User Experience:**
AI tools helped me think through the user flow, especially around voice input. The suggestion to show a loading state while parsing and allow users to review parsed data before saving significantly improved the user experience.

Overall, AI tools were most valuable for speeding up development, catching potential issues early, and helping me think through architectural decisions. They didn't replace critical thinking but acted as helpful assistants throughout the development process.
