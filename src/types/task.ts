export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: TaskPriority;
  estimatedSessions: number; // number of Pomodoros
  completedSessions: number;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}
