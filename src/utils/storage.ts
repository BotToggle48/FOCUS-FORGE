import { SessionRecord, TimerSettings } from '../types/timer';
import { Task } from '../types/task';
import { DEFAULT_THEME_ID, THEME_PRESETS } from '../constants/themes';
import { ThemePresetId, ThemeCustomization } from '../types/theme';
import { ChallengeState } from '../types/challenge';
import {
  createInitialChallengeState,
  DEFAULT_DAILY_GOAL_MINUTES,
  syncChallengeStateWithSessions,
  groupFocusMinutesByDate,
} from './challenge';

export const STORAGE_KEYS = {
  THEME: 'focusspace_theme_id',
  THEME_CUSTOMIZATION: 'focusspace_theme_customization_v2',
  SETTINGS: 'focusspace_timer_settings',
  TASKS: 'focusspace_tasks_list',
  ACTIVE_TASK_ID: 'focusspace_active_task_id',
  SESSION_HISTORY: 'focusspace_session_records',
  CUSTOM_WALLPAPERS: 'focusspace_custom_wallpapers',
  SPOTIFY_URL: 'focusspace_spotify_url',
  CHALLENGE_STATE: 'focusforge_challenge_state_v1',
  UNLOCKED_ACHIEVEMENTS: 'focusforge_unlocked_achievements_v1',
  CELEBRATIONS_MUTED: 'focusforge_celebrations_muted',
};

export const DEFAULT_THEME_CUSTOMIZATION: ThemeCustomization = {
  activeThemeId: 'midnight-aurora',
  customAccentColor: null,
  ambientPresetId: 'none',
  ambientDimming: 0.65,
  enableAmbientVisuals: false,
};

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  chimeSound: 'bowl',
  soundVolume: 0.7,
  ambientVolume: 0.5,
  ambientSound: 'none',
  backgroundOverlayOpacity: 0.65,
  enableNotifications: false,
  timerFont: 'sans',
  timerSize: 'standard',
  spotifyUrl: '',
};

export function getStoredThemeCustomization(): ThemeCustomization {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.THEME_CUSTOMIZATION);
    if (val) {
      const parsed = JSON.parse(val);
      if (parsed && parsed.activeThemeId && THEME_PRESETS[parsed.activeThemeId as ThemePresetId]) {
        return { ...DEFAULT_THEME_CUSTOMIZATION, ...parsed };
      }
    }
  } catch (e) {
    console.warn('LocalStorage error reading theme customization:', e);
  }
  return DEFAULT_THEME_CUSTOMIZATION;
}

export function setStoredThemeCustomization(config: ThemeCustomization) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_CUSTOMIZATION, JSON.stringify(config));
  } catch (e) {
    console.warn('LocalStorage error writing theme customization:', e);
  }
}

export function getStoredTheme(): ThemePresetId {
  try {
    const custom = getStoredThemeCustomization();
    if (custom.activeThemeId && THEME_PRESETS[custom.activeThemeId]) {
      return custom.activeThemeId;
    }
    const val = localStorage.getItem(STORAGE_KEYS.THEME);
    if (val && THEME_PRESETS[val as ThemePresetId]) return val as ThemePresetId;
  } catch (e) {
    console.warn('LocalStorage error reading theme:', e);
  }
  return DEFAULT_THEME_ID;
}

export function setStoredTheme(themeId: ThemePresetId) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, themeId);
    const existing = getStoredThemeCustomization();
    setStoredThemeCustomization({ ...existing, activeThemeId: themeId });
  } catch (e) {
    console.warn('LocalStorage error writing theme:', e);
  }
}

export function getStoredSettings(): TimerSettings {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (val) {
      const parsed = JSON.parse(val);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('LocalStorage error reading settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function setStoredSettings(settings: TimerSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('LocalStorage error writing settings:', e);
  }
}

export function getStoredTasks(): Task[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.filter((t: Task) => !t.id?.startsWith('demo-'));
      }
    }
  } catch (e) {
    console.warn('LocalStorage error reading tasks:', e);
  }
  return [];
}

export function setStoredTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.warn('LocalStorage error writing tasks:', e);
  }
}

export function getStoredActiveTaskId(): string | null {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    if (id && id.startsWith('demo-')) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
      return null;
    }
    return id;
  } catch {
    return null;
  }
}

export function setStoredActiveTaskId(id: string | null) {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    }
  } catch (e) {
    console.warn('LocalStorage error writing active task:', e);
  }
}

export function getStoredSessions(): SessionRecord[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        // Strip out any legacy synthetic dummy sessions
        return parsed.filter((s: SessionRecord) => !s.id?.startsWith('init-') && !s.id?.startsWith('demo-'));
      }
    }
  } catch (e) {
    console.warn('LocalStorage error reading sessions:', e);
  }
  return [];
}

export function appendStoredSession(session: SessionRecord): SessionRecord[] {
  try {
    const sessions = getStoredSessions();
    // Guard against duplicate session insertions
    if (sessions.some((s) => s.id === session.id)) {
      return sessions;
    }
    const updated = [session, ...sessions];
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage error appending session:', e);
    return [];
  }
}

export function clearStoredSessions() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_HISTORY);
  } catch (e) {
    console.warn('LocalStorage error clearing sessions:', e);
  }
}

// ---------------- CHALLENGE PERSISTENCE ----------------

export function getStoredChallengeState(): ChallengeState {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CHALLENGE_STATE);
    if (val) {
      const parsed = JSON.parse(val);
      if (parsed && parsed.currentCycle && typeof parsed.currentCycle.cycleNumber === 'number') {
        const sessions = getStoredSessions();
        return syncChallengeStateWithSessions(parsed, sessions);
      }
    }
  } catch (e) {
    console.warn('LocalStorage error reading challenge state:', e);
  }

  // Derive initial state synced with genuine sessions
  const sessions = getStoredSessions();
  const initial = createInitialChallengeState(DEFAULT_DAILY_GOAL_MINUTES);
  return syncChallengeStateWithSessions(initial, sessions);
}

export function setStoredChallengeState(state: ChallengeState) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGE_STATE, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage error writing challenge state:', e);
  }
}

// ---------------- ACHIEVEMENTS PERSISTENCE ----------------

export function getStoredUnlockedAchievements(): Record<string, number> {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS);
    if (val) {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage error reading unlocked achievements:', e);
  }
  return {};
}

export function setStoredUnlockedAchievements(unlockedMap: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS, JSON.stringify(unlockedMap));
  } catch (e) {
    console.warn('LocalStorage error writing unlocked achievements:', e);
  }
}

export function getStoredCelebrationMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.CELEBRATIONS_MUTED) === 'true';
  } catch {
    return false;
  }
}

export function setStoredCelebrationMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEYS.CELEBRATIONS_MUTED, muted ? 'true' : 'false');
  } catch (e) {
    console.warn('LocalStorage error writing celebration muted:', e);
  }
}

// ---------------- RESET PROGRESS ----------------

/**
 * Completely resets user's challenge progress, session history, streaks, and unlocked badges.
 * Preserves user settings, themes, music settings, and tasks.
 */
export function clearAllUserProgress(): {
  sessions: SessionRecord[];
  challengeState: ChallengeState;
  unlockedAchievements: Record<string, number>;
} {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGE_STATE);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_ACHIEVEMENTS);
  } catch (e) {
    console.warn('LocalStorage error clearing progress:', e);
  }

  const freshChallengeState = createInitialChallengeState(DEFAULT_DAILY_GOAL_MINUTES);
  return {
    sessions: [],
    challengeState: freshChallengeState,
    unlockedAchievements: {},
  };
}

// ---------------- STATS HELPER ----------------

export function calculateProductivityStats(
  sessions: SessionRecord[],
  tasks: Task[],
  dailyGoalMinutes: number = DEFAULT_DAILY_GOAL_MINUTES,
  challengeStreak?: number
) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Sessions completed today
  const todayFocusSessions = sessions.filter(
    (s) => s.mode === 'focus' && s.timestamp >= startOfToday
  );
  const focusSessionsToday = todayFocusSessions.length;
  const totalFocusMinutesToday = todayFocusSessions.reduce(
    (acc, curr) => acc + (curr.durationMinutes || 0),
    0
  );

  // Total completed tasks
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // Streak: use challengeStreak if provided, else compute
  const dailyMap = groupFocusMinutesByDate(sessions);
  const qualifyingDates = new Set<string>();
  for (const [dateStr, minutes] of Object.entries(dailyMap)) {
    if (minutes >= dailyGoalMinutes) {
      qualifyingDates.add(dateStr);
    }
  }

  let streak = challengeStreak ?? 0;
  if (challengeStreak === undefined) {
    const cursor = new Date(now);
    const todayStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    if (qualifyingDates.has(todayStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (true) {
      const dStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      if (qualifyingDates.has(dStr)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Weekly activity (last 7 days, Mon - Sun or past 7 days)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const past7Days: { dateStr: string; label: string; minutes: number; count: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 86400000;
    const label = i === 0 ? 'Today' : daysOfWeek[d.getDay()];

    const daySessions = sessions.filter(
      (s) => s.mode === 'focus' && s.timestamp >= dayStart && s.timestamp < dayEnd
    );
    const minutes = daySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

    past7Days.push({
      dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      label,
      minutes,
      count: daySessions.length,
    });
  }

  const thisWeekMinutes = past7Days.reduce((acc, curr) => acc + curr.minutes, 0);

  // Productivity score (0 if brand new, else 0 to 100 based on goal fulfillment)
  let productivityScore = 0;
  if (totalFocusMinutesToday > 0 || streak > 0 || completedTasksCount > 0) {
    const goalRatio = Math.min(1, totalFocusMinutesToday / Math.max(1, dailyGoalMinutes));
    const goalPts = goalRatio * 60;
    const streakPts = Math.min(20, streak * 5);
    const taskPts = completedTasksCount > 0 ? 20 : 0;
    productivityScore = Math.min(100, Math.round(goalPts + streakPts + taskPts));
  }

  // Completion rate (only genuine completed sessions are recorded)
  const completionRate = sessions.length > 0 ? 100 : 0;

  // Real today hourly distribution curve points [08:00, 12:00, 16:00, 20:00, NOW]
  const todayHourBuckets = [8, 12, 16, 20, 24];
  const hourlyPoints: number[] = [0, 0, 0, 0, 0];
  let cumulative = 0;

  todayFocusSessions
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((s) => {
      const sessionDate = new Date(s.timestamp);
      const sessionHour = sessionDate.getHours() + sessionDate.getMinutes() / 60;
      cumulative += s.durationMinutes || 0;
      for (let i = 0; i < todayHourBuckets.length; i++) {
        if (sessionHour <= todayHourBuckets[i] && hourlyPoints[i] === 0) {
          hourlyPoints[i] = cumulative;
        }
      }
    });

  // Fill in cumulative progress
  for (let i = 0; i < hourlyPoints.length; i++) {
    if (i > 0 && hourlyPoints[i] < hourlyPoints[i - 1]) {
      hourlyPoints[i] = hourlyPoints[i - 1];
    }
  }
  hourlyPoints[hourlyPoints.length - 1] = totalFocusMinutesToday;

  // Compare today to average minutes of previous days
  const previousDays = Object.entries(dailyMap).filter(([dateStr]) => {
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return dateStr !== todayStr;
  });

  let vsAvgMinutes = 0;
  if (previousDays.length > 0) {
    const prevSum = previousDays.reduce((acc, [, mins]) => acc + mins, 0);
    const avg = Math.round(prevSum / previousDays.length);
    vsAvgMinutes = totalFocusMinutesToday - avg;
  }

  return {
    focusSessionsToday,
    totalFocusMinutesToday,
    completedTasksCount,
    streak,
    past7Days,
    thisWeekMinutes,
    productivityScore,
    completionRate,
    hourlyPoints,
    vsAvgMinutes,
  };
}
