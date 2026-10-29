import React from 'react';
import { CheckCircle2, Target, Calendar, Trophy, Zap } from 'lucide-react';
import { ChallengeState } from '../../types/challenge';

interface GoalsViewProps {
  todayFocusMinutes: number;
  dailyGoalMinutes: number;
  todaySessionsCount: number;
  targetSessionsToday?: number;
  thisWeekMinutes: number;
  challengeState: ChallengeState;
  isLight?: boolean;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  todayFocusMinutes = 0,
  dailyGoalMinutes = 60,
  todaySessionsCount = 0,
  targetSessionsToday = 4,
  thisWeekMinutes = 0,
  challengeState,
  isLight = false,
}) => {
  const completedChallengeDays = challengeState.currentCycle.completedChallengeDays;
  const weeklyTarget = dailyGoalMinutes * 5; // e.g. 300 min/week

  const goals = [
    {
      id: '1',
      title: 'Daily Deep Work Threshold',
      description: 'Minimum verified focus required to qualify for the 30-day challenge stamp.',
      current: todayFocusMinutes,
      target: dailyGoalMinutes,
      unit: 'min',
      period: 'Today',
      icon: Target,
    },
    {
      id: '2',
      title: 'Complete Target Focus Sprints',
      description: 'Structured Pomodoro cadence to avoid burnout and maintain cognitive momentum.',
      current: todaySessionsCount,
      target: targetSessionsToday,
      unit: 'sessions',
      period: 'Today',
      icon: Zap,
    },
    {
      id: '3',
      title: 'Weekly Focus Volume Target',
      description: 'Aggregated cognitive output logged across the rolling 7-day period.',
      current: thisWeekMinutes,
      target: weeklyTarget,
      unit: 'min',
      period: 'This Week',
      icon: Calendar,
    },
    {
      id: '4',
      title: '30-Day Discipline Milestone',
      description: 'Consecutive or qualifying calendar days stamped towards the month codex.',
      current: completedChallengeDays,
      target: 30,
      unit: 'days',
      period: 'Challenge',
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2" style={{ color: 'var(--theme-text-primary)' }}>
      <div className="pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Active Productivity Goals</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
          Real goals calculated against your verified focus sessions and 30-day challenge progression.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current / Math.max(1, goal.target)) * 100));
          const isComplete = pct >= 100;
          const Icon = goal.icon;

          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl border shadow-xl space-y-3.5 transition-all"
              style={{
                backgroundColor: 'var(--theme-bg-card)',
                borderColor: isComplete ? 'var(--theme-success)' : 'var(--theme-border)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isComplete ? 'rgba(67, 217, 163, 0.15)' : 'var(--theme-bg-elevated)',
                      borderColor: isComplete ? 'var(--theme-success)' : 'var(--theme-border)',
                      color: isComplete ? 'var(--theme-success)' : 'var(--theme-accent-primary)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className="text-[9px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: 'var(--theme-bg-elevated)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-secondary)',
                      }}
                    >
                      {goal.period}
                    </span>
                    <h3 className="text-sm font-bold mt-1" style={{ color: 'var(--theme-text-primary)' }}>
                      {goal.title}
                    </h3>
                  </div>
                </div>

                {isComplete && (
                  <span className="p-1 rounded-full text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                  </span>
                )}
              </div>

              <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                {goal.description}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span style={{ color: 'var(--theme-text-secondary)' }}>
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: isComplete ? 'var(--theme-success)' : 'var(--theme-accent-primary)' }}
                  >
                    {pct}%
                  </span>
                </div>

                <div
                  className="w-full h-2 rounded-full overflow-hidden border"
                  style={{
                    backgroundColor: 'var(--theme-bg-elevated)',
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isComplete ? 'var(--theme-success)' : 'var(--theme-accent-primary)',
                      boxShadow: isComplete ? '0 0 8px rgba(67, 217, 163, 0.4)' : '0 0 8px var(--theme-accent-glow)',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
