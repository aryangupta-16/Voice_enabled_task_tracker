/**
 * Main Home Page Component
 * Displays all tasks with multiple views (board, list)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, Priority, CreateTaskDTO, CreateTaskFromVoiceDTO, UpdateTaskDTO } from '@/types';
import { useTasks, useVoice } from '@/hooks';
import { TaskCard, TaskForm, TaskFilter } from '@/components/task';
import { VoiceInputButton, VoiceParseReview } from '@/components/voice';
import { Modal, Button, Alert } from '@/components/common';
import { getStatusLabel } from '@/utils/helpers';

type ViewType = 'board' | 'list';

export default function HomePage() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const {
    isRecording,
    transcript,
    isParsingVoice,
    parsedData,
    error: voiceError,
    startRecording,
    stopRecording,
    parseTranscript,
    createTaskFromVoice,
    resetVoiceState,
    isVoiceSupported,
  } = useVoice();

  const [view, setView] = useState<ViewType>('board');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showVoiceReview, setShowVoiceReview] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<TaskStatus | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [filterSearch, setFilterSearch] = useState('');

  const successMessage = useRef<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle voice recording stop
  useEffect(() => {
    if (!isRecording && transcript && !parsedData) {
      handleParseVoice();
    }
  }, [isRecording, transcript]);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    if (filterSearch && !task.title.toLowerCase().includes(filterSearch.toLowerCase()) && 
        !task.description?.toLowerCase().includes(filterSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleCreateTask = async (taskData: CreateTaskDTO) => {
    setIsSubmitting(true);
    const result = await createTask(taskData);
    setIsSubmitting(false);

    if (result) {
      setShowTaskForm(false);
      setSelectedTask(null);
      successMessage.current = 'Task created successfully!';
      setTimeout(() => (successMessage.current = null), 3000);
    }
  };

  const handleUpdateTask = async (taskData: CreateTaskDTO) => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    const result = await updateTask(selectedTask.id, taskData);
    setIsSubmitting(false);

    if (result) {
      setShowTaskForm(false);
      setSelectedTask(null);
      successMessage.current = 'Task updated successfully!';
      setTimeout(() => (successMessage.current = null), 3000);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const success = await deleteTask(taskId);
      if (success) {
        successMessage.current = 'Task deleted successfully!';
        setTimeout(() => (successMessage.current = null), 3000);
      }
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const updateData: UpdateTaskDTO = {
        title: task.title,
        description: task.description || undefined,
        priority: task.priority,
        dueDate: task.dueDate || undefined,
        status,
      };
      await updateTask(taskId, updateData);
    }
  };

  const handleParseVoice = async () => {
    if (transcript.trim()) {
      const result = await parseTranscript(transcript);
      if (result) {
        setShowVoiceReview(true);
      }
    }
  };

  const handleVoiceConfirm = async (voiceData: any) => {
    setIsSubmitting(true);
    const result = await createTaskFromVoice({
      transcript: voiceData.rawTranscript,
      parsedData: voiceData.parsed,
    });
    setIsSubmitting(false);

    if (result) {
      setShowVoiceReview(false);
      resetVoiceState();
      successMessage.current = 'Task created from voice successfully!';
      setTimeout(() => (successMessage.current = null), 3000);
      await fetchTasks();
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  // Get kanban board data
  const kanbanData = {
    TODO: filteredTasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: filteredTasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: filteredTasks.filter((t) => t.status === 'DONE'),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with gradient background */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="animate-slideInLeft">
              <p className="text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase">
                Dashboard
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                Task Tracker
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Voice-enabled, intelligent task management
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 animate-slideInLeft">
              <VoiceInputButton
                isRecording={isRecording}
                onStart={startRecording}
                onStop={stopRecording}
                isParsing={isParsingVoice}
              />
              <Button onClick={() => setShowTaskForm(true)} className="shadow-elevation">
                ➕ Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Alerts with animations */}
        {error && (
          <div className="mb-4 animate-fadeIn">
            <Alert
              type="error"
              message={error}
              autoClose={true}
            />
          </div>
        )}
        {voiceError && (
          <div className="mb-4 animate-fadeIn">
            <Alert
              type="error"
              message={voiceError}
              autoClose={true}
            />
          </div>
        )}
        {successMessage.current && (
          <div className="mb-4 animate-fadeIn">
            <Alert
              type="success"
              message={successMessage.current}
              autoClose={true}
            />
          </div>
        )}

        {/* Transcript Display During Recording - with gradient */}
        {isRecording && (
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg animate-pulse transform transition-all">
            <p className="text-sm font-bold mb-2 opacity-90">🎤 Listening to your voice...</p>
            <p className="text-xl italic font-semibold text-blue-50 min-h-8">
              {transcript || '✨ Listening...'}
            </p>
            <div className="mt-3 flex gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}

        {/* Top stats */}
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Total Tasks
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {filteredTasks.length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {tasks.length}
            </div>
          </div>
          <div className="hidden sm:flex bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 flex-col justify-center">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Views
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Switch between kanban board and compact list view.
            </p>
          </div>
          <div className="hidden sm:flex bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-sm px-4 py-3 text-white items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                Tip
              </p>
              <p className="mt-1 text-sm">
                Use your voice to create tasks in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section - with glassmorphism */}
        <div className="mb-4 sm:mb-6 animate-slideInLeft">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <TaskFilter
              onStatusChange={setFilterStatus}
              onPriorityChange={setFilterPriority}
              onSearchChange={setFilterSearch}
              currentStatus={filterStatus}
              currentPriority={filterPriority}
              currentSearch={filterSearch}
            />
          </div>
        </div>

        {/* View Toggle with gradient buttons */}
        <div className="flex gap-3 mb-6 animate-slideInLeft">
          <button
            onClick={() => setView('board')}
            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all transform hover-scale ${
              view === 'board'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 00-2 2v2a2 2 0 002 2h0a2 2 0 002-2v-2a2 2 0 00-2-2zm0 0V7a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h0a2 2 0 002-2m0 0V7a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2m0 0V7a2 2 0 012-2h2a2 2 0 012 2v10" />
            </svg>
            Board View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all transform hover-scale ${
              view === 'list'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 border border-gray-200 hover:border-purple-300'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            List View
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* Board View */}
        {view === 'board' && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
              <div
                key={status}
                className="bg-white/80 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden backdrop-blur-sm"
              >
                <div className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-200 px-4 py-3">
                  <h2 className="font-semibold text-gray-900 tracking-tight">{getStatusLabel(status)}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {kanbanData[status as keyof typeof kanbanData].length} tasks
                  </p>
                </div>
                <div className="p-4 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {kanbanData[status as keyof typeof kanbanData].length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-8">No tasks</p>
                  ) : (
                    kanbanData[status as keyof typeof kanbanData].map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {view === 'list' && !loading && (
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">No tasks found</p>
                <Button onClick={() => setShowTaskForm(true)} variant="primary" size="md" className="mt-4">
                  Create first task
                </Button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <Modal
        isOpen={showTaskForm}
        onClose={handleCloseTaskForm}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={selectedTask || undefined}
          onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
          isLoading={isSubmitting}
          onCancel={handleCloseTaskForm}
        />
      </Modal>

      {/* Voice Parse Review Modal */}
      <Modal
        isOpen={showVoiceReview && parsedData !== null}
        onClose={() => setShowVoiceReview(false)}
        title="Review Voice Input"
        size="lg"
      >
        {parsedData && (
          <VoiceParseReview
            parseData={parsedData}
            onConfirm={handleVoiceConfirm}
            onEdit={() => {}}
            onCancel={() => {
              setShowVoiceReview(false);
              resetVoiceState();
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
}
