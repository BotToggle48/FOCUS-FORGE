import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, ArrowLeft, Maximize2, Image as ImageIcon } from 'lucide-react';
import { SessionMode } from '../../types/timer';

interface TimerViewProps {
  mode: SessionMode;
  status: 'idle' | 'running' | 'paused';
  timeLeft: number;
  totalDuration: number;
  progressPercent: number;
  completedCycles: number;
  activeTaskTitle: string | null;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onBackToDashboard: () => void;
  onToggleZen: () => void;
  isScenicMode: boolean;
  onToggleScenicMode: () => void;
  isLight?: boolean;
}

export const TimerView: React.FC<TimerViewProps> = ({
  mode,
  status,
  timeLeft,
  progressPercent,
  completedCycles,
  activeTaskTitle,
  onStart,
  onPause,
  onReset,
  onSkip,
  onBackToDashboard,
  onToggleZen,
  isScenicMode,
  onToggleScenicMode,
  isLight = false,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const svgSize = 340;
  const strokeWidth = 8;
  const center = svgSize / 2;
  const radius = center - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className="relative min-h-[80vh] flex flex-col justify-between items-center py-8 select-none"
      style={{ color: 'var(--theme-text-primary)' }}
    >
      {/* Top Controls Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between px-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer hover:bg-white/10"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text-primary)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Toggle Scenic Wallpaper Mode */}
          <button
            onClick={onToggleScenicMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer"
            style={{
              backgroundColor: isScenicMode ? 'var(--theme-accent-glow)' : 'var(--theme-bg-card)',
              borderColor: isScenicMode ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
              color: isScenicMode ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
              fontWeight: isScenicMode ? 600 : 500,
            }}
            title="Toggle ambient wallpaper environment"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isScenicMode ? 'Environment: On' : 'Environment'}</span>
          </button>

          {/* Zen Mode */}
          <button
            onClick={onToggleZen}
            className="p-1.5 rounded-xl border text-xs cursor-pointer hover:bg-white/10"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
            title="Zen Fullscreen (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Centerpiece Giant Circular Timer */}
      <div className="relative flex flex-col items-center justify-center my-8">
        <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] flex items-center justify-center">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-0 rounded-full blur-3xl pointer-events-none transform scale-90 opacity-20"
            style={{ backgroundColor: 'var(--theme-accent-primary)' }}
          />

          {/* SVG Progress Circle */}
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="var(--theme-border)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="var(--theme-accent-primary)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-700 ease-linear"
              style={{
                filter: 'drop-shadow(0 0 12px var(--theme-accent-glow))',
              }}
            />
          </svg>

          {/* Central Digits & Pill */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-xs font-mono tracking-widest uppercase font-semibold"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {mode === 'focus' ? 'FOCUS' : mode === 'shortBreak' ? 'SHORT BREAK' : 'LONG BREAK'}
            </span>

            <h1
              className="text-6xl sm:text-7xl font-bold font-mono tracking-tight my-1 drop-shadow-md"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              {timeFormatted}
            </h1>

            <div
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs max-w-[200px] truncate backdrop-blur-md"
              style={{
                backgroundColor: 'var(--theme-bg-card)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-primary)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: 'var(--theme-accent-primary)' }}
              />
              <span className="truncate">{activeTaskTitle || 'Free focus session'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={onReset}
            className="p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer hover:bg-white/10"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
            title="Reset session (R)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={status === 'running' ? onPause : onStart}
            className="px-10 py-3.5 rounded-2xl font-semibold text-sm tracking-wide shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{
              backgroundColor: 'var(--theme-accent-primary)',
              color: isLight ? '#FFFFFF' : '#0B1020',
              boxShadow: '0 4px 18px var(--theme-accent-glow)',
            }}
          >
            {status === 'running' ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={onSkip}
            className="p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer hover:bg-white/10"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
            title="Skip to next (S)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Session Cycle indicator */}
      <div
        className="text-center text-xs font-mono font-medium"
        style={{ color: 'var(--theme-text-secondary)' }}
      >
        Cycle {(completedCycles % 4) + 1} of 4 • {status === 'running' ? 'Focusing' : 'Paused'}
      </div>
    </div>
  );
};
