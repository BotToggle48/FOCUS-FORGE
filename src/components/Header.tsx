import React, { useState, useEffect } from 'react';
import { Palette, BarChart3, Settings, Maximize2, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { AmbientAudioBar } from './AmbientAudioBar';

interface HeaderProps {
  theme: ThemeConfig;
  onOpenThemeModal: () => void;
  onOpenStatsModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleZenMode: () => void;
  ambientSound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe';
  ambientVolume: number;
  onAmbientSoundChange: (sound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe') => void;
  onAmbientVolumeChange: (vol: number) => void;
  todayCompletedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onOpenThemeModal,
  onOpenStatsModal,
  onOpenSettingsModal,
  onToggleZenMode,
  ambientSound,
  ambientVolume,
  onAmbientSoundChange,
  onAmbientVolumeChange,
  todayCompletedCount,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 z-30">
      {/* Brand & Digital Clock */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
            <Sparkles className={`w-4 h-4 ${theme.accentColor} transition-colors`} />
            <div className="absolute inset-0 rounded-xl bg-white/5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              FocusSpace
            </h1>
            <p className="text-[11px] text-white/60 tracking-wider font-medium uppercase mt-0.5">
              Personal Sanctuary
            </p>
          </div>
        </div>

        {/* Minimal Digital Clock */}
        <div className="hidden md:flex items-center px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 text-xs font-timer text-white/80">
          {timeStr}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Ambient Soundscape Controller */}
        <AmbientAudioBar
          theme={theme}
          currentSound={ambientSound}
          volume={ambientVolume}
          onSoundChange={onAmbientSoundChange}
          onVolumeChange={onAmbientVolumeChange}
        />

        {/* Theme Selector Button */}
        <button
          onClick={onOpenThemeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-md group"
          title="Customize Theme (10 Aesthetic Themes)"
        >
          <Palette className={`w-3.5 h-3.5 ${theme.accentColor} group-hover:rotate-12 transition-transform`} />
          <span className="hidden sm:inline">{theme.name}</span>
        </button>

        {/* Statistics Button */}
        <button
          onClick={onOpenStatsModal}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-md"
          title="Productivity Statistics & History"
        >
          <BarChart3 className="w-3.5 h-3.5 text-neutral-300" />
          <span className="hidden sm:inline">Stats</span>
          {todayCompletedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
              {todayCompletedCount}
            </span>
          )}
        </button>

        {/* Zen / Distraction-Free Mode */}
        <button
          onClick={onToggleZenMode}
          className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-neutral-300 hover:text-white transition-all shadow-md"
          title="Zen Mode / Distraction-Free (Shortcut: F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettingsModal}
          className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-neutral-300 hover:text-white transition-all shadow-md"
          title="Settings & Timer Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
