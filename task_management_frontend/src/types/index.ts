/**
 * Global Type Definitions
 * Core types and interfaces for the task management application
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Task Interface - Main task entity
 */
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string | null;
  status: TaskStatus;
  rawTranscript?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Task DTO
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  status?: TaskStatus;
}

/**
 * Update Task DTO
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  status?: TaskStatus;
}

/**
 * Voice Parsing Response
 */
export interface VoiceParsedData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
  status: TaskStatus;
}

export interface VoiceParseResponse {
  rawTranscript: string;
  parsed: VoiceParsedData;
  parsedLogId: string;
}

/**
 * Create Task from Voice DTO
 */
export interface CreateTaskFromVoiceDTO {
  transcript: string;
  parsedData: VoiceParsedData;
  timezone?: string;
}

/**
 * API Response types
 */
export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

/**
 * Filter Options for Tasks
 */
export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Kanban Board Structure
 */
export interface KanbanBoard {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

/**
 * Voice Recording State
 */
export interface VoiceRecordingState {
  isRecording: boolean;
  transcript: string;
  error: string | null;
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: string;
  database: string;
  timestamp: string;
}
