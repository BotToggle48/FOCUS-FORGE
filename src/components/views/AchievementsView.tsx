import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Zap,
  Shield,
  Flame,
  Target,
  Award,
  Crown,
  Compass,
  Star,
  CheckCircle2,
  Lock,
  Filter,
} from 'lucide-react';
import { EvaluatedAchievement } from '../../utils/achievements';
import { AchievementTier } from '../../types/achievement';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Zap,
  Shield,
  Flame,
  Trophy,
  Target,
  Award,
  Crown,
  Compass,
  Star,
};

const TIER_COLORS: Record<AchievementTier, { badge: string; border: string; glow: string; text: string }> = {
  bronze: { badge: '#CD7F32', border: '#CD7F32', glow: 'rgba(205, 127, 50, 0.25)', text: '#F4D03F' },
  silver: { badge: '#C0C0C0', border: '#D5D8DC', glow: 'rgba(192, 192, 192, 0.25)', text: '#EBF5FB' },
  gold: { badge: '#F39C12', border: '#F1C40F', glow: 'rgba(243, 156, 18, 0.25)', text: '#F9E79F' },
  platinum: { badge: '#38BDF8', border: '#0284C7', glow: 'rgba(56, 189, 248, 0.25)', text: '#BAE6FD' },
  diamond: { badge: '#43E6C3', border: '#10B981', glow: 'rgba(67, 230, 195, 0.35)', text: '#A7F3D0' },
};

interface AchievementsViewProps {
  achievements: EvaluatedAchievement[];
  isLight?: boolean;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  isLight = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filtered = achievements.filter((item) => {
    if (activeFilter === 'unlocked' && !item.unlocked) return false;
    if (activeFilter === 'locked' && item.unlocked) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2" style={{ color: 'var(--theme-text-primary)' }}>
      {/* Header Banner */}
      <div
        className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: 'var(--theme-accent-primary)' }}
        />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: 'var(--theme-accent-primary)' }} />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">FocusForge Achievements</h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
            LeetCode-style milestones and discipline badges earned through verified focus blocks.
          </p>
        </div>

        {/* Global Progress Strip */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: 'var(--theme-accent-primary)' }}>
                {unlockedCount}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                / {totalCount} Earned
              </span>
            </div>
            <p className="text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
              {completionPercentage}% of Forge Codex Unlocked
            </p>
          </div>

          <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                strokeWidth="3.5"
                stroke="var(--theme-border)"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="var(--theme-accent-primary)"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-bold" style={{ color: 'var(--theme-text-primary)' }}>
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Category Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* State filters */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl border self-start"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
          }}
        >
          {(['all', 'unlocked', 'locked'] as const).map((tab) => {
            const isSel = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize"
                style={{
                  backgroundColor: isSel ? 'var(--theme-accent-primary)' : 'transparent',
                  color: isSel ? (isLight ? '#FFFFFF' : '#0B1020') : 'var(--theme-text-secondary)',
                  fontWeight: isSel ? 600 : 400,
                  boxShadow: isSel ? '0 2px 8px var(--theme-accent-glow)' : 'none',
                }}
              >
                {tab === 'all' ? `All (${totalCount})` : tab === 'unlocked' ? `Unlocked (${unlockedCount})` : `Locked (${totalCount - unlockedCount})`}
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'streak', 'challenge', 'volume', 'milestone'].map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider border transition-colors cursor-pointer capitalize"
                style={{
                  backgroundColor: isSel ? 'var(--theme-bg-elevated)' : 'transparent',
                  borderColor: isSel ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                  color: isSel ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
                  fontWeight: isSel ? 600 : 400,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const Icon = ICON_MAP[item.icon] || Trophy;
          const tierStyle = TIER_COLORS[item.tier];
          const pct = Math.min(100, Math.round((item.progress / Math.max(1, item.maxProgress)) * 100));

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-200 shadow-xl flex flex-col justify-between ${
                item.unlocked ? 'ring-1' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                backgroundColor: 'var(--theme-bg-card)',
                borderColor: item.unlocked ? tierStyle.border : 'var(--theme-border)',
                boxShadow: item.unlocked ? `0 0 20px ${tierStyle.glow}` : undefined,
              }}
            >
              <div>
                {/* Top Row: Medal Icon & Tier Badge */}
                <div className="flex items-start justify-between mb-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md relative"
                    style={{
                      backgroundColor: item.unlocked ? `${tierStyle.border}22` : 'var(--theme-bg-elevated)',
                      borderColor: item.unlocked ? tierStyle.border : 'var(--theme-border)',
                      color: item.unlocked ? tierStyle.border : 'var(--theme-text-secondary)',
                      boxShadow: item.unlocked ? `0 0 12px ${tierStyle.glow}` : undefined,
                    }}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                    {item.unlocked && (
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-black"
                        style={{ backgroundColor: 'var(--theme-success)' }}
                      >
                        <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider border"
                      style={{
                        backgroundColor: `${tierStyle.border}15`,
                        borderColor: tierStyle.border,
                        color: tierStyle.border,
                      }}
                    >
                      {item.tier}
                    </span>
                    <span
                      className="text-[9px] font-mono uppercase tracking-wider"
                      style={{ color: 'var(--theme-text-secondary)' }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                  {item.description}
                </p>
              </div>

              {/* Bottom: Progress or Unlock Date */}
              <div className="pt-4 mt-4 border-t space-y-2" style={{ borderColor: 'var(--theme-border)' }}>
                {item.unlocked ? (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--theme-text-secondary)' }}>
                      {item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString() : 'Permanent'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs font-mono">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                        <Lock className="w-3 h-3" />
                        <span>{item.unlockCondition}</span>
                      </span>
                      <span className="font-bold" style={{ color: 'var(--theme-accent-primary)' }}>
                        {item.progress} / {item.maxProgress} {item.unit}
                      </span>
                    </div>

                    {/* Progress track */}
                    <div
                      className="w-full h-1.5 rounded-full overflow-hidden border"
                      style={{
                        backgroundColor: 'var(--theme-bg-elevated)',
                        borderColor: 'var(--theme-border)',
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: tierStyle.border,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
