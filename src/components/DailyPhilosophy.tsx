import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { getTodayPhilosophyQuote } from '../constants/quotes';

interface DailyPhilosophyProps {
  theme: ThemeConfig;
}

export const DailyPhilosophy: React.FC<DailyPhilosophyProps> = ({ theme: _theme }) => {
  const [dayOffset, setDayOffset] = useState<number>(0);
  const reflection = getTodayPhilosophyQuote(dayOffset);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDayOffset((prev) => prev - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDayOffset((prev) => prev + 1);
  };

  const handleResetToToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDayOffset(0);
  };

  const isToday = dayOffset === 0;

  return (
    <section 
      aria-label="Daily Reflection"
      className="group relative w-full max-w-xl mx-auto mt-7 text-center select-none px-4 flex flex-col items-center"
    >
      <div className="relative flex items-center justify-center gap-2 w-full">
        {/* Subtle hover chevron */}
        <button
          onClick={handlePrev}
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1.5 rounded-full text-white/70 hover:bg-white/10 transition-all active:scale-95 shrink-0"
          aria-label="Previous quote"
          title="Previous quote"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Cinematic Editorial Serif Quote matching screenshot */}
        <div className="flex-1 max-w-lg">
          <p className="font-serif italic text-sm sm:text-base md:text-lg font-light text-white/90 leading-relaxed tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all">
            “{reflection.quote}”
          </p>

          {!isToday && (
            <button
              onClick={handleResetToToday}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors"
              title="Return to today's reflection"
            >
              <RotateCcw className="w-3 h-3 text-sky-400" />
              <span>Today</span>
            </button>
          )}
        </div>

        {/* Subtle hover chevron */}
        <button
          onClick={handleNext}
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1.5 rounded-full text-white/70 hover:bg-white/10 transition-all active:scale-95 shrink-0"
          aria-label="Next quote"
          title="Next quote"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
