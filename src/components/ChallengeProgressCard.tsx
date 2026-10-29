import React from 'react';
import {
  Trophy,
  Flame,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { ChallengeState } from '../types/challenge';
import { getNextChallengeMilestone, getTodayDateString } from '../utils/challenge';

interface ChallengeProgressCardProps {
  challengeState: ChallengeState;
  todayFocusMinutes: number;
  onStartNextCycle: () => void;
  onOpenAchievements?: () => void;
  isLight?: boolean;
}

export const ChallengeProgressCard: React.FC<ChallengeProgressCardProps> = ({
  challengeState,
  todayFocusMinutes,
  onStartNextCycle,
  onOpenAchievements,
  isLight = false,
}) => {
  const { currentCycle, lifetimeMinutes, lifetimeSessions, currentStreak, longestStreak } =
    challengeState;
  const completedDays = currentCycle.completedChallengeDays;
  const progressPercent = Math.min(100, Math.round((completedDays / 30) * 100));
  const dailyGoal = currentCycle.dailyGoalMinutes || 60;
  const todayQualified = todayFocusMinutes >= dailyGoal;
  const minutesNeededToday = Math.max(0, dailyGoal - todayFocusMinutes);
  const milestone = getNextChallengeMilestone(completedDays);
  const todayStr = getTodayDateString();

  return (
    <div
      className="relative w-full rounded-2xl border p-5 sm:p-6 overflow-hidden shadow-xl"
      style={{
        backgroundColor: 'var(--theme-bg-card)',
        borderColor: currentCycle.isCompleted ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
        color: 'var(--theme-text-primary)',
        boxShadow: currentCycle.isCompleted ? '0 0 30px var(--theme-accent-glow)' : undefined,
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ backgroundColor: 'var(--theme-accent-primary)' }}
      />

      {/* Top Header: Cycle Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md shrink-0"
            style={{
              backgroundColor: 'var(--theme-accent-glow)',
              borderColor: 'var(--theme-accent-primary)',
              color: 'var(--theme-accent-primary)',
            }}
          >
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-mono tracking-widest uppercase font-bold px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-accent-primary)',
                }}
              >
                CYCLE {currentCycle.cycleNumber} OF 30-DAY CHALLENGE
              </span>
              {currentCycle.isCompleted && (
                <span
                  className="text-[9px] font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--theme-success)',
                    color: '#0B1020',
                  }}
                >
                  Completed!
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight mt-0.5" style={{ color: 'var(--theme-text-primary)' }}>
              {currentCycle.title}
            </h3>
          </div>
        </div>

        {/* Milestone Indicator Badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border self-start sm:self-auto text-xs font-mono"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />
          <span style={{ color: 'var(--theme-text-secondary)' }}>Next:</span>
          <span className="font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
            {milestone.title}
          </span>
          <span
            className="px-1.5 py-0.2 rounded text-[10px] font-bold"
            style={{
              backgroundColor: 'var(--theme-accent-glow)',
              color: 'var(--theme-accent-primary)',
            }}
          >
            {milestone.isReached ? 'Achieved!' : `${milestone.daysRemaining}d left`}
          </span>
        </div>
      </div>

      {/* Main Grid: Progress Bar, 30-Day Matrix & Stats Strip */}
      <div className="py-5 space-y-5">
        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
                Day {completedDays}
              </span>
              <span className="text-sm font-mono font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                / 30 Days Completed
              </span>
            </div>
            <div className="text-right">
              <span
                className="text-xl sm:text-2xl font-extrabold font-mono"
                style={{ color: 'var(--theme-accent-primary)' }}
              >
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Glowing Progress Track */}
          <div
            className="w-full h-3 rounded-full overflow-hidden border p-0.5"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--theme-accent-primary)',
                boxShadow: '0 0 14px var(--theme-accent-glow)',
              }}
            />
          </div>
        </div>

        {/* 30-Day Visual Stamp Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
            <span>30-DAY DISCIPLINE CALENDAR</span>
            <span>Requirement: {dailyGoal} min / day</span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 gap-1 sm:gap-1.5">
            {Array.from({ length: 30 }).map((_, idx) => {
              const dayNum = idx + 1;
              const isEarned = dayNum <= completedDays;
              const isCurrentTarget = dayNum === completedDays + 1;

              return (
                <div
                  key={dayNum}
                  className={`h-7 sm:h-8 rounded-lg flex flex-col items-center justify-center font-mono text-[9px] font-bold border transition-all ${
                    isCurrentTarget && !currentCycle.isCompleted ? 'ring-1' : ''
                  }`}
                  style={{
                    backgroundColor: isEarned
                      ? 'var(--theme-accent-primary)'
                      : isCurrentTarget
                      ? 'var(--theme-accent-glow)'
                      : 'var(--theme-bg-elevated)',
                    color: isEarned
                      ? isLight
                        ? '#FFFFFF'
                        : '#0B1020'
                      : isCurrentTarget
                      ? 'var(--theme-accent-primary)'
                      : 'var(--theme-text-secondary)',
                    borderColor: isEarned
                      ? 'var(--theme-accent-primary)'
                      : isCurrentTarget
                      ? 'var(--theme-accent-primary)'
                      : 'var(--theme-border)',
                    boxShadow: isEarned ? '0 0 8px var(--theme-accent-glow)' : undefined,
                  }}
                  title={`Day ${dayNum}: ${isEarned ? 'Completed' : isCurrentTarget ? 'In Progress Today' : 'Upcoming'}`}
                >
                  {isEarned ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{dayNum}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Summary Telemetry Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Pillar 1: Consecutive Streak */}
          <div
            className="p-3.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--theme-accent-primary)' }} />
              <span className="text-[9px] font-mono tracking-wider uppercase font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
                Current Streak
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
                {currentStreak}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                days
              </span>
            </div>
            <p className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
              Best: {longestStreak} days
            </p>
          </div>

          {/* Pillar 2: Today Goal Status */}
          <div
            className="p-3.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: todayQualified ? 'var(--theme-success)' : 'var(--theme-border)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5" style={{ color: todayQualified ? 'var(--theme-success)' : 'var(--theme-accent-primary)' }} />
              <span className="text-[9px] font-mono tracking-wider uppercase font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
                Today's Goal
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold font-mono" style={{ color: todayQualified ? 'var(--theme-success)' : 'var(--theme-text-primary)' }}>
                {todayFocusMinutes}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                / {dailyGoal}m
              </span>
            </div>
            <p
              className="text-[9px] font-mono mt-0.5 truncate font-medium"
              style={{ color: todayQualified ? 'var(--theme-success)' : 'var(--theme-text-secondary)' }}
            >
              {todayQualified ? '✓ Day Goal Reached' : `${minutesNeededToday}m more to advance`}
            </p>
          </div>

          {/* Pillar 3: Lifetime Minutes */}
          <div
            className="p-3.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />
              <span className="text-[9px] font-mono tracking-wider uppercase font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
                Total Focus
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
                {lifetimeMinutes}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                min
              </span>
            </div>
            <p className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
              {(lifetimeMinutes / 60).toFixed(1)} verified hours
            </p>
          </div>

          {/* Pillar 4: Total Sessions */}
          <div
            className="p-3.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />
              <span className="text-[9px] font-mono tracking-wider uppercase font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
                Completed Blocks
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
                {lifetimeSessions}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                sessions
              </span>
            </div>
            <p className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
              Real completed sprints
            </p>
          </div>
        </div>
      </div>

      {/* Completion Banner (when Day 30 is reached) */}
      {currentCycle.isCompleted && (
        <div
          className="mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-accent-primary)',
          }}
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
              style={{
                backgroundColor: 'var(--theme-accent-glow)',
                borderColor: 'var(--theme-accent-primary)',
                color: 'var(--theme-accent-primary)',
              }}
            >
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                Challenge Conquered! FocusForge Champion Unlocked
              </h4>
              <p className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                You have forged 30 genuine discipline days. Your lifetime records and badges are permanent.
              </p>
            </div>
          </div>

          <button
            onClick={onStartNextCycle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: 'var(--theme-accent-primary)',
              color: isLight ? '#FFFFFF' : '#0B1020',
              boxShadow: '0 4px 16px var(--theme-accent-glow)',
            }}
          >
            <span>Start Month {currentCycle.cycleNumber + 1} Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
