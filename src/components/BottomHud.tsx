import React from 'react';
import { Menu, Terminal } from 'lucide-react';

interface BottomHudProps {
  onOpenCommandPalette: () => void;
  onOpenMobileSidebar: () => void;
  onOpenTasksView: () => void;
  activeTaskTitle?: string;
  isLight?: boolean;
}

export const BottomHud: React.FC<BottomHudProps> = ({
  onOpenCommandPalette,
  onOpenMobileSidebar,
  onOpenTasksView,
  activeTaskTitle,
  isLight = false,
}) => {
  return (
    <footer className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none px-4 sm:px-8 flex items-center justify-between">
      {/* Left Quick Note / Focus Today Preview */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl border shadow-lg cursor-pointer"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text-primary)',
          }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenTasksView}
          className="hidden sm:flex flex-col text-left px-3 py-1.5 rounded-xl border shadow-lg transition-all cursor-pointer group"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <span
            className="text-[9px] font-mono tracking-widest uppercase font-semibold"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            FOCUS TODAY
          </span>
          <span
            className="text-xs truncate max-w-[180px] font-medium"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            {activeTaskTitle || 'On your plate'}
          </span>
        </button>
      </div>

      {/* Center Floating Keyboard Shortcuts HUD matching mockup */}
      <div
        className="pointer-events-auto hidden md:flex items-center gap-4 px-4 py-2 rounded-full border shadow-2xl text-xs backdrop-blur-xl"
        style={{
          backgroundColor: 'var(--theme-bg-elevated)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-secondary)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <kbd
            className="px-1.5 py-0.5 rounded border font-mono text-[10px]"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
          >
            Space
          </kbd>
          <span>Start / Pause</span>
        </div>

        <div className="flex items-center gap-1.5">
          <kbd
            className="px-1.5 py-0.5 rounded border font-mono text-[10px]"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
          >
            R
          </kbd>
          <span>Reset</span>
        </div>

        <div className="flex items-center gap-1.5">
          <kbd
            className="px-1.5 py-0.5 rounded border font-mono text-[10px]"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
          >
            S
          </kbd>
          <span>Skip</span>
        </div>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ color: 'var(--theme-text-primary)' }}
        >
          <kbd
            className="px-1.5 py-0.5 rounded border font-mono text-[10px] font-semibold"
            style={{
              backgroundColor: 'var(--theme-accent-glow)',
              borderColor: 'var(--theme-accent-primary)',
              color: 'var(--theme-accent-primary)',
            }}
          >
            Ctrl + K
          </kbd>
          <span>Quick command</span>
        </button>

        <div className="flex items-center gap-1.5">
          <kbd
            className="px-1.5 py-0.5 rounded border font-mono text-[10px]"
            style={{
              backgroundColor: 'var(--theme-bg-card)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
          >
            1
          </kbd>
          <span>Timer</span>
        </div>
      </div>

      {/* Right side version badge */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl border shadow-lg cursor-pointer"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text-primary)',
          }}
          aria-label="Open command palette"
        >
          <Terminal className="w-4 h-4" />
        </button>

        <span
          className="hidden sm:inline-block px-2.5 py-1 rounded-lg border text-[10px] font-mono font-semibold"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-accent-primary)',
          }}
        >
          159
        </span>
      </div>
    </footer>
  );
};
