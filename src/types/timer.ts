export type SessionMode = 'focus' | 'shortBreak' | 'longBreak';

export type TimerFont = 'digital' | 'sans' | 'serif' | 'mono' | 'rounded' | 'grotesk' | 'thin' | 'bold';
export type TimerSize = 'standard' | 'large' | 'xl';

export interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // default 4
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  chimeSound: 'bowl' | 'marimba' | 'beep' | 'gong';
  soundVolume: number; // 0 to 1
  ambientVolume: number; // 0 to 1
  ambientSound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe';
  backgroundOverlayOpacity: number; // 0.1 to 0.8
  enableNotifications: boolean;
  timerFont: TimerFont;
  timerSize: TimerSize;
  spotifyUrl: string;
}

export interface SessionRecord {
  id: string;
  timestamp: number; // ms
  mode: SessionMode;
  durationMinutes: number;
  taskId?: string;
  taskTitle?: string;
}

export interface PomodoroState {
  mode: SessionMode;
  status: 'idle' | 'running' | 'paused';
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  completedCycles: number; // 0 to longBreakInterval
  sessionsCompletedToday: number;
}
