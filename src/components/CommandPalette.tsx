import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Play,
  RotateCcw,
  SkipForward,
  LayoutDashboard,
  Timer,
  CheckSquare,
  BarChart2,
  Palette,
  Settings,
  Music,
  X,
} from 'lucide-react';
import { ActiveNavView, PacingPreset } from '../types/atlas';

interface CommandItem {
  id: string;
  title: string;
  category: 'Timer' | 'Navigation' | 'Audio' | 'Pacing';
  icon: React.ElementType;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onSelectView: (view: ActiveNavView) => void;
  onSelectPacing: (preset: PacingPreset) => void;
  onToggleAmbient: (soundId: string) => void;
  isLight?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onSelectView,
  onSelectPacing,
  isLight = false,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'start-pause',
        title: 'Start / Pause Current Session',
        category: 'Timer',
        icon: Play,
        action: () => {
          onToggleTimer();
          onClose();
        },
      },
      {
        id: 'reset',
        title: 'Reset Current Session',
        category: 'Timer',
        icon: RotateCcw,
        action: () => {
          onResetTimer();
          onClose();
        },
      },
      {
        id: 'skip',
        title: 'Skip to Next Interval',
        category: 'Timer',
        icon: SkipForward,
        action: () => {
          onSkipTimer();
          onClose();
        },
      },
      {
        id: 'view-dashboard',
        title: 'Go to Dashboard',
        category: 'Navigation',
        icon: LayoutDashboard,
        action: () => {
          onSelectView('dashboard');
          onClose();
        },
      },
      {
        id: 'view-timer',
        title: 'Open Full Precision Timer',
        category: 'Navigation',
        icon: Timer,
        action: () => {
          onSelectView('timer');
          onClose();
        },
      },
      {
        id: 'view-tasks',
        title: 'Open Focus Tasks Manager',
        category: 'Navigation',
        icon: CheckSquare,
        action: () => {
          onSelectView('tasks');
          onClose();
        },
      },
      {
        id: 'view-stats',
        title: 'View Detailed Productivity Analytics',
        category: 'Navigation',
        icon: BarChart2,
        action: () => {
          onSelectView('stats');
          onClose();
        },
      },
      {
        id: 'view-palettes',
        title: 'Change Color Palettes & Appearance',
        category: 'Navigation',
        icon: Palette,
        action: () => {
          onSelectView('palettes');
          onClose();
        },
      },
      {
        id: 'view-music',
        title: 'Open Spotify Music Workspace',
        category: 'Navigation',
        icon: Music,
        action: () => {
          onSelectView('music');
          onClose();
        },
      },
      {
        id: 'view-settings',
        title: 'Open Settings & Sound Controls',
        category: 'Navigation',
        icon: Settings,
        action: () => {
          onSelectView('settings');
          onClose();
        },
      },
      {
        id: 'pacing-classic',
        title: 'Switch Cadence to Classic 25/5',
        category: 'Pacing',
        icon: Timer,
        action: () => {
          onSelectPacing('classic');
          onClose();
        },
      },
      {
        id: 'pacing-deep',
        title: 'Switch Cadence to Deep Work 50/10',
        category: 'Pacing',
        icon: Timer,
        action: () => {
          onSelectPacing('deep');
          onClose();
        },
      },
      {
        id: 'pacing-sprint',
        title: 'Switch Cadence to Sprint 15/3',
        category: 'Pacing',
        icon: Timer,
        action: () => {
          onSelectPacing('sprint');
          onClose();
        },
      },
      {
        id: 'pacing-marathon',
        title: 'Switch Cadence to Marathon 90/20',
        category: 'Pacing',
        icon: Timer,
        action: () => {
          onSelectPacing('marathon');
          onClose();
        },
      },
    ],
    [onToggleTimer, onResetTimer, onSkipTimer, onSelectView, onSelectPacing, onClose]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) => cmd.title.toLowerCase().includes(lower) || cmd.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-accent-primary)' }} />
          <input
            type="text"
            placeholder="Type a command or jump to view..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm placeholder-neutral-500 focus:outline-none font-medium"
            style={{ color: 'var(--theme-text-primary)' }}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/10"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
              No commands matching "{query}"
            </p>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all border"
                  style={{
                    backgroundColor: isSelected ? 'var(--theme-accent-glow)' : 'transparent',
                    borderColor: isSelected ? 'var(--theme-accent-primary)' : 'transparent',
                    color: isSelected ? 'var(--theme-accent-primary)' : 'var(--theme-text-primary)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-1.5 rounded-lg"
                      style={{
                        backgroundColor: isSelected ? 'var(--theme-accent-primary)' : 'var(--theme-bg-elevated)',
                        color: isSelected ? (isLight ? '#FFF' : '#0B1020') : 'var(--theme-text-secondary)',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{cmd.title}</span>
                  </div>

                  <span
                    className="text-[10px] font-mono uppercase font-semibold"
                    style={{ color: 'var(--theme-text-secondary)' }}
                  >
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className="px-4 py-2 border-t flex items-center justify-between text-[10px] font-mono"
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-bg-elevated)',
            color: 'var(--theme-text-secondary)',
          }}
        >
          <span>Navigate with ↑ ↓ • Press Enter to select</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
