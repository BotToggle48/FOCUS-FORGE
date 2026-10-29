import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings as SettingsIcon,
  ChevronDown,
  CloudRain,
  CloudLightning,
  Trees,
  Waves,
  Flame,
  Coffee,
  Radio,
  Disc,
  Moon,
  Bell,
  Keyboard,
  Fan,
  Droplets,
  Wind,
  Check,
  Plus,
  Target,
  Trophy,
} from 'lucide-react';
import { PacingPreset, PACING_PRESETS, SoundEffectId, SOUND_EFFECTS_META } from '../types/atlas';
import { Task } from '../types/task';
import { proAudio } from '../utils/proAudio';

interface FocusBlockProps {
  status: 'idle' | 'running' | 'paused';
  mode: 'focus' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  totalDuration: number;
  progressPercent: number;
  currentPacing: PacingPreset;
  onSelectPacing: (preset: PacingPreset) => void;
  tasks: Task[];
  activeTask: Task | null;
  onSelectTask: (taskId: string | null) => void;
  onAddTask: (title: string) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onOpenSettings: () => void;
  completedCycles: number;
  currentStreak?: number;
  todayFocusMinutes?: number;
  dailyGoalMinutes?: number;
  challengeDay?: number;
  isLight?: boolean;
}

const ICON_MAP: Record<SoundEffectId, React.ElementType> = {
  rain: CloudRain,
  thunder: CloudLightning,
  forest: Trees,
  waves: Waves,
  fire: Flame,
  cafe: Coffee,
  noise: Radio,
  vinyl: Disc,
  night: Moon,
  bell: Bell,
  keyboard: Keyboard,
  fan: Fan,
  stream: Droplets,
  wind: Wind,
};

export const FocusBlock: React.FC<FocusBlockProps> = ({
  status,
  mode,
  timeLeft,
  progressPercent,
  currentPacing,
  onSelectPacing,
  tasks,
  activeTask,
  onSelectTask,
  onAddTask,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onOpenSettings,
  completedCycles,
  currentStreak = 0,
  todayFocusMinutes = 0,
  dailyGoalMinutes = 60,
  challengeDay = 0,
  isLight = false,
}) => {
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [activeSounds, setActiveSounds] = useState<Set<SoundEffectId>>(new Set(['rain']));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleToggleSound = (id: SoundEffectId) => {
    const isNowActive = proAudio.toggleTrack(id);
    setActiveSounds((prev) => {
      const next = new Set(prev);
      if (isNowActive) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleStopAllSounds = () => {
    proAudio.stopAll();
    setActiveSounds(new Set());
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    onAddTask(newTaskInput.trim());
    setNewTaskInput('');
  };

  const svgSize = 160;
  const strokeWidth = 5;
  const center = svgSize / 2;
  const radius = center - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
  const goalAchievedToday = todayFocusMinutes >= dailyGoalMinutes;

  return (
    <div
      className="relative w-full rounded-2xl border p-5 sm:p-6 overflow-hidden shadow-xl flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--theme-bg-card)',
        borderColor: 'var(--theme-border)',
        color: 'var(--theme-text-primary)',
      }}
    >
      {/* Header & Pacing Preset Buttons */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b"
        style={{ borderColor: 'var(--theme-border)' }}
      >
        <div>
          <p
            className="text-[10px] font-mono tracking-widest uppercase font-semibold"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            FOCUS BLOCK
          </p>
          <h3 className="text-base font-bold tracking-tight">Run a session</h3>
          <p className="text-xs italic" style={{ color: 'var(--theme-text-secondary)' }}>
            Press Space or click play to begin.
          </p>
        </div>

        {/* Pacing Modes Filter Pills */}
        <div
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
          }}
        >
          {(['classic', 'deep', 'sprint', 'marathon', 'custom'] as PacingPreset[]).map((preset) => {
            const config = PACING_PRESETS[preset];
            const isSelected = currentPacing === preset;
            return (
              <button
                key={preset}
                onClick={() => onSelectPacing(preset)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected ? 'var(--theme-accent-primary)' : 'transparent',
                  color: isSelected
                    ? isLight
                      ? '#FFFFFF'
                      : '#0B1020'
                    : 'var(--theme-text-secondary)',
                  fontWeight: isSelected ? 600 : 500,
                  boxShadow: isSelected ? '0 2px 8px var(--theme-accent-glow)' : 'none',
                }}
                title={config.description}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Centerpiece */}
      <div className="py-6 flex flex-col md:flex-row items-center justify-around gap-6">
        {/* Left: Glowing Circular Progress Ring Timer */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
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
              className="transition-[stroke-dashoffset] duration-500 ease-linear"
              style={{
                filter: 'drop-shadow(0 0 8px var(--theme-accent-glow))',
              }}
            />
          </svg>

          {/* Digits & Session Status inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className="text-[10px] font-mono tracking-widest uppercase font-bold"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {mode.toUpperCase()}
            </span>
            <span className="text-3xl font-bold font-mono tracking-tight my-0.5">
              {timeFormatted}
            </span>
            <span
              className="text-[9px] font-mono font-semibold uppercase tracking-wider"
              style={{ color: 'var(--theme-accent-primary)' }}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right: Task selector & Precision Control Dock */}
        <div className="flex-1 max-w-md w-full space-y-3.5">
          {/* Task Dropdown Picker */}
          <div className="relative">
            <button
              onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer group"
              style={{
                backgroundColor: 'var(--theme-bg-elevated)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <div className="min-w-0 flex-1 pr-2">
                <p
                  className="text-[9px] font-mono tracking-widest uppercase font-semibold"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  {activeTask ? 'ACTIVE GOAL' : 'NO TASK SELECTED'}
                </p>
                <p className="text-xs font-medium truncate" style={{ color: 'var(--theme-text-primary)' }}>
                  {activeTask ? activeTask.title : 'Pick a task'}
                </p>
              </div>
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ color: 'var(--theme-text-secondary)' }}
              />
            </button>

            {/* Dropdown Menu */}
            {isTaskDropdownOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-2 z-30 p-2 rounded-xl border shadow-2xl space-y-2 animate-in fade-in duration-150"
                style={{
                  backgroundColor: 'var(--theme-bg-card)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                <form onSubmit={handleCreateTask} className="flex items-center gap-1.5 p-1">
                  <input
                    type="text"
                    placeholder="Create a new task..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--theme-bg-elevated)',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text-primary)',
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg text-white cursor-pointer"
                    style={{ backgroundColor: 'var(--theme-accent-primary)', color: isLight ? '#FFF' : '#0B1020' }}
                    title="Add task"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="max-h-48 overflow-y-auto space-y-1">
                  <button
                    onClick={() => {
                      onSelectTask(null);
                      setIsTaskDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left hover:bg-white/[0.05] cursor-pointer"
                    style={{
                      backgroundColor: activeTask === null ? 'var(--theme-accent-glow)' : 'transparent',
                      color: activeTask === null ? 'var(--theme-accent-primary)' : 'var(--theme-text-primary)',
                      fontWeight: activeTask === null ? 600 : 400,
                    }}
                  >
                    <span>None (Free focus)</span>
                    {activeTask === null && <Check className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />}
                  </button>

                  {tasks.map((task) => {
                    const isSelected = activeTask?.id === task.id;
                    return (
                      <button
                        key={task.id}
                        onClick={() => {
                          onSelectTask(task.id);
                          setIsTaskDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left hover:bg-white/[0.05] cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? 'var(--theme-accent-glow)' : 'transparent',
                          color: isSelected ? 'var(--theme-accent-primary)' : 'var(--theme-text-primary)',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        <span className="truncate">{task.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Compact Streak & Challenge Status Strip (Section 3 Requirement) */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl border text-[11px] font-mono shadow-xs transition-all"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: goalAchievedToday ? 'var(--theme-success)' : 'var(--theme-border)',
            }}
          >
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--theme-accent-primary)' }}>
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>{currentStreak}-day streak</span>
            </div>

            {/* Today Goal Progress */}
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--theme-text-secondary)' }}>Today:</span>
              <span
                className="font-bold"
                style={{
                  color: goalAchievedToday ? 'var(--theme-success)' : 'var(--theme-text-primary)',
                }}
              >
                {todayFocusMinutes} / {dailyGoalMinutes}m
              </span>
              {goalAchievedToday && (
                <span className="text-[10px] px-1 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-300">
                  ✓
                </span>
              )}
            </div>

            {/* Challenge Progress */}
            <div className="flex items-center gap-1" style={{ color: 'var(--theme-text-secondary)' }}>
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>Day</span>
              <span className="font-bold" style={{ color: 'var(--theme-accent-primary)' }}>
                {challengeDay} / 30
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              {/* Reset */}
              <button
                onClick={onResetTimer}
                className="p-2 rounded-xl border transition-all active:scale-95 cursor-pointer hover:bg-white/10"
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-primary)',
                }}
                title="Reset session (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Big Accent Play/Pause Button */}
              <button
                onClick={onToggleTimer}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                style={{
                  backgroundColor: 'var(--theme-accent-primary)',
                  color: isLight ? '#FFFFFF' : '#0B1020',
                  boxShadow: '0 4px 16px var(--theme-accent-glow)',
                }}
                title="Start / Pause (Space)"
              >
                {status === 'running' ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Skip */}
              <button
                onClick={onSkipTimer}
                className="p-2 rounded-xl border transition-all active:scale-95 cursor-pointer hover:bg-white/10"
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-primary)',
                }}
                title="Skip to next session (S)"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Settings Gear */}
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl border transition-all active:scale-95 cursor-pointer hover:bg-white/10"
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-primary)',
                }}
                title="Timer Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Cycle Count */}
            <span
              className="text-[10px] font-mono tracking-wider uppercase font-semibold"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              SESSION {(completedCycles % 4) + 1} OF 4
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Ambient Sound Mixer Strip ("MIX • N ACTIVE") */}
      <div
        className="pt-3 border-t flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: 'var(--theme-border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-mono tracking-widest uppercase font-bold"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            MIX • {activeSounds.size} ACTIVE
          </span>
        </div>

        {/* 14 Soundboard Matrix Icons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SOUND_EFFECTS_META.map((meta) => {
            const Icon = ICON_MAP[meta.id];
            const isActive = activeSounds.has(meta.id);
            return (
              <button
                key={meta.id}
                onClick={() => handleToggleSound(meta.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                style={{
                  backgroundColor: isActive
                    ? 'var(--theme-accent-primary)'
                    : 'var(--theme-bg-elevated)',
                  color: isActive
                    ? isLight
                      ? '#FFFFFF'
                      : '#0B1020'
                    : 'var(--theme-text-secondary)',
                  boxShadow: isActive ? '0 0 8px var(--theme-accent-glow)' : 'none',
                  transform: isActive ? 'scale(1.05)' : 'none',
                }}
                title={`${meta.label} (${isActive ? 'Playing' : 'Off'})`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Stop All Button */}
        <button
          onClick={handleStopAllSounds}
          className="px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider border transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text-secondary)',
          }}
        >
          STOP ALL
        </button>
      </div>
    </div>
  );
};
