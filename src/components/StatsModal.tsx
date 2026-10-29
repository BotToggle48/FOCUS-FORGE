import React, { useState } from 'react';
import {
  X,
  Flame,
  Clock,
  CheckCircle,
  Calendar,
  RotateCcw,
  AlertTriangle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { SessionRecord } from '../types/timer';
import { Task } from '../types/task';
import { calculateProductivityStats } from '../utils/storage';
import { ThemeConfig } from '../types/theme';

interface StatsModalProps {
  sessions: SessionRecord[];
  tasks: Task[];
  theme: ThemeConfig;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  sessions,
  tasks,
  theme,
  onClose,
  onResetStats,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const stats = calculateProductivityStats(sessions, tasks);

  const formatHoursMinutes = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  // Find max minutes in weekly chart for relative bar height scaling
  const maxWeeklyMinutes = Math.max(1, ...stats.past7Days.map((d) => d.minutes));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-neutral-950/95 border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Productivity Analytics</h2>
              <p className="text-xs text-neutral-400">
                Tracking your real completed deep work sessions and consistency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Today's Focus Sessions */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Sessions Today
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold font-timer text-white">
                  {stats.focusSessionsToday}
                </span>
                <span className="text-xs text-neutral-400">pomodoros</span>
              </div>
            </div>

            {/* Total Focus Time */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" /> Focus Time
              </span>
              <div className="mt-2">
                <span className="text-2xl font-bold font-timer text-white">
                  {formatHoursMinutes(stats.totalFocusMinutesToday)}
                </span>
              </div>
            </div>

            {/* Streak */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> Day Streak
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold font-timer text-amber-400">
                  {stats.streak}
                </span>
                <span className="text-xs text-neutral-400">days</span>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Completed
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold font-timer text-white">
                  {stats.completedTasksCount}
                </span>
                <span className="text-xs text-neutral-400">tasks</span>
              </div>
            </div>
          </div>

          {/* Weekly Activity Bar Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-bold text-white">Weekly Focus Activity</h3>
              </div>
              <span className="text-xs text-neutral-400">Last 7 Days</span>
            </div>

            {/* Bar chart container */}
            <div className="flex items-end justify-between gap-2 h-44 pt-4 pb-2 border-b border-white/10">
              {stats.past7Days.map((day, idx) => {
                const heightPercent = day.minutes > 0 ? Math.max(12, (day.minutes / maxWeeklyMinutes) * 100) : 4;
                const isToday = idx === stats.past7Days.length - 1;

                return (
                  <div key={day.dateStr} className="flex-1 h-full flex flex-col items-center justify-end gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 px-2 py-1 rounded-md text-[10px] text-white whitespace-nowrap border border-white/20 pointer-events-none z-10 shadow-lg">
                      {day.minutes} mins ({day.count} sessions)
                    </div>

                    <div className="w-full max-w-[28px] bg-white/10 rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                            : day.minutes > 0
                            ? 'bg-gradient-to-t from-indigo-600 to-sky-400'
                            : 'bg-white/5'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        isToday ? 'text-emerald-400 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Completed Sessions Log */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Recent Focus Sessions</span>
              <span className="text-xs font-normal text-neutral-400">
                {sessions.length} total logged
              </span>
            </h3>

            {sessions.length === 0 ? (
              <p className="text-xs text-neutral-400 py-3 text-center">
                No focus sessions logged yet. Complete a Pomodoro interval to start tracking!
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {sessions.slice(0, 8).map((s) => {
                  const date = new Date(s.timestamp);
                  const timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}`;

                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/30 border border-white/5 text-xs text-neutral-300"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="font-medium text-white truncate max-w-[240px]">
                          {s.taskTitle || 'Open Focus Session'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-neutral-400 font-mono text-[11px]">
                        <span>{s.durationMinutes}m</span>
                        <span>{dateFormatted} {timeFormatted}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Reset Action */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Clear all history?
              </span>
              <button
                onClick={() => {
                  onResetStats();
                  setShowConfirmReset(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-neutral-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-neutral-500 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Statistics
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
