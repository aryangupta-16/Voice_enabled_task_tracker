/**
 * Task Card Component
 * Displays a single task with actions
 */

'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { formatDate, getPriorityBadgeClass, getStatusLabel, getDueDateStatus, isOverdue } from '@/utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  draggable = false,
  onDragStart,
}) => {
  const overdueClass = isOverdue(task.dueDate) && task.status !== 'DONE' ? 'border-red-300 bg-red-50' : '';

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => draggable && onDragStart?.(e, task)}
      className={`relative card bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-lg 
      transition-all duration-200 hover:-translate-y-1 hover-scale overflow-hidden ${
        overdueClass || ''
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-slate-100" />
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-grow pr-2">
          <h3
            className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => onEdit(task)}
          >
            {task.title}
          </h3>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 transition flex-shrink-0 rounded-full p-1 hover:bg-red-50"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badge and Due Date */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isOverdue(task.dueDate) && task.status !== 'DONE'
                ? 'bg-red-100 text-red-700 font-semibold'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {getDueDateStatus(task.dueDate)}
          </span>
        )}
      </div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-xs md:text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white/80 
          hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-700 transition text-xs md:text-sm font-medium hover:underline"
        >
          Edit
        </button>
      </div>

      {/* Transcript hint */}
      {task.rawTranscript && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-[0.7rem] text-gray-500 italic">
            Voice: &quot;{task.rawTranscript.substring(0, 50)}{task.rawTranscript.length > 50 ? '...' : ''}&quot;
          </p>
        </div>
      )}
    </div>
  );
};
