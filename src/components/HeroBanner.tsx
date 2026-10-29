import React, { useMemo } from 'react';
import { Play, Pause, ExternalLink, Flame } from 'lucide-react';

interface HeroBannerProps {
  timerStatus: 'idle' | 'running' | 'paused';
  timeLeftFormatted: string;
  focusMinutesToday: number;
  streakDays: number;
  bestStreakDays: number;
  completedSessionsToday: number;
  targetSessionsToday?: number;
  challengeDay: number;
  nextSessionMinutes?: number;
  onToggleTimer: () => void;
  onOpenTimerView: () => void;
  isLight?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  timerStatus,
  timeLeftFormatted,
  focusMinutesToday,
  streakDays,
  bestStreakDays,
  completedSessionsToday,
  targetSessionsToday = 4,
  challengeDay = 0,
  nextSessionMinutes = 25,
  onToggleTimer,
  onOpenTimerView,
  isLight = false,
}) => {
  const { dateGreeting } = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    let greeting = 'GOOD EVENING';
    if (hours < 12) greeting = 'GOOD MORNING';
    else if (hours < 17) greeting = 'GOOD AFTERNOON';

    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const monthName = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const dateNum = now.getDate();

    return {
      dateGreeting: `${dayName}, ${monthName} ${dateNum} • ${greeting}`,
    };
  }, []);

  const progressTodayPercent = Math.min(
    100,
    Math.round((completedSessionsToday / Math.max(1, targetSessionsToday)) * 100)
  );

  return (
    <div
      className="relative w-full rounded-2xl border p-5 sm:p-7 overflow-hidden shadow-xl"
      style={{
        backgroundColor: 'var(--theme-bg-card)',
        borderColor: 'var(--theme-border)',
        color: 'var(--theme-text-primary)',
      }}
    >
      {/* Subtle ambient accent glow */}
      <div
        className="absolute -top-12 -right-12 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: 'var(--theme-accent-primary)' }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Headline & Stats */}
        <div className="space-y-4 max-w-2xl">
          {/* Subheading Date & Greeting */}
          <p
            className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-semibold"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {dateGreeting}
          </p>

          {/* Heading: Every Focus Session Builds a Stronger You. */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Every{' '}
            <span
              className="inline-block px-3 py-0.5 rounded-lg shadow-md transform -rotate-1 font-bold"
              style={{
                backgroundColor: 'var(--theme-accent-primary)',
                color: isLight ? '#FFFFFF' : '#0B1020',
                boxShadow: '0 4px 14px var(--theme-accent-glow)',
              }}
            >
              Focus
            </span>{' '}
            Session Builds a Stronger You.
          </h2>

          {/* 4 Real Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono">
                  {focusMinutesToday}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                  min
                </span>
              </div>
              <p
                className="text-[9px] font-mono tracking-wider uppercase mt-0.5"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                Focus Today
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono">
                  {streakDays}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                  days
                </span>
              </div>
              <p
                className="text-[9px] font-mono tracking-wider uppercase mt-0.5"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                Day Streak
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono">
                  Day {challengeDay}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                  /30
                </span>
              </div>
              <p
                className="text-[9px] font-mono tracking-wider uppercase mt-0.5"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                30-Day Challenge
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold font-mono">
                  {nextSessionMinutes}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                  min
                </span>
              </div>
              <p
                className="text-[9px] font-mono tracking-wider uppercase mt-0.5"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                Next Session
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onToggleTimer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-accent-primary)',
                color: isLight ? '#FFFFFF' : '#0B1020',
                boxShadow: '0 4px 14px var(--theme-accent-glow)',
              }}
            >
              {timerStatus === 'running' ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause focus • {timeLeftFormatted}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{timerStatus === 'paused' ? 'Resume' : 'Start'} focus • {timeLeftFormatted}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenTimerView}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer hover:bg-white/[0.08]"
              style={{
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-primary)',
                backgroundColor: 'var(--theme-bg-elevated)',
              }}
            >
              <span>Open timer</span>
              <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Right Side: Two Taped Sticky Note Cards */}
        <div className="flex items-center gap-4 sm:gap-5 self-start lg:self-center">
          {/* Note 1: Today Sessions Circle Gauge */}
          <div
            className="relative w-28 sm:w-32 rounded-xl border p-3 pt-4 shadow-xl flex flex-col items-center text-center"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            {/* Masking tape header on top edge */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 border rounded-sm backdrop-blur-sm transform -rotate-1"
              style={{
                backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.18)',
                borderColor: 'var(--theme-border)',
              }}
            />

            <p
              className="text-[9px] font-mono tracking-widest uppercase font-semibold mb-2"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              TODAY
            </p>

            {/* Circular Gauge */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  strokeWidth="3.5"
                  stroke="var(--theme-border)"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${progressTodayPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="var(--theme-accent-primary)"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                {progressTodayPercent}%
              </span>
            </div>

            <p className="text-[9px] font-mono mt-2" style={{ color: 'var(--theme-text-secondary)' }}>
              {completedSessionsToday} / {targetSessionsToday} SESSIONS
            </p>
          </div>

          {/* Note 2: Streak Display */}
          <div
            className="relative w-28 sm:w-32 rounded-xl border p-3 pt-4 shadow-xl flex flex-col items-center text-center"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            {/* Masking tape header on top edge */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 border rounded-sm backdrop-blur-sm transform rotate-1"
              style={{
                backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.18)',
                borderColor: 'var(--theme-border)',
              }}
            />

            <p
              className="text-[9px] font-mono tracking-widest uppercase font-semibold mb-2"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              STREAK
            </p>

            <div className="flex items-center gap-1.5 my-1">
              <Flame className="w-4 h-4 fill-current" style={{ color: 'var(--theme-accent-primary)' }} />
              <span className="text-2xl font-bold font-mono leading-none" style={{ color: 'var(--theme-text-primary)' }}>
                {streakDays}
              </span>
            </div>

            <p className="text-[9px] font-mono mt-2 uppercase tracking-tight" style={{ color: 'var(--theme-text-secondary)' }}>
              DAYS • BEST: {bestStreakDays}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
