import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProductivityStats } from '../src/utils/storage.ts';
import { SessionRecord } from '../src/types/timer.ts';
import { Task } from '../src/types/task.ts';

test('calculateProductivityStats calculates today sessions and duration correctly', () => {
  const now = Date.now();
  const mockSessions: SessionRecord[] = [
    {
      id: '1',
      timestamp: now,
      mode: 'focus',
      durationMinutes: 25,
      taskTitle: 'Algorithm practice',
    },
    {
      id: '2',
      timestamp: now - 3600000,
      mode: 'focus',
      durationMinutes: 25,
      taskTitle: 'Code review',
    },
    {
      id: '3',
      timestamp: now - 1800000,
      mode: 'shortBreak',
      durationMinutes: 5,
    },
  ];

  const mockTasks: Task[] = [
    {
      id: 't1',
      title: 'Task 1',
      priority: 'high',
      estimatedSessions: 2,
      completedSessions: 2,
      completed: true,
      createdAt: now,
    },
    {
      id: 't2',
      title: 'Task 2',
      priority: 'medium',
      estimatedSessions: 3,
      completedSessions: 0,
      completed: false,
      createdAt: now,
    },
  ];

  const stats = calculateProductivityStats(mockSessions, mockTasks);

  assert.equal(stats.focusSessionsToday, 2, 'Should count 2 focus sessions today');
  assert.equal(stats.totalFocusMinutesToday, 50, 'Should sum to 50 minutes of focus');
  assert.equal(stats.completedTasksCount, 1, 'Should count 1 completed task');
  assert.ok(stats.streak >= 1, 'Streak should be at least 1');
  assert.equal(stats.past7Days.length, 7, 'Past 7 days chart array should have 7 items');
});

test('calculateProductivityStats handles empty sessions and tasks safely', () => {
  const stats = calculateProductivityStats([], []);
  assert.equal(stats.focusSessionsToday, 0);
  assert.equal(stats.totalFocusMinutesToday, 0);
  assert.equal(stats.completedTasksCount, 0);
  assert.equal(stats.streak, 0);
  assert.equal(stats.past7Days.length, 7);
});
