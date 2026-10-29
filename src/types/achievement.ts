export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type AchievementId =
  | 'first-focus'
  | 'getting-started'
  | 'one-week-warrior'
  | 'two-week-discipline'
  | 'focusforge-champion'
  | 'focus-master'
  | 'deep-work-legend'
  | 'consistency-legend'
  | 'month-2-titan'
  | 'flow-virtuoso';

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  unlockCondition: string;
  tier: AchievementTier;
  icon: string;
  maxProgress: number;
  unit: string;
  category: 'challenge' | 'volume' | 'streak' | 'milestone';
  cycleRequirement?: number; // e.g. cycle 1, cycle 2
}

export interface UserAchievementRecord {
  id: AchievementId;
  unlocked: boolean;
  unlockedAt: number | null; // timestamp ms
  progress: number;
}
