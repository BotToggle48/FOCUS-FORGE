export interface ChallengeCycle {
  cycleNumber: number; // 1, 2, 3...
  title: string; // e.g. "Month 1: Foundation of Iron", "Month 2: Unyielding Discipline"
  startDate: string; // YYYY-MM-DD
  completedChallengeDays: number; // 0 to 30
  completedDates: string[]; // YYYY-MM-DD calendar dates where daily goal was met
  dailyGoalMinutes: number; // e.g. 60
  isCompleted: boolean;
  completedAt: string | null;
}

export interface ChallengeMilestone {
  day: number;
  title: string;
  badgeName: string;
  isReached: boolean;
  daysRemaining: number;
}

export interface ChallengeState {
  currentCycle: ChallengeCycle;
  pastCycles: ChallengeCycle[];
  lifetimeMinutes: number;
  lifetimeSessions: number;
  currentStreak: number; // consecutive qualifying calendar days
  longestStreak: number;
  lastQualifyingDate: string | null; // YYYY-MM-DD
  celebrationPending: boolean;
}
