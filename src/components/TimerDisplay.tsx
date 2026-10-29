import React from 'react';
import { RotateCcw, SkipForward, Play, Pause } from 'lucide-react';
import { SessionMode, TimerFont, TimerSettings } from '../types/timer';
import { ThemeConfig } from '../types/theme';
import { Task } from '../types/task';

interface TimerDisplayProps {
  mode: SessionMode;
  status: 'idle' | 'running' | 'paused';
  timeLeft: number;
  totalDuration: number;
  progressPercent: number;
  completedCycles: number;
  sessionsCompletedToday: number;
  activeTask: Task | null;
  settings: TimerSettings;
  theme: ThemeConfig;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSwitchMode: (newMode: SessionMode) => void;
  onCycleFont?: () => void;
  showInlineControls?: boolean;
}

const FONT_CLASS_MAP: Record<TimerFont, string> = {
  digital: 'font-timer-digital',
  sans: 'font-timer-sans',
  serif: 'font-timer-serif',
  mono: 'font-timer-mono',
  rounded: 'font-timer-rounded',
  grotesk: 'font-timer-grotesk',
  thin: 'font-timer-thin',
  bold: 'font-timer-bold',
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  mode,
  status,
  timeLeft,
  progressPercent,
  activeTask,
  settings,
  theme: _theme,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  showInlineControls = false,
}) => {
  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Dimensions matching the reference screenshot
  const svgSize = 380;
  const strokeWidth = 8;
  const center = svgSize / 2;
  const radius = center - strokeWidth * 2.5;
  const circumference = 2 * Math.PI * radius;
  // Dashoffset calculation
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const modeBadgeText = {
    focus: activeTask ? activeTask.title : 'Focus session',
    shortBreak: 'Short break',
    longBreak: 'Long break',
  }[mode];

  const selectedFontClass = FONT_CLASS_MAP[settings.timerFont || 'sans'] || 'font-timer-sans';

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Centerpiece Circular Glow Ring */}
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] flex items-center justify-center">
        {/* Subtle Ambient Radial Backlight Glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl pointer-events-none transform scale-90" />

        {/* SVG Progress Circle */}
        <svg
          className="w-full h-full -rotate-90 transform drop-shadow-[0_0_22px_rgba(75,143,226,0.45)] transition-all duration-300"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          <defs>
            <linearGradient id="timerNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={strokeWidth}
          />

          {/* Animated Countdown Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="url(#timerNeonGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#neonGlow)"
            className="transition-[stroke-dashoffset] duration-700 ease-linear"
          />
        </svg>

        {/* Central Content (Digits + Session Badge) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-auto">
          {/* Big, Razor-Sharp Timer Digits matching screenshot */}
          <h1
            className={`${selectedFontClass} text-6xl sm:text-7xl md:text-[84px] font-semibold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] transition-all`}
          >
            {timeFormatted}
          </h1>

          {/* Session Indicator Pill Badge directly beneath digits */}
          <div className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-sm text-xs text-white/90 max-w-[220px] truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse shrink-0" />
            <span className="truncate tracking-wide font-normal">{modeBadgeText}</span>
          </div>

          {/* Subtle Hover Controls for Skip and Reset */}
          <div className="absolute bottom-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onReset}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onSkip}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
              title="Skip to next session"
              aria-label="Skip to next session"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Optional fallback inline buttons if requested (e.g. on small screen or zen mode) */}
      {showInlineControls && (
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={status === 'running' ? onPause : (status === 'paused' ? onResume : onStart)}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#4b8fe2] hover:bg-[#3b82f6] text-white font-medium shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            {status === 'running' ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{status === 'running' ? 'Pause' : 'Start'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
