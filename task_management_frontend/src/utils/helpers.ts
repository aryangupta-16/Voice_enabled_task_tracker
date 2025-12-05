/**
 * Utility Functions
 * Helper functions for formatting, validation, etc.
 */

import { Priority, TaskStatus } from '@/types';

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date set';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};

export const parseDateFromInput = (inputValue: string): string | null => {
  if (!inputValue) return null;
  try {
    const localDate = new Date(inputValue);
    return localDate.toISOString();
  } catch {
    return null;
  }
};


export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-sm';
    case 'HIGH':
      return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm';
    case 'MEDIUM':
      return 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm';
    case 'LOW':
      return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get priority badge class
 */
export const getPriorityBadgeClass = (priority: Priority): string => {
  const base =
    'inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase';
  return `${base} ${getPriorityColor(priority)}`;
};

/**
 * Get status color
 */
export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'TODO':
      return 'bg-slate-100 text-slate-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'DONE':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get status label
 */
export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
};

/**
 * Get priority label
 */
export const getPriorityLabel = (priority: Priority): string => {
  return priority.charAt(0) + priority.slice(1).toLowerCase();
};

/**
 * Check if date is overdue
 */
export const isOverdue = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

/**
 * Check if date is today
 */
export const isToday = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false;
  const date = new Date(dueDate);
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Get due date status text
 */
export const getDueDateStatus = (dueDate: string | null | undefined): string => {
  if (!dueDate) return 'No due date';
  if (isOverdue(dueDate)) return 'Overdue';
  if (isToday(dueDate)) return 'Due today';
  if (isTomorrow(dueDate)) return 'Due tomorrow';
  return formatDate(dueDate);
};

/**
 * Truncate text
 */
export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Validate email
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Generate color based on string (for avatars, etc.)
 */
export const getColorFromString = (str: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
