/**
 * Task Filter Component
 * Filter tasks by status, priority, and search
 */

'use client';

import React from 'react';
import { TaskStatus, Priority } from '@/types';

interface TaskFilterProps {
  onStatusChange: (status: TaskStatus | null) => void;
  onPriorityChange: (priority: Priority | null) => void;
  onSearchChange: (search: string) => void;
  currentStatus: TaskStatus | null;
  currentPriority: Priority | null;
  currentSearch: string;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  currentStatus,
  currentPriority,
  currentSearch,
}) => {
  return (
    <div className="bg-white/90 border border-gray-200/80 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Search */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search tasks..."
            value={currentSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white/90 input-glow focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={currentStatus || ''}
            onChange={(e) => onStatusChange((e.target.value as TaskStatus) || null)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white/90"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={currentPriority || ''}
            onChange={(e) => onPriorityChange((e.target.value as Priority) || null)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white/90"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div className="flex items-end">
          <button
            onClick={() => {
              onSearchChange('');
              onStatusChange(null);
              onPriorityChange(null);
            }}
            className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition font-medium text-sm hover-scale"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
