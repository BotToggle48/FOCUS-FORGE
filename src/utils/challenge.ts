import { ChallengeCycle, ChallengeMilestone, ChallengeState } from '../types/challenge';
import { SessionRecord } from '../types/timer';

export const DEFAULT_DAILY_GOAL_MINUTES = 60;

export const CHALLENGE_CYCLE_TITLES: Record<number, string> = {
  1: 'Month 1: Foundational Discipline',
  2: 'Month 2: Iron Will & Deep Immersion',
  3: 'Month 3: Flow Virtuoso',
  4: 'Month 4: Master Craftsman',
  5: 'Month 5: Unstoppable Force',
  6: 'Month 6: Legendary Ascendant',
};

export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateStringFromTimestamp(timestamp: number): string {
  return getTodayDateString(new Date(timestamp));
}

export function createInitialChallengeState(dailyGoal: number = DEFAULT_DAILY_GOAL_MINUTES): ChallengeState {
  return {
    currentCycle: {
      cycleNumber: 1,
      title: CHALLENGE_CYCLE_TITLES[1],
      startDate: getTodayDateString(),
      completedChallengeDays: 0,
      completedDates: [],
      dailyGoalMinutes: dailyGoal,
      isCompleted: false,
      completedAt: null,
    },
    pastCycles: [],
    lifetimeMinutes: 0,
    lifetimeSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastQualifyingDate: null,
    celebrationPending: false,
  };
}

/**
 * Calculates focus minutes grouped by calendar date (YYYY-MM-DD)
 */
export function groupFocusMinutesByDate(sessions: SessionRecord[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of sessions) {
    if (s.mode === 'focus' && s.durationMinutes > 0) {
      const dateStr = getDateStringFromTimestamp(s.timestamp);
      map[dateStr] = (map[dateStr] || 0) + s.durationMinutes;
    }
  }
  return map;
}

/**
 * Calculates consecutive qualifying day streak from session history
 * A day qualifies if total focus minutes >= dailyGoalMinutes.
 * If today has not yet qualified, the streak preserves yesterday's streak without breaking.
 */
export function calculateStreakFromSessions(
  sessions: SessionRecord[],
  dailyGoalMinutes: number = DEFAULT_DAILY_GOAL_MINUTES,
  referenceDate: Date = new Date()
): { currentStreak: number; longestStreak: number } {
  const dailyMinutes = groupFocusMinutesByDate(sessions);
  const qualifyingDates = new Set<string>();

  for (const [dateStr, minutes] of Object.entries(dailyMinutes)) {
    if (minutes >= dailyGoalMinutes) {
      qualifyingDates.add(dateStr);
    }
  }

  // Calculate current streak
  let currentStreak = 0;
  const cursor = new Date(referenceDate);
  const todayStr = getTodayDateString(cursor);

  // If today qualifies, count it
  if (qualifyingDates.has(todayStr)) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  } else {
    // Today hasn't qualified yet. Check yesterday.
    cursor.setDate(cursor.getDate() - 1);
  }

  // Count backwards consecutive days
  while (true) {
    const dStr = getTodayDateString(cursor);
    if (qualifyingDates.has(dStr)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate all-time longest streak
  const sortedDates = Array.from(qualifyingDates).sort();
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const parts = dStr.split('-').map(Number);
    const currentDate = new Date(parts[0], parts[1] - 1, parts[2]);

    if (prevDate) {
      const diffMs = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    } else {
      runningStreak = 1;
    }

    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currentDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}

/**
 * Recomputes full challenge progress state from sessions and persisted state
 */
export function syncChallengeStateWithSessions(
  currentState: ChallengeState,
  sessions: SessionRecord[]
): ChallengeState {
  const focusSessions = sessions.filter((s) => s.mode === 'focus');
  const lifetimeMinutes = focusSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const lifetimeSessions = focusSessions.length;

  const goal = currentState.currentCycle.dailyGoalMinutes || DEFAULT_DAILY_GOAL_MINUTES;
  const { currentStreak, longestStreak } = calculateStreakFromSessions(sessions, goal);

  // Determine completed challenge dates for current cycle
  // Only count dates on or after current cycle startDate
  const dailyMinutes = groupFocusMinutesByDate(sessions);
  const currentCycleStartDate = currentState.currentCycle.startDate;

  const cycleDates: string[] = [];
  for (const [dateStr, minutes] of Object.entries(dailyMinutes)) {
    if (minutes >= goal) {
      if (dateStr >= currentCycleStartDate) {
        cycleDates.push(dateStr);
      }
    }
  }

  cycleDates.sort();
  const completedChallengeDays = Math.min(30, cycleDates.length);
  const isNowCompleted = completedChallengeDays >= 30;
  const wasCompleted = currentState.currentCycle.isCompleted;

  const updatedCycle: ChallengeCycle = {
    ...currentState.currentCycle,
    completedChallengeDays,
    completedDates: cycleDates,
    isCompleted: isNowCompleted,
    completedAt: isNowCompleted && !wasCompleted ? new Date().toISOString() : currentState.currentCycle.completedAt,
  };

  return {
    ...currentState,
    currentCycle: updatedCycle,
    lifetimeMinutes,
    lifetimeSessions,
    currentStreak,
    longestStreak: Math.max(currentState.longestStreak, longestStreak),
    lastQualifyingDate: cycleDates.length > 0 ? cycleDates[cycleDates.length - 1] : null,
    celebrationPending: isNowCompleted && !wasCompleted,
  };
}

/**
 * Calculates next milestone in the 30-day challenge
 */
export function getNextChallengeMilestone(completedDays: number): ChallengeMilestone {
  const milestones = [
    { day: 3, title: 'Getting Started', badgeName: 'Getting Started' },
    { day: 7, title: 'One-Week Warrior', badgeName: 'One-Week Warrior' },
    { day: 14, title: 'Two-Week Discipline', badgeName: 'Two-Week Discipline' },
    { day: 30, title: 'FocusForge Champion', badgeName: 'FocusForge Champion' },
  ];

  for (const m of milestones) {
    if (completedDays < m.day) {
      return {
        ...m,
        isReached: false,
        daysRemaining: m.day - completedDays,
      };
    }
  }

  return {
    day: 30,
    title: 'FocusForge Champion',
    badgeName: 'FocusForge Champion',
    isReached: true,
    daysRemaining: 0,
  };
}

/**
 * Rolls over to next 30-day challenge cycle (e.g. Month 2)
 * Preserves lifetime statistics, earned badges, and past cycle history!
 */
export function startNextChallengeCycle(state: ChallengeState): ChallengeState {
  const nextCycleNumber = state.currentCycle.cycleNumber + 1;
  const title = CHALLENGE_CYCLE_TITLES[nextCycleNumber] || `Month ${nextCycleNumber}: Focus Forge Mastery`;

  const archivedCycle: ChallengeCycle = {
    ...state.currentCycle,
    isCompleted: true,
    completedAt: state.currentCycle.completedAt || new Date().toISOString(),
  };

  const newCycle: ChallengeCycle = {
    cycleNumber: nextCycleNumber,
    title,
    startDate: getTodayDateString(),
    completedChallengeDays: 0,
    completedDates: [],
    dailyGoalMinutes: state.currentCycle.dailyGoalMinutes,
    isCompleted: false,
    completedAt: null,
  };

  return {
    ...state,
    currentCycle: newCycle,
    pastCycles: [archivedCycle, ...state.pastCycles],
    celebrationPending: false,
  };
}
