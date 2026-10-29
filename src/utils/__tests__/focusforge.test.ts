import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialChallengeState,
  calculateStreakFromSessions,
  syncChallengeStateWithSessions,
  getNextChallengeMilestone,
  startNextChallengeCycle,
  DEFAULT_DAILY_GOAL_MINUTES,
} from '../challenge';
import { evaluateAchievements } from '../achievements';
import { SessionRecord } from '../../types/timer';
import { calculateProductivityStats } from '../storage';

test('FocusForge: Initial user state starts genuinely at zero', () => {
  const initial = createInitialChallengeState(DEFAULT_DAILY_GOAL_MINUTES);
  assert.equal(initial.currentCycle.cycleNumber, 1);
  assert.equal(initial.currentCycle.completedChallengeDays, 0);
  assert.equal(initial.currentCycle.completedDates.length, 0);
  assert.equal(initial.currentCycle.dailyGoalMinutes, 60);
  assert.equal(initial.currentCycle.isCompleted, false);
  assert.equal(initial.lifetimeMinutes, 0);
  assert.equal(initial.lifetimeSessions, 0);
  assert.equal(initial.currentStreak, 0);
  assert.equal(initial.longestStreak, 0);
});

test('FocusForge: Challenge day only advances when daily goal is met', () => {
  const today = '2026-10-29';
  const initial = createInitialChallengeState(60);
  initial.currentCycle.startDate = today;

  // Session 1: 25 minutes (does not reach 60 min threshold)
  const session1: SessionRecord = {
    id: 's1',
    timestamp: new Date(`${today}T09:00:00`).getTime(),
    mode: 'focus',
    durationMinutes: 25,
  };

  const synced1 = syncChallengeStateWithSessions(initial, [session1]);
  assert.equal(synced1.currentCycle.completedChallengeDays, 0);
  assert.equal(synced1.lifetimeMinutes, 25);
  assert.equal(synced1.lifetimeSessions, 1);

  // Session 2: another 25 minutes (total 50 min, still < 60)
  const session2: SessionRecord = {
    id: 's2',
    timestamp: new Date(`${today}T11:00:00`).getTime(),
    mode: 'focus',
    durationMinutes: 25,
  };

  const synced2 = syncChallengeStateWithSessions(initial, [session1, session2]);
  assert.equal(synced2.currentCycle.completedChallengeDays, 0);
  assert.equal(synced2.lifetimeMinutes, 50);

  // Session 3: 15 minutes (total 65 min >= 60 min threshold) -> Challenge Day 1 reached!
  const session3: SessionRecord = {
    id: 's3',
    timestamp: new Date(`${today}T14:00:00`).getTime(),
    mode: 'focus',
    durationMinutes: 15,
  };

  const synced3 = syncChallengeStateWithSessions(initial, [session1, session2, session3]);
  assert.equal(synced3.currentCycle.completedChallengeDays, 1);
  assert.equal(synced3.currentCycle.completedDates.length, 1);
  assert.equal(synced3.currentCycle.completedDates[0], today);
  assert.equal(synced3.lifetimeMinutes, 65);
  assert.equal(synced3.lifetimeSessions, 3);
});

test('FocusForge: Multiple sessions on the same calendar day do not artificially inflate challenge days', () => {
  const today = '2026-10-29';
  const initial = createInitialChallengeState(60);
  initial.currentCycle.startDate = today;

  const sessions: SessionRecord[] = [
    { id: '1', timestamp: new Date(`${today}T08:00:00`).getTime(), mode: 'focus', durationMinutes: 50 },
    { id: '2', timestamp: new Date(`${today}T10:00:00`).getTime(), mode: 'focus', durationMinutes: 50 },
    { id: '3', timestamp: new Date(`${today}T14:00:00`).getTime(), mode: 'focus', durationMinutes: 50 },
    { id: '4', timestamp: new Date(`${today}T16:00:00`).getTime(), mode: 'focus', durationMinutes: 50 },
  ]; // Total 200 min on single day

  const synced = syncChallengeStateWithSessions(initial, sessions);
  assert.equal(synced.currentCycle.completedChallengeDays, 1, 'Single day should only yield 1 challenge day stamp');
  assert.equal(synced.lifetimeMinutes, 200);
});

test('FocusForge: Consecutive-day streak calculation and missed-day handling', () => {
  const refDate = new Date('2026-10-29T18:00:00');

  // Consecutive qualifying days: Oct 27 (60m), Oct 28 (60m), Oct 29 (60m)
  const sessions: SessionRecord[] = [
    { id: 'a', timestamp: new Date('2026-10-27T10:00:00').getTime(), mode: 'focus', durationMinutes: 60 },
    { id: 'b', timestamp: new Date('2026-10-28T10:00:00').getTime(), mode: 'focus', durationMinutes: 60 },
    { id: 'c', timestamp: new Date('2026-10-29T10:00:00').getTime(), mode: 'focus', durationMinutes: 60 },
  ];

  const streakResult = calculateStreakFromSessions(sessions, 60, refDate);
  assert.equal(streakResult.currentStreak, 3);
  assert.equal(streakResult.longestStreak, 3);

  // Missed day scenario: Oct 25 (60m), missed Oct 26 & 27, Oct 28 (60m), Oct 29 (60m)
  const brokenSessions: SessionRecord[] = [
    { id: 'x', timestamp: new Date('2026-10-25T10:00:00').getTime(), mode: 'focus', durationMinutes: 60 },
    { id: 'y', timestamp: new Date('2026-10-28T10:00:00').getTime(), mode: 'focus', durationMinutes: 60 },
    { id: 'z', timestamp: new Date('2026-10-29T10:00:00').getTime(), mode: 'focus', durationMinutes: 60 },
  ];

  const brokenStreak = calculateStreakFromSessions(brokenSessions, 60, refDate);
  assert.equal(brokenStreak.currentStreak, 2);
});

test('FocusForge: Milestone calculation tracks 3, 7, 14, and 30 day targets accurately', () => {
  const m0 = getNextChallengeMilestone(0);
  assert.equal(m0.day, 3);
  assert.equal(m0.daysRemaining, 3);

  const m3 = getNextChallengeMilestone(3);
  assert.equal(m3.day, 7);
  assert.equal(m3.daysRemaining, 4);

  const m14 = getNextChallengeMilestone(14);
  assert.equal(m14.day, 30);
  assert.equal(m14.daysRemaining, 16);

  const m30 = getNextChallengeMilestone(30);
  assert.equal(m30.day, 30);
  assert.equal(m30.isReached, true);
  assert.equal(m30.daysRemaining, 0);
});

test('FocusForge: Month 30 completion and Cycle 2 rollover preserves lifetime records', () => {
  const completedState = createInitialChallengeState(60);
  completedState.currentCycle.completedChallengeDays = 30;
  completedState.currentCycle.isCompleted = true;
  completedState.lifetimeMinutes = 2100;
  completedState.lifetimeSessions = 84;
  completedState.longestStreak = 18;

  const nextState = startNextChallengeCycle(completedState);

  assert.equal(nextState.currentCycle.cycleNumber, 2);
  assert.equal(nextState.currentCycle.completedChallengeDays, 0, 'New cycle starts at Day 0');
  assert.equal(nextState.currentCycle.isCompleted, false);
  assert.equal(nextState.pastCycles.length, 1);
  assert.equal(nextState.pastCycles[0].cycleNumber, 1);
  assert.equal(nextState.pastCycles[0].isCompleted, true);
  assert.equal(nextState.lifetimeMinutes, 2100, 'Lifetime minutes are preserved');
  assert.equal(nextState.lifetimeSessions, 84, 'Lifetime sessions are preserved');
  assert.equal(nextState.longestStreak, 18, 'Longest streak is preserved');
});

test('FocusForge: LeetCode-style achievements evaluation awards correct badges without duplicates', () => {
  const challengeState = createInitialChallengeState(60);
  challengeState.currentStreak = 7;
  challengeState.currentCycle.completedChallengeDays = 7;

  const sessions: SessionRecord[] = [
    { id: '1', timestamp: Date.now() - 50000, mode: 'focus', durationMinutes: 60 },
  ];

  const eval1 = evaluateAchievements(sessions, challengeState, {});
  assert.ok(eval1.newlyUnlockedIds.includes('first-focus'), 'First focus should unlock');
  assert.ok(eval1.newlyUnlockedIds.includes('getting-started'), 'Getting started (3 days) should unlock');
  assert.ok(eval1.newlyUnlockedIds.includes('one-week-warrior'), 'One week warrior (7 days) should unlock');
  assert.equal(eval1.newlyUnlockedIds.includes('focusforge-champion'), false, '30-day champion should still be locked');

  // Verify locked badge has correct progress
  const champBadge = eval1.evaluatedList.find((a) => a.id === 'focusforge-champion');
  assert.ok(champBadge);
  assert.equal(champBadge.unlocked, false);
  assert.equal(champBadge.progress, 7);
  assert.equal(champBadge.maxProgress, 30);

  // If badge was previously unlocked, it remains unlocked and is not in newlyUnlockedIds
  const storedMap = { 'first-focus': Date.now() - 100000 };
  const eval2 = evaluateAchievements(sessions, challengeState, storedMap);
  assert.equal(eval2.newlyUnlockedIds.includes('first-focus'), false, 'Should not re-announce already unlocked badge');
  const firstBadge = eval2.evaluatedList.find((a) => a.id === 'first-focus');
  assert.equal(firstBadge?.unlocked, true);
});

test('FocusForge: calculateProductivityStats returns clean zero state for brand new users', () => {
  const stats = calculateProductivityStats([], [], 60, 0);
  assert.equal(stats.focusSessionsToday, 0);
  assert.equal(stats.totalFocusMinutesToday, 0);
  assert.equal(stats.streak, 0);
  assert.equal(stats.thisWeekMinutes, 0);
  assert.equal(stats.productivityScore, 0);
  assert.equal(stats.completionRate, 0);
  assert.equal(stats.vsAvgMinutes, 0);
});
