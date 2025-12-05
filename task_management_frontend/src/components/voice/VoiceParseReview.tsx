/**
 * Voice Parse Review Component
 * Shows parsed voice data for review before saving
 */

'use client';

import React, { useState } from 'react';
import { VoiceParseResponse, Priority, TaskStatus } from '@/types';
import { Button } from '@/components/common';
import { getPriorityBadgeClass, formatDate, formatDateForInput, parseDateFromInput } from '@/utils/helpers';

interface VoiceParseReviewProps {
  parseData: VoiceParseResponse;
  onConfirm: (data: VoiceParseResponse) => Promise<void>;
  onEdit: (parsedData: VoiceParseResponse) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const VoiceParseReview: React.FC<VoiceParseReviewProps> = ({
  parseData,
  onConfirm,
  onEdit,
  onCancel,
  isLoading = false,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedData, setEditedData] = useState(parseData);

  const handleFieldChange = (field: keyof typeof parseData.parsed, value: any) => {
    setEditedData({
      ...editedData,
      parsed: {
        ...editedData.parsed,
        [field]: value,
      },
    });
  };

  const handleConfirm = async () => {
    await onConfirm(editedData);
  };

  return (
    <div className="space-y-4">
      {/* Transcript Section */}
      <div className="gradient-primary rounded-2xl p-4 text-white shadow-md">
        <h3 className="text-sm font-semibold mb-2 opacity-90">Raw Transcript</h3>
        <p className="italic text-sm md:text-base">
          &quot;{editedData.rawTranscript}&quot;
        </p>
      </div>

      {/* Confidence Scores */}
      

      {/* Parsed Data */}
      <div className="border border-gray-200 rounded-2xl p-4 space-y-4 bg-white/90 shadow-sm">
        <h3 className="font-semibold text-gray-900">Parsed Task Details</h3>

        {/* Title */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={editedData.parsed.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white/90 input-glow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={editedData.parsed.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white/90 input-glow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <div className="flex gap-2 flex-wrap">
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => handleFieldChange('priority', p)}
                className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm transition ${
                  editedData.parsed.priority === p
                    ? getPriorityBadgeClass(p)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Due Date (Optional)
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(editedData.parsed.dueDate)}
            onChange={(e) => {
              handleFieldChange(
                'dueDate',
                parseDateFromInput(e.target.value)
              );
            }}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white/90 input-glow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {editedData.parsed.dueDate && (
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(editedData.parsed.dueDate)}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={editedData.parsed.status}
            onChange={(e) => handleFieldChange('status', e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Discard
        </Button>
        <Button variant="primary" onClick={handleConfirm} loading={isLoading}>
          Create Task
        </Button>
      </div>
    </div>
  );
};
