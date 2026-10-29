import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { THEMES } from '../constants/themes';
import { ThemeConfig, ThemeId } from '../types/theme';

interface ThemeSelectorModalProps {
  currentThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  currentThemeId,
  onSelectTheme,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-neutral-950/95 border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Theme Sanctuary</h2>
              <p className="text-xs text-neutral-400">
                10 curated aesthetic environments for deep concentration & tranquil study
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

        {/* 10 Themes Visual Gallery */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES.map((theme: ThemeConfig) => {
            const isSelected = theme.id === currentThemeId;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-[1.02] shadow-xl'
                    : 'border-white/10 hover:border-white/30 hover:scale-[1.01] hover:shadow-lg'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative h-32 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={theme.thumbnailUrl}
                    alt={theme.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Active selected badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-xs font-bold shadow-lg">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-black/60 text-white/90 border border-white/10 backdrop-blur-md">
                    {theme.category}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 bg-neutral-900/90 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {theme.name}
                      </h3>
                      {/* Color swatch dot */}
                      <span className={`w-2.5 h-2.5 rounded-full bg-current ${theme.accentColor}`} />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {theme.tagline}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Themes change instantaneously with zero page reloading
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
