import { ACHIEVEMENTS_LIST } from '../constants/achievements';
import { AchievementDefinition, AchievementId, UserAchievementRecord } from '../types/achievement';
import { ChallengeState } from '../types/challenge';
import { SessionRecord } from '../types/timer';

export interface EvaluatedAchievement extends AchievementDefinition {
  unlocked: boolean;
  unlockedAt: number | null;
  progress: number;
}

/**
 * Evaluates all achievements against current user sessions and challenge state
 */
export function evaluateAchievements(
  sessions: SessionRecord[],
  challengeState: ChallengeState,
  storedUnlockedMap: Record<string, number> = {} // id -> unlockedAt timestamp
): {
  evaluatedList: EvaluatedAchievement[];
  newlyUnlockedIds: AchievementId[];
} {
  const focusSessions = sessions.filter((s) => s.mode === 'focus');
  const totalFocusSessions = focusSessions.length;
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const currentStreak = challengeState.currentStreak;
  const completedChallengeDays = challengeState.currentCycle.completedChallengeDays;
  const currentCycleNumber = challengeState.currentCycle.cycleNumber;

  const evaluatedList: EvaluatedAchievement[] = [];
  const newlyUnlockedIds: AchievementId[] = [];
  const now = Date.now();

  for (const def of ACHIEVEMENTS_LIST) {
    let progress = 0;
    let shouldUnlock = false;

    switch (def.id) {
      case 'first-focus':
        progress = Math.min(def.maxProgress, totalFocusSessions);
        shouldUnlock = totalFocusSessions >= 1;
        break;

      case 'getting-started':
        progress = Math.min(def.maxProgress, currentStreak);
        shouldUnlock = currentStreak >= 3;
        break;

      case 'one-week-warrior':
        progress = Math.min(def.maxProgress, currentStreak);
        shouldUnlock = currentStreak >= 7;
        break;

      case 'two-week-discipline':
        progress = Math.min(def.maxProgress, currentStreak);
        shouldUnlock = currentStreak >= 14;
        break;

      case 'focusforge-champion':
        progress = Math.min(def.maxProgress, completedChallengeDays);
        shouldUnlock = completedChallengeDays >= 30;
        break;

      case 'focus-master':
        progress = Math.min(def.maxProgress, totalFocusSessions);
        shouldUnlock = totalFocusSessions >= 100;
        break;

      case 'deep-work-legend':
        progress = Math.min(def.maxProgress, totalFocusMinutes);
        shouldUnlock = totalFocusMinutes >= 1000;
        break;

      case 'consistency-legend':
        progress = Math.min(def.maxProgress, currentStreak);
        shouldUnlock = currentStreak >= 30;
        break;

      case 'month-2-titan':
        if (currentCycleNumber >= 2) {
          progress = Math.min(def.maxProgress, completedChallengeDays);
          shouldUnlock = completedChallengeDays >= 15;
        } else {
          progress = 0;
          shouldUnlock = false;
        }
        break;

      case 'flow-virtuoso':
        progress = Math.min(def.maxProgress, totalFocusMinutes);
        shouldUnlock = totalFocusMinutes >= 2500;
        break;

      default:
        progress = 0;
        shouldUnlock = false;
    }

    const previouslyUnlockedAt = storedUnlockedMap[def.id] || null;
    const isUnlocked = Boolean(previouslyUnlockedAt) || shouldUnlock;
    const unlockedAt = previouslyUnlockedAt || (shouldUnlock ? now : null);

    if (shouldUnlock && !previouslyUnlockedAt) {
      newlyUnlockedIds.push(def.id);
    }

    evaluatedList.push({
      ...def,
      unlocked: isUnlocked,
      unlockedAt,
      progress: isUnlocked ? def.maxProgress : progress,
    });
  }

  return { evaluatedList, newlyUnlockedIds };
}
