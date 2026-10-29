import React from 'react';

interface SummaryCardsRowProps {
  dayStreak: number;
  thisWeekMinutes: number;
  productivityScore: number;
  completionRate: number;
}

export const SummaryCardsRow: React.FC<SummaryCardsRowProps> = ({
  dayStreak = 0,
  thisWeekMinutes = 0,
  productivityScore = 0,
  completionRate = 0,
}) => {
  const cardStyle = {
    backgroundColor: 'var(--theme-bg-card)',
    borderColor: 'var(--theme-border)',
    color: 'var(--theme-text-primary)',
  };

  const labelStyle = {
    color: 'var(--theme-text-secondary)',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
      {/* Card 1: Day Streak */}
      <div className="rounded-2xl border p-4 sm:p-5 shadow-xl transition-all" style={cardStyle}>
        <p className="text-[9px] font-mono tracking-widest uppercase font-semibold" style={labelStyle}>
          DAY STREAK
        </p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
            {dayStreak}
          </span>
          <span className="text-xs font-mono" style={labelStyle}>days</span>
        </div>
        <p className="text-[10px] mt-1 font-mono" style={labelStyle}>
          {dayStreak > 0 ? 'Consecutive active days' : 'Start today to begin'}
        </p>
      </div>

      {/* Card 2: This Week */}
      <div className="rounded-2xl border p-4 sm:p-5 shadow-xl transition-all" style={cardStyle}>
        <p className="text-[9px] font-mono tracking-widest uppercase font-semibold" style={labelStyle}>
          THIS WEEK
        </p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
            {thisWeekMinutes}
          </span>
          <span className="text-xs font-mono" style={labelStyle}>Min</span>
        </div>
        <p className="text-[10px] mt-1 font-mono" style={labelStyle}>
          Last 7 calendar days
        </p>
      </div>

      {/* Card 3: Productivity */}
      <div className="rounded-2xl border p-4 sm:p-5 shadow-xl transition-all" style={cardStyle}>
        <p className="text-[9px] font-mono tracking-widest uppercase font-semibold" style={labelStyle}>
          PRODUCTIVITY SCORE
        </p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
            {productivityScore}
          </span>
          <span className="text-xs font-mono" style={labelStyle}>/ 100</span>
        </div>
        <p className="text-[10px] mt-1 font-mono" style={labelStyle}>
          {productivityScore === 0 ? 'Log sessions to score' : 'Target + streak rating'}
        </p>
      </div>

      {/* Card 4: Completion */}
      <div className="rounded-2xl border p-4 sm:p-5 shadow-xl transition-all" style={cardStyle}>
        <p className="text-[9px] font-mono tracking-widest uppercase font-semibold" style={labelStyle}>
          COMPLETION RATE
        </p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: 'var(--theme-text-primary)' }}>
            {completionRate}%
          </span>
          <span className="text-xs font-mono" style={labelStyle}>of sessions</span>
        </div>
        <p className="text-[10px] mt-1 font-mono" style={labelStyle}>
          Completed without cancel
        </p>
      </div>
    </div>
  );
};
