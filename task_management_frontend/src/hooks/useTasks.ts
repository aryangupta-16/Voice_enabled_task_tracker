/**
 * Custom Hooks for Task Management
 * Manages state for tasks with caching and error handling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilterOptions, CreateTaskDTO, UpdateTaskDTO } from '@/types';
import { taskService, APIError } from '@/services/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilterOptions) => Promise<void>;
  createTask: (taskData: CreateTaskDTO) => Promise<Task | null>;
  updateTask: (id: string, taskData: UpdateTaskDTO) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  getTaskById: (id: string) => Task | undefined;
  clearError: () => void;
}

/**
 * Hook for managing tasks
 */
export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilterOptions) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAllTasks(filters);
      setTasks(response.data || []);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Failed to fetch tasks';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskDTO): Promise<Task | null> => {
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Failed to create task';
      setError(message);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: UpdateTaskDTO): Promise<Task | null> => {
    setError(null);
    try {
      const updated = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
      return updated;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Failed to update task';
      setError(message);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Failed to delete task';
      setError(message);
      return false;
    }
  }, []);

  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  }, [tasks]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    clearError,
  };
};
