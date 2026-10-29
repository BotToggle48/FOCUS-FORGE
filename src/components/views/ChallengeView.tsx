import React from 'react';
import { Trophy, Flame, Target, Calendar, CheckCircle2, Award, History, ArrowRight, ShieldCheck } from 'lucide-react';
import { ChallengeState } from '../../types/challenge';
import { ChallengeProgressCard } from '../ChallengeProgressCard';
import { EvaluatedAchievement } from '../../utils/achievements';

interface ChallengeViewProps {
  challengeState: ChallengeState;
  todayFocusMinutes: number;
  onStartNextCycle: () => void;
  achievements: EvaluatedAchievement[];
  onOpenAchievements: () => void;
  isLight?: boolean;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challengeState,
  todayFocusMinutes,
  onStartNextCycle,
  achievements,
  onOpenAchievements,
  isLight = false,
}) => {
  const { currentCycle, pastCycles, lifetimeMinutes, lifetimeSessions, currentStreak, longestStreak } =
    challengeState;

  const challengeBadges = achievements.filter(
    (a) => a.category === 'challenge' || a.category === 'streak' || a.id === 'first-focus'
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2" style={{ color: 'var(--theme-text-primary)' }}>
      {/* 1. Main Interactive 30-Day Progress Card */}
      <ChallengeProgressCard
        challengeState={challengeState}
        todayFocusMinutes={todayFocusMinutes}
        onStartNextCycle={onStartNextCycle}
        onOpenAchievements={onOpenAchievements}
        isLight={isLight}
      />

      {/* 2. Challenge Rules & Mechanics */}
      <div
        className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: 'var(--theme-accent-primary)' }} />
          <h3 className="text-sm sm:text-base font-bold">FocusForge 30-Day Challenge Codex</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div
            className="p-3.5 rounded-xl border space-y-1"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <p className="font-bold flex items-center gap-1.5" style={{ color: 'var(--theme-accent-primary)' }}>
              <span>1. Qualifying Threshold</span>
            </p>
            <p style={{ color: 'var(--theme-text-secondary)' }}>
              A challenge day is stamped ONLY when you complete at least {currentCycle.dailyGoalMinutes || 60} genuine focus minutes on that calendar date.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl border space-y-1"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <p className="font-bold flex items-center gap-1.5" style={{ color: 'var(--theme-accent-primary)' }}>
              <span>2. No Artificial Inflation</span>
            </p>
            <p style={{ color: 'var(--theme-text-secondary)' }}>
              Multiple sessions on the same date contribute to your daily minutes, but advance your 30-day challenge count exactly once per calendar day.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl border space-y-1"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <p className="font-bold flex items-center gap-1.5" style={{ color: 'var(--theme-accent-primary)' }}>
              <span>3. Month Rollover & Legacy</span>
            </p>
            <p style={{ color: 'var(--theme-text-secondary)' }}>
              Completing Day 30 unlocks the FocusForge Champion title and unlocks Month {currentCycle.cycleNumber + 1} with fresh next-month badges while preserving your lifetime stats.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Milestone Badges linked to Challenge */}
      <div
        className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: 'var(--theme-accent-primary)' }} />
            <h3 className="text-sm sm:text-base font-bold">Challenge Milestones</h3>
          </div>
          <button
            onClick={onOpenAchievements}
            className="text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            style={{ color: 'var(--theme-accent-primary)' }}
          >
            <span>View All Badges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {challengeBadges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className="p-3 rounded-xl border flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--theme-bg-elevated)',
                borderColor: badge.unlocked ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                opacity: badge.unlocked ? 1 : 0.75,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold border"
                    style={{
                      borderColor: badge.unlocked ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                      color: badge.unlocked ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
                    }}
                  >
                    {badge.tier}
                  </span>
                  {badge.unlocked ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                      {badge.progress}/{badge.maxProgress}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold truncate" style={{ color: 'var(--theme-text-primary)' }}>
                  {badge.title}
                </h4>
                <p className="text-[10px] mt-0.5 line-clamp-2" style={{ color: 'var(--theme-text-secondary)' }}>
                  {badge.unlockCondition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Past Challenge Cycles History (if any) */}
      {pastCycles.length > 0 && (
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-3 shadow-xl"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" style={{ color: 'var(--theme-accent-primary)' }} />
            <h3 className="text-sm sm:text-base font-bold">Past Completed Cycles</h3>
          </div>

          <div className="space-y-2">
            {pastCycles.map((cycle) => (
              <div
                key={cycle.cycleNumber}
                className="p-3.5 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono border"
                    style={{
                      backgroundColor: 'var(--theme-accent-glow)',
                      borderColor: 'var(--theme-accent-primary)',
                      color: 'var(--theme-accent-primary)',
                    }}
                  >
                    M{cycle.cycleNumber}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                      {cycle.title}
                    </p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                      Completed: {cycle.completedAt ? new Date(cycle.completedAt).toLocaleDateString() : 'Yes'}
                    </p>
                  </div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  30 / 30 Days Achieved
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
