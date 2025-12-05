/**
 * API Configuration and Client
 * Handles all HTTP communication with backend
 */

import { APIResponse, PaginatedResponse, Task, TaskFilterOptions, CreateTaskDTO, UpdateTaskDTO, VoiceParseResponse, CreateTaskFromVoiceDTO, HealthCheckResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Error handling class for API errors
 */
class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.message || 'An error occurred',
        data.details
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, error instanceof Error ? error.message : 'Network error');
  }
}

/**
 * Task API Service
 */
export const taskService = {
  /**
   * Create a new task
   */
  createTask: async (taskData: CreateTaskDTO): Promise<Task> => {
    return fetchAPI<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Get all tasks with optional filters
   */
  getAllTasks: async (filters?: TaskFilterOptions): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    return fetchAPI<PaginatedResponse<Task>>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get task by ID
   */
  getTaskById: async (id: string): Promise<Task> => {
    return fetchAPI<Task>(`/tasks/${id}`);
  },

  /**
   * Update a task
   */
  updateTask: async (id: string, taskData: UpdateTaskDTO): Promise<Task> => {
    return fetchAPI<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    await fetchAPI<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Voice API Service
 */
export const voiceService = {
  /**
   * Parse voice transcript to extract task details
   */
  parseTranscript: async (transcript: string, timezone?: string): Promise<VoiceParseResponse> => {
    return fetchAPI<VoiceParseResponse>('/voice/parse', {
      method: 'POST',
      body: JSON.stringify({ transcript, timezone }),
    });
  },

  /**
   * Create task directly from voice
   */
  createTaskFromVoice: async (data: CreateTaskFromVoiceDTO): Promise<Task> => {
    return fetchAPI<Task>('/voice/create-task', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get voice parsing log
   */
  getParsingLog: async (logId: string): Promise<any> => {
    return fetchAPI<any>(`/voice/logs/${logId}`);
  },
};

/**
 * Health Check Service
 */
export const healthService = {
  /**
   * Check health status of backend
   */
  checkHealth: async (): Promise<HealthCheckResponse> => {
    return fetchAPI<HealthCheckResponse>('/health');
  },
};

/**
 * Export API error for usage in components
 */
export { APIError };
