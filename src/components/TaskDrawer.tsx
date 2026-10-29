import React from 'react';
import { X, CheckCircle2, ListTodo } from 'lucide-react';
import { Task, TaskPriority } from '../types/task';
import { ThemeConfig } from '../types/theme';
import { TaskPanel } from './TaskPanel';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  activeTaskId: string | null;
  filter: 'all' | 'active' | 'completed';
  theme: ThemeConfig;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onAddTask: (title: string, priority: TaskPriority, estimatedSessions: number, notes?: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'estimatedSessions' | 'notes'>>) => void;
  onDeleteTask: (id: string) => void;
  onSelectActiveTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  activeTaskId,
  filter,
  theme,
  onFilterChange,
  onAddTask,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  onSelectActiveTask,
  onClearCompleted,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:pr-8 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] rounded-3xl bg-[#12141c]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 text-neutral-100 flex flex-col overflow-hidden animate-in slide-in-from-right-6 sm:slide-in-from-bottom-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Focus Tasks</h2>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-neutral-300 font-mono">
              {tasks.filter((t) => !t.completed).length} pending
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close tasks panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Tasks Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          <TaskPanel
            tasks={tasks}
            activeTaskId={activeTaskId}
            filter={filter}
            theme={theme}
            onFilterChange={onFilterChange}
            onAddTask={onAddTask}
            onToggleComplete={onToggleComplete}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onSelectActiveTask={onSelectActiveTask}
            onClearCompleted={onClearCompleted}
          />
        </div>
      </div>
    </div>
  );
};
