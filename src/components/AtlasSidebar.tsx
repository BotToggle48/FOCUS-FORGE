import React, { useState } from 'react';
import {
  LayoutDashboard,
  Timer as TimerIcon,
  CheckSquare,
  BarChart2,
  Target,
  Trophy,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BookOpen,
  FileText,
  History,
  Tag,
  Repeat,
  Sparkles,
  Palette,
  HardDrive,
  Settings,
  HelpCircle,
  Flame,
  X,
  Award,
  Music,
} from 'lucide-react';
import { ActiveNavView } from '../types/atlas';

interface AtlasSidebarProps {
  currentView: ActiveNavView;
  onSelectView: (view: ActiveNavView) => void;
  pendingTasksCount: number;
  unlockedAchievementsCount?: number;
  challengeDay?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AtlasSidebar: React.FC<AtlasSidebarProps> = ({
  currentView,
  onSelectView,
  pendingTasksCount,
  unlockedAchievementsCount = 0,
  challengeDay = 0,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [isMoreExpanded, setIsMoreExpanded] = useState(true);

  const navItem = (
    view: ActiveNavView,
    label: string,
    Icon: React.ElementType,
    badge?: string | number,
    isSpecial?: boolean
  ) => {
    const isActive = currentView === view;
    return (
      <button
        key={view}
        onClick={() => {
          onSelectView(view);
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer relative group ${
          isActive
            ? 'font-semibold border-l-2'
            : 'hover:bg-white/[0.06] text-neutral-400 hover:text-neutral-200'
        }`}
        style={{
          borderLeftColor: isActive ? 'var(--theme-accent-primary)' : 'transparent',
          backgroundColor: isActive ? 'var(--theme-accent-glow)' : 'transparent',
          color: isActive ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Icon
            className="w-4 h-4 transition-colors"
            style={{
              color: isActive || isSpecial ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
            }}
          />
          <span className="tracking-wide">{label}</span>
        </div>

        {badge !== undefined && (
          <span
            className="px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none border"
            style={{
              backgroundColor: isActive ? 'var(--theme-accent-glow)' : 'rgba(255, 255, 255, 0.05)',
              color: isActive ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
              borderColor: isActive ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
            }}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  const content = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Brand Header */}
      <div>
        <div
          className="flex items-center justify-between px-3 py-4 mb-2 border-b"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center shadow-md"
              style={{
                backgroundColor: 'var(--theme-accent-glow)',
                borderColor: 'var(--theme-accent-primary)',
                color: 'var(--theme-accent-primary)',
              }}
            >
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight flex items-center gap-1" style={{ color: 'var(--theme-text-primary)' }}>
                <span>Focus</span>
                <span style={{ color: 'var(--theme-accent-primary)' }}>Forge</span>
              </h1>
              <p
                className="text-[8px] font-mono tracking-widest uppercase font-semibold"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                BUILD DISCIPLINE
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4 px-1.5">
          {/* FOCUS */}
          <div>
            <p
              className="px-3 text-[10px] uppercase font-mono tracking-wider font-semibold mb-1"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              Focus
            </p>
            <div className="space-y-0.5">
              {navItem('dashboard', 'Dashboard', LayoutDashboard)}
              {navItem('timer', 'Timer', TimerIcon)}
              {navItem(
                'tasks',
                'Tasks',
                CheckSquare,
                pendingTasksCount > 0 ? pendingTasksCount : undefined
              )}
            </div>
          </div>

          {/* 30-DAY CHALLENGE & PROGRESS */}
          <div>
            <p
              className="px-3 text-[10px] uppercase font-mono tracking-wider font-semibold mb-1"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              Challenge & Progress
            </p>
            <div className="space-y-0.5">
              {navItem(
                'challenge',
                '30-Day Challenge',
                Trophy,
                `Day ${challengeDay}/30`,
                true
              )}
              {navItem('stats', 'Analytics', BarChart2)}
              {navItem('goals', 'Daily Goals', Target)}
              {navItem(
                'achievements',
                'Achievements',
                Award,
                unlockedAchievementsCount > 0 ? unlockedAchievementsCount : undefined
              )}
            </div>
          </div>

          {/* MORE (Collapsible) */}
          <div>
            <button
              onClick={() => setIsMoreExpanded(!isMoreExpanded)}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] uppercase font-mono tracking-wider font-semibold mb-1 transition-colors cursor-pointer"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              <span>Tools & Look</span>
              {isMoreExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {isMoreExpanded && (
              <div className="space-y-0.5 pl-1">
                {navItem('music', 'Music', Music)}
                {navItem('palettes', 'Themes & Gallery', Palette)}
                {navItem('history', 'Session History', History)}
                {navItem('insights', 'Insights', TrendingUp)}
                {navItem('journal', 'Journal', BookOpen)}
                {navItem('reports', 'Reports', FileText)}
                {navItem('tags', 'Tags', Tag)}
                {navItem('habits', 'Habits', Repeat)}
                {navItem('recipes', 'Soundscapes', Sparkles)}
                {navItem('backups', 'Backups', HardDrive)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div
        className="pt-3 border-t px-1.5 space-y-1"
        style={{ borderColor: 'var(--theme-border)' }}
      >
        {navItem('settings', 'Settings', Settings)}
        {navItem('help', 'Help', HelpCircle)}

        <div className="px-3 py-2 mt-1">
          <p
            className="text-[9px] font-mono tracking-widest uppercase font-semibold"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            FOCUSFORGE • DISCIPLINE
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Permanent 220px column */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r p-2 z-40 overflow-y-auto"
        style={{
          backgroundColor: 'var(--theme-bg-sidebar)',
          borderColor: 'var(--theme-border)',
        }}
      >
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 max-w-[80vw] h-full border-r p-3 shadow-2xl overflow-y-auto"
            style={{
              backgroundColor: 'var(--theme-bg-sidebar)',
              borderColor: 'var(--theme-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
