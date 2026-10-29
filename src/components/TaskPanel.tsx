import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Target,
  ListTodo,
  Check,
  X,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Task, TaskPriority } from '../types/task';
import { ThemeConfig } from '../types/theme';

interface TaskPanelProps {
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

export const TaskPanel: React.FC<TaskPanelProps> = ({
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
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newEstimate, setNewEstimate] = useState<number>(2);
  const [isAddingExpanded, setIsAddingExpanded] = useState(false);

  // Edit task state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
  const [editEstimate, setEditEstimate] = useState(2);

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditEstimate(task.estimatedSessions);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateTask(id, {
      title: editTitle.trim(),
      priority: editPriority,
      estimatedSessions: editEstimate,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, newPriority, newEstimate);
    setNewTitle('');
    setIsAddingExpanded(false);
  };

  const handleQuickAdd = (title: string, priority: TaskPriority, est: number) => {
    onAddTask(title, priority, est);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const priorityStyles: Record<TaskPriority, { badge: string; dot: string; label: string }> = {
    low: {
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
      dot: 'bg-blue-400',
      label: 'Low',
    },
    medium: {
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      dot: 'bg-amber-400',
      label: 'Medium',
    },
    high: {
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
      dot: 'bg-rose-400',
      label: 'High',
    },
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={`flex flex-col h-full rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 shadow-2xl backdrop-blur-2xl transition-all`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
            <ListTodo className={`w-4 h-4 ${theme.accentColor}`} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Focus Tasks</h2>
            <p className="text-[11px] text-white/50">Goals for your session</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white/20 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'active'
                ? 'bg-white/20 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active ({tasks.length - completedCount})
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'completed'
                ? 'bg-white/20 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Quick Add Task Input */}
      <form onSubmit={handleCreateSubmit} className="mt-4 mb-3">
        <div className="relative flex items-center group">
          <input
            type="text"
            placeholder="What will you conquer this session?..."
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (!isAddingExpanded && e.target.value.length > 0) {
                setIsAddingExpanded(true);
              }
            }}
            onFocus={() => setIsAddingExpanded(true)}
            className="w-full pl-4 pr-12 py-3 bg-black/40 border border-white/15 hover:border-white/25 rounded-2xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className={`absolute right-2 p-2 rounded-xl ${theme.primaryButton} disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-95`}
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Options: Priority & Estimated Pomodoros */}
        {isAddingExpanded && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2.5 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Priority selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 font-medium">Priority:</span>
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all border ${
                    newPriority === p
                      ? `${priorityStyles[p].badge} font-bold scale-102`
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Estimated sessions */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> Est:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewEstimate(num)}
                    className={`w-6 h-6 rounded-lg text-xs font-mono transition-all border ${
                      newEstimate === num
                        ? 'bg-white/25 text-white font-bold border-white/30 shadow-sm'
                        : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <span className="text-neutral-400 text-xs ml-0.5">🍅</span>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Task List or High-End Empty State */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px] sm:max-h-[440px]">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-black/20 border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3.5 shadow-inner">
              <Sparkles className={`w-5 h-5 ${theme.accentColor}`} />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-normal">
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'All goals achieved! Nothing active.'
                : 'No focus tasks defined yet'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mt-1 leading-relaxed">
              {filter === 'completed'
                ? 'Finish a focus sprint on an active task to log it here.'
                : 'Type your objective in the field above, or select a quick starter template below:'}
            </p>

            {filter !== 'completed' && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-xs">
                {[
                  { title: 'LeetCode Algorithm Sprint', priority: 'high' as TaskPriority, est: 2 },
                  { title: 'System Design Deep Dive', priority: 'medium' as TaskPriority, est: 3 },
                  { title: 'Read Technical Documentation', priority: 'low' as TaskPriority, est: 2 },
                ].map((template) => (
                  <button
                    key={template.title}
                    type="button"
                    onClick={() => handleQuickAdd(template.title, template.priority, template.est)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-neutral-300 hover:text-white transition-all text-left group"
                  >
                    <Plus className="w-3 h-3 text-neutral-400 group-hover:text-white" />
                    <span>{template.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingId === task.id;
            const isActive = activeTaskId === task.id;

            if (isEditing) {
              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-black/60 border border-white/20 space-y-2.5 shadow-xl"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setEditPriority(p)}
                          className={`px-2 py-0.5 rounded-lg capitalize border ${
                            editPriority === p
                              ? `${priorityStyles[p].badge} font-bold`
                              : 'border-transparent text-neutral-400'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400">Est:</span>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setEditEstimate(num)}
                          className={`w-5 h-5 rounded text-[11px] font-mono border ${
                            editEstimate === num
                              ? 'bg-white/25 text-white font-bold border-white/30'
                              : 'text-neutral-400 border-transparent'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-400"
                        title="Save changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 rounded-lg bg-white/10 text-neutral-300 hover:bg-white/20"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={task.id}
                className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-white/15 border-emerald-400/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/20'
                    : 'bg-black/35 hover:bg-black/50 border-white/10 hover:border-white/20 shadow-sm'
                }`}
              >
                {/* Left check & title */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className="shrink-0 text-neutral-400 hover:text-emerald-400 transition-colors"
                    title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.completed ? 'line-through text-neutral-400 opacity-60' : 'text-neutral-100'
                      }`}
                    >
                      {task.title}
                    </p>

                    {/* Progress Bar & Badges */}
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${
                          priorityStyles[task.priority].badge
                        }`}
                      >
                        {priorityStyles[task.priority].label}
                      </span>

                      {/* Pomodoro count progress */}
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                        <span>
                          {task.completedSessions}/{task.estimatedSessions} 🍅
                        </span>
                        {/* Visual mini progress bar */}
                        <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                (task.completedSessions / Math.max(1, task.estimatedSessions)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right action icons */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {/* Select as active timer focus task */}
                  {!task.completed && (
                    <button
                      onClick={() => onSelectActiveTask(task.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40 shadow-sm'
                          : 'bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border-transparent'
                      }`}
                      title={isActive ? 'Active focus task' : 'Set as current timer goal'}
                    >
                      <Target className="w-4 h-4" />
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Clear Completed */}
      {completedCount > 0 && (
        <div className="pt-3.5 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <span>{completedCount} task{completedCount > 1 ? 's' : ''} completed</span>
          <button
            onClick={onClearCompleted}
            className="hover:text-rose-300 transition-colors"
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
};
