import React, { useState } from 'react';
import {
  X,
  Sliders,
  Volume2,
  Bell,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  Type,
  Maximize2,
  AlertTriangle,
} from 'lucide-react';
import { TimerFont, TimerSettings, TimerSize } from '../types/timer';
import { soundEngine } from '../utils/audio';
import { requestNotificationPermission } from '../utils/notifications';
import { DEFAULT_SETTINGS } from '../utils/storage';

interface SettingsModalProps {
  settings: TimerSettings;
  onUpdateSettings: (newSettings: TimerSettings) => void;
  onClose: () => void;
  onResetProgress?: () => void;
}

const TYPOGRAPHY_OPTIONS: { id: TimerFont; label: string; fontClass: string; sample: string }[] = [
  { id: 'digital', label: 'Digital LED', fontClass: 'font-timer-digital', sample: '25:00' },
  { id: 'sans', label: 'Modern Sans', fontClass: 'font-timer-sans', sample: '25:00' },
  { id: 'serif', label: 'Classic Serif', fontClass: 'font-timer-serif', sample: '25:00' },
  { id: 'mono', label: 'Coder Mono', fontClass: 'font-timer-mono', sample: '25:00' },
  { id: 'rounded', label: 'Rounded Soft', fontClass: 'font-timer-rounded', sample: '25:00' },
  { id: 'grotesk', label: 'Futuristic', fontClass: 'font-timer-grotesk', sample: '25:00' },
  { id: 'thin', label: 'Minimal Thin', fontClass: 'font-timer-thin', sample: '25:00' },
  { id: 'bold', label: 'Display Bold', fontClass: 'font-timer-bold', sample: '25:00' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetProgress,
}) => {
  const [localSettings, setLocalSettings] = useState<TimerSettings>({ ...settings });
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const [notifGranted, setNotifGranted] = useState<boolean>(() => {
    return 'Notification' in window && Notification.permission === 'granted';
  });

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleResetDefaults = () => {
    setLocalSettings({ ...DEFAULT_SETTINGS });
  };

  const handleTestChime = () => {
    soundEngine.playChime(localSettings.chimeSound, localSettings.soundVolume);
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted) {
      setLocalSettings((prev) => ({ ...prev, enableNotifications: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-neutral-950/95 border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Preferences & Sound</h2>
              <p className="text-xs text-neutral-400">
                Customize interval lengths, typography, soundscapes & visual atmosphere
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Section 1: Timer Durations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <span>Timer Durations (Minutes)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {/* Focus duration */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium block">Focus</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={localSettings.focusDuration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      focusDuration: Math.max(1, parseInt(e.target.value) || 25),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono text-center font-bold text-base focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Short break duration */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium block">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakDuration: Math.max(1, parseInt(e.target.value) || 5),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono text-center font-bold text-base focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Long break duration */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium block">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakDuration: Math.max(1, parseInt(e.target.value) || 15),
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono text-center font-bold text-base focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Long break interval */}
            <div className="flex items-center justify-between p-3.5 mt-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="font-semibold text-white block">Long Break Interval</span>
                <span className="text-neutral-400">
                  Completed focus sessions before triggering a long break
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, longBreakInterval: num })}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all border ${
                      localSettings.longBreakInterval === num
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                        : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Timer Typography & Scale */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                <span>Timer Typography (8 Styles)</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-normal">Custom digit styling</span>
            </h3>

            {/* 8-Font Grid Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TYPOGRAPHY_OPTIONS.map((f) => {
                const isSelected = localSettings.timerFont === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, timerFont: f.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-lg ring-1 ring-emerald-400/40'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={`text-xl sm:text-2xl font-bold ${f.fontClass} mb-1 drop-shadow-sm`}>
                      {f.sample}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium">{f.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Timer Size / Scale */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="font-semibold text-white block flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Timer Scale</span>
                </span>
                <span className="text-neutral-400">Choose your preferred dial & digit size</span>
              </div>
              <div className="flex items-center gap-1">
                {(['standard', 'large', 'xl'] as TimerSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, timerSize: sz })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                      (localSettings.timerSize || 'large') === sz
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                        : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sz === 'xl' ? 'Cinematic XL' : sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Session Automation */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Session Flow
            </h3>

            {/* Auto start breaks */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/8 transition-colors">
              <div>
                <span className="text-xs font-semibold text-white block">Auto-Start Breaks</span>
                <span className="text-[11px] text-neutral-400">
                  Automatically start countdown when a focus session ends
                </span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoStartBreaks}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoStartBreaks: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-500 bg-black/40 border-white/20 focus:ring-0 cursor-pointer"
              />
            </label>

            {/* Auto start pomodoros */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/8 transition-colors">
              <div>
                <span className="text-xs font-semibold text-white block">Auto-Start Focus Sessions</span>
                <span className="text-[11px] text-neutral-400">
                  Automatically start countdown when a break session ends
                </span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoStartPomodoros}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoStartPomodoros: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-500 bg-black/40 border-white/20 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Section 4: Audio & Chimes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Completion Chime</span>
              <button
                onClick={handleTestChime}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-normal"
              >
                <Play className="w-3 h-3 fill-current" /> Preview sound
              </button>
            </h3>

            {/* Chime selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bowl', label: 'Singing Bowl' },
                { id: 'marimba', label: 'Soft Marimba' },
                { id: 'beep', label: 'Clean Ping' },
                { id: 'gong', label: 'Zen Gong' },
              ].map((c) => {
                const isSelected = localSettings.chimeSound === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setLocalSettings({ ...localSettings, chimeSound: c.id as any });
                      soundEngine.playChime(c.id as any, localSettings.soundVolume);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Volume slider */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Chime Volume
                </span>
                <span className="font-mono text-neutral-400">
                  {Math.round(localSettings.soundVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSettings.soundVolume}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, soundVolume: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Section 5: Display & Readability Contrast */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Background Darkness / Overlay
            </h3>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span>Vignette Darkness (Text Readability)</span>
                <span className="font-mono text-neutral-400">
                  {Math.round(localSettings.backgroundOverlayOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={localSettings.backgroundOverlayOpacity}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    backgroundOverlayOpacity: parseFloat(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Section 6: Desktop Notifications */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-neutral-300" />
              <div>
                <span className="font-semibold text-white block">Desktop Notifications</span>
                <span className="text-[11px] text-neutral-400">
                  Alert you when sessions conclude even if tab is in background
                </span>
              </div>
            </div>
            {notifGranted ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-medium">
                <Check className="w-3 h-3" /> Enabled
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestNotif}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition-colors"
              >
                Allow
              </button>
            )}
          </div>

          {/* Section 7: Danger Zone - Reset Progress */}
          {onResetProgress && (
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold text-xs">Reset All Focus Progress</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                  Danger Zone
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Permanently erases all 30-day challenge progression, completed session records, current streaks, and unlocked achievement badges. Your themes, sound preferences, and tasks will NOT be affected.
              </p>
              <button
                type="button"
                onClick={() => setIsConfirmingReset(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Reset Progress...
              </button>
            </div>
          )}
        </div>

        {/* Confirmation Modal for Reset Progress */}
        {isConfirmingReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl p-5 border border-red-500/40 bg-[#121622] text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full mx-auto bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Confirm Progress Reset</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Are you sure? This will permanently erase your 30-day challenge progression, session history, streaks, and all unlocked achievement badges. This cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onResetProgress) onResetProgress();
                    setIsConfirmingReset(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Yes, Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
          <button
            onClick={handleResetDefaults}
            className="text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
