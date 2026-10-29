import { useState, useEffect, useCallback } from 'react';
import { Task, TaskPriority } from '../types/task';
import {
  getStoredTasks,
  setStoredTasks,
  getStoredActiveTaskId,
  setStoredActiveTaskId,
} from '../utils/storage';

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const list = getStoredTasks();
    const cleaned = list.filter((t) => !t.id?.startsWith('demo-'));
    if (cleaned.length !== list.length) {
      setStoredTasks(cleaned);
    }
    return cleaned;
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    const id = getStoredActiveTaskId();
    if (id && id.startsWith('demo-')) {
      setStoredActiveTaskId(null);
      return null;
    }
    return id;
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Save tasks to LocalStorage whenever they change
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks]);

  // Save active task ID
  useEffect(() => {
    setStoredActiveTaskId(activeTaskId);
  }, [activeTaskId]);

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  // Add a task
  const addTask = useCallback(
    (title: string, priority: TaskPriority = 'medium', estimatedSessions = 2, notes = '') => {
      if (!title.trim()) return;
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: title.trim(),
        priority,
        estimatedSessions: Math.max(1, estimatedSessions),
        completedSessions: 0,
        completed: false,
        createdAt: Date.now(),
        notes: notes.trim() || undefined,
      };

      setTasks((prev) => [newTask, ...prev]);

      // If no active task currently selected, auto-select this new task
      if (!activeTaskId) {
        setActiveTaskId(newTask.id);
      }
    },
    [activeTaskId]
  );

  // Toggle completion
  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const willBeCompleted = !t.completed;
          return {
            ...t,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  }, []);

  // Update existing task
  const updateTask = useCallback(
    (
      id: string,
      updates: Partial<Pick<Task, 'title' | 'priority' | 'estimatedSessions' | 'notes'>>
    ) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  // Delete task
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (activeTaskId === id) {
        setActiveTaskId(null);
      }
    },
    [activeTaskId]
  );

  // Increment completed sessions for active task
  const incrementTaskSession = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completedSessions: t.completedSessions + 1,
          };
        }
        return t;
      })
    );
  }, []);

  // Select active task
  const selectActiveTask = useCallback((id: string | null) => {
    setActiveTaskId((prev) => (prev === id ? null : id));
  }, []);

  // Filtered tasks list
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Clear completed tasks
  const clearCompletedTasks = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  return {
    tasks,
    activeTaskId,
    activeTask,
    filter,
    filteredTasks,
    setFilter,
    addTask,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    incrementTaskSession,
    selectActiveTask,
    clearCompletedTasks,
  };
}
