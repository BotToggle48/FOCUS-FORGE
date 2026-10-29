import React from 'react';
import { X, Sparkles, Keyboard, Heart, Music, Timer, CheckCircle, ExternalLink } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface AboutModalProps {
  theme: ThemeConfig;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ theme: _theme, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#12141c]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-6 sm:p-8 text-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Pomodoro Timer</h2>
              <p className="text-xs text-neutral-400">Cinematic Focus Sanctuary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5 text-sm">
          <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
            FocusSpace blends the classic Pomodoro Technique with immersive atmospheric environments, official Spotify integration, real-time Web Audio soundscapes, and daily philosophical reflections to keep you in effortless flow.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <Timer className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Deep Work Cadence</p>
                <p className="text-[11px] text-neutral-400">25m focus & 5m breaks with custom pacing.</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <Music className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Music & Sounds</p>
                <p className="text-[11px] text-neutral-400">Spotify embeds & rain/vinyl audio synth.</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Task Management</p>
                <p className="text-[11px] text-neutral-400">Organize goals and track session count.</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">10 Themes</p>
                <p className="text-[11px] text-neutral-400">Anime study, cyberpunk, nature & cafe.</p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Keyboard className="w-4 h-4 text-sky-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs text-neutral-300">
              <div className="flex items-center justify-between pr-3">
                <span>Start / Pause</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-neutral-200">Space</kbd>
              </div>
              <div className="flex items-center justify-between pl-3 border-l border-white/10">
                <span>Zen Mode</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-neutral-200">F</kbd>
              </div>
              <div className="flex items-center justify-between pr-3">
                <span>Music Panel</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-neutral-200">M</kbd>
              </div>
              <div className="flex items-center justify-between pl-3 border-l border-white/10">
                <span>Task Manager</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-neutral-200">T</kbd>
              </div>
              <div className="flex items-center justify-between pr-3">
                <span>Close Modals</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-neutral-200">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Community & Discord */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-neutral-400">Join our study community</span>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-medium transition-all shadow-md shadow-[#5865F2]/20"
            >
              <span>Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
