import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';
import { Task, TaskPriority } from '../../types/task';

interface TasksViewProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string, priority: TaskPriority, estimatedSessions: number) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSelectActiveTask: (id: string) => void;
  isLight?: boolean;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  activeTaskId,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  onSelectActiveTask,
  isLight = false,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimate, setEstimate] = useState(2);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), priority, estimate);
    setNewTitle('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2" style={{ color: 'var(--theme-text-primary)' }}>
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Focus Tasks</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
            Organize high-impact objectives and assign target Pomodoro sessions.
          </p>
        </div>

        {/* Filter buttons */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl border text-xs"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <button
            onClick={() => setFilter('all')}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              backgroundColor: filter === 'all' ? 'var(--theme-accent-glow)' : 'transparent',
              color: filter === 'all' ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
              fontWeight: filter === 'all' ? 600 : 400,
            }}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              backgroundColor: filter === 'active' ? 'var(--theme-accent-glow)' : 'transparent',
              color: filter === 'active' ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
              fontWeight: filter === 'active' ? 600 : 400,
            }}
          >
            Active ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              backgroundColor: filter === 'completed' ? 'var(--theme-accent-glow)' : 'transparent',
              color: filter === 'completed' ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
              fontWeight: filter === 'completed' ? 600 : 400,
            }}
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </button>
        </div>
      </div>

      {/* New Task Creator Card */}
      <form
        onSubmit={handleCreate}
        className="p-4 sm:p-5 rounded-2xl border shadow-xl space-y-4"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="What needs your undivided attention today?..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-5 py-2.5 rounded-xl disabled:opacity-40 text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: 'var(--theme-accent-primary)',
              color: isLight ? '#FFFFFF' : '#0B1020',
              boxShadow: '0 2px 10px var(--theme-accent-glow)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Priority & Sessions config */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--theme-text-secondary)' }}>Priority:</span>
            {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className="px-3 py-1 rounded-lg capitalize border transition-all cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? 'var(--theme-accent-glow)' : 'transparent',
                    borderColor: isSelected ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                    color: isSelected ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1" style={{ color: 'var(--theme-text-secondary)' }}>
              <Clock className="w-3.5 h-3.5" /> Target:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEstimate(n)}
                  className="w-6 h-6 rounded-lg text-xs font-mono border cursor-pointer"
                  style={{
                    backgroundColor: estimate === n ? 'var(--theme-accent-glow)' : 'transparent',
                    borderColor: estimate === n ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                    color: estimate === n ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
                    fontWeight: estimate === n ? 700 : 400,
                  }}
                >
                  {n}
                </button>
              ))}
              <span className="text-xs ml-1" style={{ color: 'var(--theme-text-secondary)' }}>
                🍅 sessions
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Task Items List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div
            className="p-8 text-center rounded-2xl border text-xs font-mono"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
          >
            No tasks found under current filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-2xl border transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--theme-accent-glow)' : 'var(--theme-bg-card)',
                  borderColor: isActive ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className="cursor-pointer"
                    style={{ color: task.completed ? 'var(--theme-success)' : 'var(--theme-text-secondary)' }}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-current" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}
                      style={{ color: 'var(--theme-text-primary)' }}
                    >
                      {task.title}
                    </p>

                    <div className="flex items-center gap-3 mt-1 text-[11px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                      <span className="uppercase tracking-wider font-semibold" style={{ color: 'var(--theme-accent-primary)' }}>
                        {task.priority}
                      </span>
                      <span>
                        {task.completedSessions} / {task.estimatedSessions} 🍅 completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!task.completed && (
                    <button
                      onClick={() => onSelectActiveTask(task.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: isActive ? 'var(--theme-accent-primary)' : 'var(--theme-bg-elevated)',
                        color: isActive ? (isLight ? '#FFFFFF' : '#0B1020') : 'var(--theme-text-primary)',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {isActive ? 'Active Goal' : 'Focus'}
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/10"
                    style={{ color: 'var(--theme-text-secondary)' }}
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
