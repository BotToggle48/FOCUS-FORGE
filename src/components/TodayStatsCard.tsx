import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface TodayStatsCardProps {
  focusMinutesToday: number;
  vsAvgMinutes: number;
  hourlyPoints?: number[];
  isLight?: boolean;
}

export const TodayStatsCard: React.FC<TodayStatsCardProps> = ({
  focusMinutesToday = 0,
  vsAvgMinutes = 0,
  hourlyPoints = [0, 0, 0, 0, 0],
  isLight = false,
}) => {
  const width = 360;
  const height = 110;
  const pointsData = hourlyPoints && hourlyPoints.length >= 2 ? hourlyPoints : [0, 0, 0, 0, 0];
  const maxVal = Math.max(...pointsData, 60);
  const minVal = 0;

  const points = pointsData.map((val, idx) => {
    const x = (idx / (pointsData.length - 1)) * width;
    const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 24) - 12;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  const isPositive = vsAvgMinutes > 0;
  const isZero = vsAvgMinutes === 0;

  return (
    <div
      className="relative w-full rounded-2xl border p-5 sm:p-6 overflow-hidden shadow-xl flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--theme-bg-card)',
        borderColor: 'var(--theme-border)',
        color: 'var(--theme-text-primary)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none opacity-10"
        style={{ backgroundColor: 'var(--theme-accent-primary)' }}
      />

      {/* Top Header & Giant Metric */}
      <div>
        <p
          className="text-[10px] font-mono tracking-widest uppercase font-semibold"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          TODAY FOCUS TELEMETRY
        </p>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight">
            {focusMinutesToday}
          </span>
          <span className="text-base sm:text-lg font-mono font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
            Min
          </span>
        </div>

        <p className="text-xs mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
          {focusMinutesToday === 0
            ? 'No focus minutes logged yet today.'
            : 'Verified deep focus minutes completed today.'}
        </p>

        {/* Comparison badge */}
        <div
          className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border"
          style={{
            backgroundColor: isZero
              ? 'var(--theme-bg-elevated)'
              : isPositive
              ? 'rgba(67, 217, 163, 0.12)'
              : 'rgba(255, 112, 125, 0.12)',
            borderColor: isZero
              ? 'var(--theme-border)'
              : isPositive
              ? 'var(--theme-success)'
              : 'var(--theme-error)',
            color: isZero
              ? 'var(--theme-text-secondary)'
              : isPositive
              ? 'var(--theme-success)'
              : 'var(--theme-error)',
          }}
        >
          {isZero ? (
            <>
              <Minus className="w-3 h-3" />
              <span>ON PAR WITH AVG</span>
            </>
          ) : isPositive ? (
            <>
              <ArrowUpRight className="w-3 h-3" />
              <span>+{vsAvgMinutes}M VS DAILY AVG</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-3 h-3" />
              <span>{vsAvgMinutes}M VS DAILY AVG</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom Sparkline / Area Chart with real data */}
      <div className="relative mt-8 pt-4 w-full h-28 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="themeAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--theme-accent-primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--theme-accent-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill="url(#themeAreaGradient)" />

          {/* Glowing Stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--theme-accent-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 6px var(--theme-accent-glow))',
            }}
          />

          {/* Latest point dot */}
          {points.length > 0 && (
            <circle
              cx={width}
              cy={height - ((pointsData[pointsData.length - 1] - minVal) / (maxVal - minVal)) * (height - 24) - 12}
              r="4"
              fill={isLight ? '#FFFFFF' : '#0B1020'}
              stroke="var(--theme-accent-primary)"
              strokeWidth="2.5"
              className={focusMinutesToday > 0 ? 'animate-pulse' : ''}
            />
          )}
        </svg>

        {/* Time markers beneath chart */}
        <div
          className="flex items-center justify-between text-[9px] font-mono mt-1 font-semibold"
          style={{ color: 'var(--theme-text-secondary)' }}
        >
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>NOW</span>
        </div>
      </div>
    </div>
  );
};
