export type ActiveNavView =
  | 'dashboard'
  | 'timer'
  | 'tasks'
  | 'challenge'
  | 'stats'
  | 'goals'
  | 'achievements'
  | 'insights'
  | 'journal'
  | 'reports'
  | 'history'
  | 'tags'
  | 'habits'
  | 'recipes'
  | 'palettes'
  | 'music'
  | 'backups'
  | 'settings'
  | 'help';

export type PacingPreset = 'classic' | 'deep' | 'sprint' | 'marathon' | 'custom';

export interface PacingConfig {
  id: PacingPreset;
  label: string;
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  description: string;
}

export const PACING_PRESETS: Record<PacingPreset, PacingConfig> = {
  classic: {
    id: 'classic',
    label: 'Classic 25/5',
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    description: 'Standard Pomodoro cadence for sustained cognitive energy.',
  },
  deep: {
    id: 'deep',
    label: 'Deep Work 50/10',
    focusMinutes: 50,
    breakMinutes: 10,
    longBreakMinutes: 20,
    description: 'Longer immersion blocks for complex engineering & writing.',
  },
  sprint: {
    id: 'sprint',
    label: 'Sprint 15/3',
    focusMinutes: 15,
    breakMinutes: 3,
    longBreakMinutes: 10,
    description: 'Rapid bursts to power through backlog chores and email.',
  },
  marathon: {
    id: 'marathon',
    label: 'Marathon 90/20',
    focusMinutes: 90,
    breakMinutes: 20,
    longBreakMinutes: 30,
    description: 'Ultradian rhythm block aligned with human peak attention cycles.',
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    description: 'Configurable pacing defined in your personal settings.',
  },
};

export type SoundEffectId =
  | 'rain'
  | 'thunder'
  | 'forest'
  | 'waves'
  | 'fire'
  | 'cafe'
  | 'noise'
  | 'vinyl'
  | 'night'
  | 'bell'
  | 'keyboard'
  | 'fan'
  | 'stream'
  | 'wind';

export interface SoundEffectMeta {
  id: SoundEffectId;
  label: string;
  iconName: string;
  category: 'water' | 'nature' | 'urban' | 'noise';
}

export const SOUND_EFFECTS_META: SoundEffectMeta[] = [
  { id: 'rain', label: 'Rain', iconName: 'CloudRain', category: 'water' },
  { id: 'thunder', label: 'Thunder', iconName: 'CloudLightning', category: 'water' },
  { id: 'forest', label: 'Forest Birds', iconName: 'Trees', category: 'nature' },
  { id: 'waves', label: 'Ocean Waves', iconName: 'Waves', category: 'water' },
  { id: 'fire', label: 'Campfire', iconName: 'Flame', category: 'nature' },
  { id: 'cafe', label: 'Cozy Café', iconName: 'Coffee', category: 'urban' },
  { id: 'noise', label: 'White Noise', iconName: 'Radio', category: 'noise' },
  { id: 'vinyl', label: 'Vinyl Crackle', iconName: 'Disc', category: 'noise' },
  { id: 'night', label: 'Night Crickets', iconName: 'Moon', category: 'nature' },
  { id: 'bell', label: 'Zen Singing Bowl', iconName: 'Bell', category: 'nature' },
  { id: 'keyboard', label: 'Mechanical Keys', iconName: 'Keyboard', category: 'urban' },
  { id: 'fan', label: 'Humming Fan', iconName: 'Fan', category: 'noise' },
  { id: 'stream', label: 'Mountain Stream', iconName: 'Droplets', category: 'water' },
  { id: 'wind', label: 'Alpine Wind', iconName: 'Wind', category: 'nature' },
];

export interface ProductivitySummary {
  dayStreak: number;
  bestStreak: number;
  focusMinutesToday: number;
  sessionsCompletedToday: number;
  targetSessionsToday: number;
  minutesThisWeek: number;
  productivityScore: number; // 0 - 100
  completionRate: number; // 0 - 100%
  vsAverageMinutes: number; // e.g. +18
  hourlyDistribution: number[]; // 24 points or 12 segments for sparkline
}
