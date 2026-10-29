import React from 'react';
import { SessionRecord } from '../../types/timer';
import { Clock, Flame, Trophy, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatsViewProps {
  sessions: SessionRecord[];
  streakDays: number;
  bestStreakDays: number;
  past7Days?: { dateStr: string; label: string; minutes: number; count: number }[];
  isLight?: boolean;
}

export const StatsView: React.FC<StatsViewProps> = ({
  sessions,
  streakDays = 0,
  bestStreakDays = 0,
  past7Days = [],
  isLight = false,
}) => {
  const focusSessions = sessions.filter((s) => s.mode === 'focus');
  const totalMinutes = focusSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalSessionsCount = focusSessions.length;

  const cardStyle = {
    backgroundColor: 'var(--theme-bg-card)',
    borderColor: 'var(--theme-border)',
    color: 'var(--theme-text-primary)',
  };

  const labelStyle = {
    color: 'var(--theme-text-secondary)',
  };

  const maxDayMinutes = Math.max(...past7Days.map((d) => d.minutes), 60);
  const avgMinutesPerDay =
    past7Days.length > 0
      ? Math.round(past7Days.reduce((acc, d) => acc + d.minutes, 0) / past7Days.length)
      : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2" style={{ color: 'var(--theme-text-primary)' }}>
      {/* Header */}
      <div className="pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Productivity Analytics
        </h2>
        <p className="text-xs mt-1" style={labelStyle}>
          Genuine telemetry, daily time distribution, and unbroken streak milestones.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border" style={cardStyle}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />
            <p className="text-[10px] font-mono tracking-wider uppercase font-semibold" style={labelStyle}>Total Focus</p>
          </div>
          <p className="text-2xl font-bold font-mono mt-1">{totalMinutes} <span className="text-xs" style={labelStyle}>min</span></p>
          <p className="text-[10px] font-mono mt-0.5" style={labelStyle}>{(totalMinutes / 60).toFixed(1)} verified hrs</p>
        </div>

        <div className="p-4 rounded-2xl border" style={cardStyle}>
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--theme-accent-primary)' }} />
            <p className="text-[10px] font-mono tracking-wider uppercase font-semibold" style={labelStyle}>Day Streak</p>
          </div>
          <p className="text-2xl font-bold font-mono mt-1" style={{ color: 'var(--theme-accent-primary)' }}>
            {streakDays} <span className="text-xs" style={labelStyle}>days</span>
          </p>
          <p className="text-[10px] font-mono mt-0.5" style={labelStyle}>Consecutive qualifying</p>
        </div>

        <div className="p-4 rounded-2xl border" style={cardStyle}>
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />
            <p className="text-[10px] font-mono tracking-wider uppercase font-semibold" style={labelStyle}>Best Streak</p>
          </div>
          <p className="text-2xl font-bold font-mono mt-1">{bestStreakDays} <span className="text-xs" style={labelStyle}>days</span></p>
          <p className="text-[10px] font-mono mt-0.5" style={labelStyle}>All-time record</p>
        </div>

        <div className="p-4 rounded-2xl border" style={cardStyle}>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-primary)' }} />
            <p className="text-[10px] font-mono tracking-wider uppercase font-semibold" style={labelStyle}>Completed Sprints</p>
          </div>
          <p className="text-2xl font-bold font-mono mt-1">{totalSessionsCount} <span className="text-xs" style={labelStyle}>blocks</span></p>
          <p className="text-[10px] font-mono mt-0.5" style={labelStyle}>Logged sessions</p>
        </div>
      </div>

      {/* Weekly Hours Bar Chart with Real Data */}
      <div className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl" style={cardStyle}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight">Weekly Focus Distribution</h3>
            <p className="text-xs" style={labelStyle}>Minutes logged across the rolling 7 calendar days.</p>
          </div>
          <span className="text-xs font-mono font-semibold" style={{ color: 'var(--theme-accent-primary)' }}>
            Avg {avgMinutesPerDay} min/day
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 h-44 pt-6 px-2">
          {past7Days.map((day) => {
            const val = day.minutes;
            const pct = Math.min(100, Math.round((val / maxDayMinutes) * 100));
            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono transition-colors" style={labelStyle}>
                  {val > 0 ? `${val}m` : '-'}
                </span>
                <div
                  className="w-full max-w-[36px] rounded-xl h-full flex items-end overflow-hidden p-1"
                  style={{ backgroundColor: 'var(--theme-bg-elevated)', border: '1px solid var(--theme-border)' }}
                >
                  <div
                    className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(4, pct)}%`,
                      backgroundColor: val > 0 ? 'var(--theme-accent-primary)' : 'rgba(255,255,255,0.05)',
                      boxShadow: val > 0 ? '0 0 10px var(--theme-accent-glow)' : 'none',
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono uppercase font-semibold" style={labelStyle}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real Session History Log */}
      <div className="p-5 sm:p-6 rounded-2xl border space-y-3 shadow-xl" style={cardStyle}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Recent Session History</h3>
          <span className="text-xs font-mono" style={labelStyle}>
            {sessions.length} total recorded
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto" style={{ color: 'var(--theme-text-secondary)' }} />
            <p className="text-xs font-medium" style={{ color: 'var(--theme-text-primary)' }}>
              No focus sessions recorded yet.
            </p>
            <p className="text-[11px]" style={labelStyle}>
              Start and complete a focus session on the dashboard to build your productivity timeline.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sessions.slice(0, 15).map((item) => {
              const d = new Date(item.timestamp);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isFocus = item.mode === 'focus';

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border text-xs"
                  style={{
                    backgroundColor: 'var(--theme-bg-elevated)',
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: isFocus ? 'var(--theme-accent-primary)' : 'var(--theme-warning)',
                        boxShadow: isFocus ? '0 0 6px var(--theme-accent-glow)' : 'none',
                      }}
                    />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--theme-text-primary)' }}>
                        {item.taskTitle || (isFocus ? 'Deep Work Session' : 'Rest Break')}
                      </p>
                      <p className="text-[10px] font-mono" style={labelStyle}>
                        {dateStr} • {timeStr}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold" style={{ color: isFocus ? 'var(--theme-accent-primary)' : 'var(--theme-warning)' }}>
                      {item.durationMinutes} min
                    </span>
                    <p className="text-[9px] uppercase tracking-wider" style={labelStyle}>
                      {item.mode}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
