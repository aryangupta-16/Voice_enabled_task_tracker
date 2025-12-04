# API Endpoints Documentation

## Base URL
```
http://localhost:3000/api/v1
```

---

## Health Check

### GET /health

**Description**: Check if the server and database are healthy.

**Request**:
```http
GET /api/v1/health HTTP/1.1
Host: localhost:3000
```

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

**Error (500)**:
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

## Tasks Module

### 1. CREATE TASK (Manual)

#### POST /tasks

**Description**: Create a new task with manual input.

**Request**:
```http
POST /api/v1/tasks HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "Review authentication module",
  "description": "Check edge cases and security vulnerabilities",
  "priority": "HIGH",
  "dueDate": "2025-12-04T18:00:00Z",
  "status": "TODO"
}
```

**Request Body Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | Task title (1-200 chars) |
| description | string | ❌ | Task description (max 2000 chars) |
| priority | string | ❌ | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` (default: MEDIUM) |
| dueDate | string (ISO 8601) | ❌ | Due date and time |
| status | string | ❌ | `TODO`, `IN_PROGRESS`, `DONE` (default: TODO) |

**Response (201 Created)**:
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

**Error (400 Bad Request)**:
```json
{
  "error": "Bad Request",
  "message": "Title is required",
  "statusCode": 400,
  "details": null,
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

### 2. GET ALL TASKS

#### GET /tasks

**Description**: Retrieve all tasks with optional filtering and sorting.

**Request**:
```http
GET /api/v1/tasks?status=TODO&priority=HIGH&search=auth&sortBy=dueDate&sortOrder=asc HTTP/1.1
Host: localhost:3000
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status: `TODO`, `IN_PROGRESS`, `DONE` |
| priority | string | Filter by priority: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| search | string | Search in title or description (case-insensitive) |
| sortBy | string | Sort by: `dueDate`, `createdAt`, `priority` |
| sortOrder | string | Sort order: `asc`, `desc` |
| page | number | Page number for pagination (default: 1) |
| limit | number | Items per page (default: 10, max: 100) |

**Response (200 OK)**:
```json
{
  "data": [
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
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Write unit tests",
      "description": null,
      "priority": "MEDIUM",
      "dueDate": "2025-12-05T09:00:00Z",
      "status": "IN_PROGRESS",
      "rawTranscript": null,
      "createdAt": "2025-12-03T09:15:30.123Z",
      "updatedAt": "2025-12-03T09:15:30.123Z"
    }
  ]
}
```

---

### 3. GET TASK BY ID

#### GET /tasks/:id

**Description**: Retrieve a specific task by its ID.

**Request**:
```http
GET /api/v1/tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:3000
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | Task ID |

**Response (200 OK)**:
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

**Error (404 Not Found)**:
```json
{
  "error": "Not Found",
  "message": "Task not found",
  "statusCode": 404,
  "details": null,
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

### 4. UPDATE TASK

#### PATCH /tasks/:id

**Description**: Update one or more fields of an existing task.

**Request**:
```http
PATCH /api/v1/tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "description": "Updated description"
}
```

**Request Body Parameters** (all optional):
| Field | Type | Description |
|-------|------|-------------|
| title | string | New title (1-200 chars) |
| description | string | New description (max 2000 chars) |
| priority | string | New priority: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| dueDate | string (ISO 8601) | New due date |
| status | string | New status: `TODO`, `IN_PROGRESS`, `DONE` |

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review authentication module",
  "description": "Updated description",
  "priority": "CRITICAL",
  "dueDate": "2025-12-04T18:00:00Z",
  "status": "IN_PROGRESS",
  "rawTranscript": null,
  "createdAt": "2025-12-03T10:30:45.123Z",
  "updatedAt": "2025-12-03T11:45:20.456Z"
}
```

---

### 5. DELETE TASK

#### DELETE /tasks/:id

**Description**: Delete a task by ID.

**Request**:
```http
DELETE /api/v1/tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:3000
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | Task ID to delete |

**Response (204 No Content)**:
```
(empty body)
```

**Error (404 Not Found)**:
```json
{
  "error": "Not Found",
  "message": "Task not found",
  "statusCode": 404,
  "details": null,
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

## Voice Module

### 1. PARSE VOICE TRANSCRIPT

#### POST /voice/parse

**Description**: Parse a natural language transcript to extract task details (title, priority, due date, etc.).

**Request**:
```http
POST /api/v1/voice/parse HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "transcript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
  "timezone": "UTC"
}
```

**Request Body Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transcript | string | ✅ | Natural language task description (min 10 chars) |
| timezone | string | ❌ | Timezone for date parsing (default: UTC) |

**Response (200 OK)**:
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

**Error (400 Bad Request)**:
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

**Response Fields**:
- **rawTranscript**: Original input text
- **parsed**: Extracted task data
  - **title**: Extracted task title
  - **description**: Optional description
  - **priority**: Detected priority level
  - **dueDate**: Parsed due date (null if not found)
  - **status**: Default status (always "TODO")
- **confidence**: Confidence scores (0-1 scale)
  - **overall**: Average confidence across all fields
  - **title**: How confident the parser is about the title extraction
  - **priority**: How confident about priority detection
  - **dueDate**: How confident about date parsing
- **parsedLogId**: ID of the parsing log for later reference

---

### 2. CREATE TASK FROM VOICE

#### POST /voice/create-task

**Description**: Parse voice transcript and immediately create a task (no review step).

**Request**:
```http
POST /api/v1/voice/create-task HTTP/1.1
Host: localhost:3000
Content-Type: application/json

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

**Request Body Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transcript | string | ✅ | Original transcript (min 10 chars) |
| parsedData | object | ✅ | Pre-parsed task data |
| parsedData.title | string | ✅ | Task title (1-200 chars) |
| parsedData.description | string | ❌ | Task description (max 2000 chars) |
| parsedData.priority | string | ✅ | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| parsedData.dueDate | string (ISO 8601) | ❌ | Due date |
| parsedData.status | string | ✅ | `TODO`, `IN_PROGRESS`, `DONE` |
| timezone | string | ❌ | Timezone for date parsing |

**Response (201 Created)**:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "title": "Send the project proposal to the client",
  "description": "Send project proposal",
  "priority": "HIGH",
  "dueDate": "2025-12-10T09:00:00Z",
  "status": "TODO",
  "rawTranscript": "Remind me to send the project proposal to the client by next Wednesday, it's high priority",
  "createdAt": "2025-12-03T10:30:45.123Z",
  "updatedAt": "2025-12-03T10:30:45.123Z"
}
```

**Error (400 Bad Request)**:
```json
{
  "error": "Bad Request",
  "message": "Invalid request",
  "statusCode": 400,
  "details": {
    "transcript": ["String must contain at least 10 character(s)"],
    "parsedData": {
      "title": ["String must contain at least 1 character(s)"],
      "priority": ["Invalid enum value. Expected 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'"]
    }
  },
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

### 3. GET PARSING LOG

#### GET /voice/logs/:logId

**Description**: Retrieve a voice parsing log for debugging or audit purposes.

**Request**:
```http
GET /api/v1/voice/logs/770e8400-e29b-41d4-a716-446655440002 HTTP/1.1
Host: localhost:3000
```

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| logId | string (UUID) | Parsing log ID |

**Response (200 OK)**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "rawTranscript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
  "parsedData": {
    "title": "Review the pull request for the authentication module",
    "description": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
    "priority": "HIGH",
    "dueDate": "2025-12-04T20:00:00.000Z",
    "status": "TODO"
  },
  "confidence": 0.85,
  "taskId": "550e8400-e29b-41d4-a716-446655440000",
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Review the pull request for the authentication module",
    "description": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
    "priority": "HIGH",
    "dueDate": "2025-12-04T20:00:00.000Z",
    "status": "TODO",
    "rawTranscript": "Create a high priority task to review the pull request for the authentication module by tomorrow evening",
    "createdAt": "2025-12-03T10:30:45.123Z",
    "updatedAt": "2025-12-03T10:30:45.123Z"
  },
  "createdAt": "2025-12-03T10:30:45.123Z",
  "updatedAt": "2025-12-03T10:30:45.123Z"
}
```

**Error (404 Not Found)**:
```json
{
  "error": "Not Found",
  "message": "Parsing log not found",
  "statusCode": 404,
  "details": null,
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

## cURL Examples

### Create a task (manual)
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review PR",
    "priority": "HIGH",
    "dueDate": "2025-12-04T18:00:00Z"
  }'
```

### Get all tasks with filters
```bash
curl "http://localhost:3000/api/v1/tasks?status=TODO&priority=HIGH&search=auth"
```

### Parse voice transcript
```bash
curl -X POST http://localhost:3000/api/v1/voice/parse \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Create a high priority task to review authentication by tomorrow"
  }'
```

### Create task from voice
```bash
curl -X POST http://localhost:3000/api/v1/voice/create-task \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "High priority task to review PR by tomorrow",
    "parsedData": {
      "title": "Review PR",
      "priority": "HIGH",
      "dueDate": "2025-12-04T18:00:00Z",
      "status": "TODO"
    }
  }'
```

### Update task
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "priority": "CRITICAL"
  }'
```

### Delete task
```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/550e8400-e29b-41d4-a716-446655440000
```

### Health check
```bash
curl http://localhost:3000/api/v1/health
```

---

## Error Handling

### Common Status Codes
| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful (delete) |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

### Error Response Format
```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "statusCode": 400,
  "details": null,
  "timestamp": "2025-12-03T10:30:45.123Z"
}
```

---

## Enum Values Reference

### Task Status
- `TODO` - Task not started
- `IN_PROGRESS` - Task currently being worked on
- `DONE` - Task completed

### Priority Levels
- `LOW` - Can be done anytime
- `MEDIUM` - Normal priority (default)
- `HIGH` - Should be done soon
- `CRITICAL` - Urgent, needs immediate attention

### Priority Detection Keywords
| Priority | Keywords |
|----------|----------|
| CRITICAL | urgent, critical, ASAP, immediately, blocking, emergency |
| HIGH | high priority, important, soon, today, this week |
| MEDIUM | medium, normal, standard |
| LOW | low priority, can wait, whenever, later, someday, backlog |

### Date Patterns Supported
- **Relative**: today, tomorrow, next Monday, in 5 days, in 2 weeks
- **Absolute**: 15th January, Jan 15, January 15 2025, 2025-01-15
- **With Keywords**: by tomorrow, due Friday, before next week
