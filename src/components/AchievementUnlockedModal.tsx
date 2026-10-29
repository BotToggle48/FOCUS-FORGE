import React, { useEffect } from 'react';
import {
  Trophy,
  Sparkles,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Award,
  Crown,
  Flame,
  Star,
  Compass,
} from 'lucide-react';
import { EvaluatedAchievement } from '../utils/achievements';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Zap,
  Shield,
  Flame,
  Trophy,
  Target,
  Award,
  Crown,
  Compass,
  Star,
};

interface AchievementUnlockedModalProps {
  achievement: EvaluatedAchievement | null;
  onClose: () => void;
  onOpenAchievementsView?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isLight?: boolean;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  achievement,
  onClose,
  onOpenAchievementsView,
  isMuted,
  onToggleMute,
  isLight = false,
}) => {
  useEffect(() => {
    if (!achievement || isMuted) return;

    // Synthesize celebratory chime via Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Arpeggiated triumphant triad (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, [achievement, isMuted]);

  if (!achievement) return null;

  const Icon = ICON_MAP[achievement.icon] || Trophy;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border p-6 sm:p-8 text-center shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-accent-primary)',
          boxShadow: '0 0 50px var(--theme-accent-glow)',
          color: 'var(--theme-text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: 'var(--theme-accent-primary)' }}
        />

        {/* Top Control Bar: Mute Sound & Close */}
        <div className="flex items-center justify-between relative z-10 mb-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
            title={isMuted ? 'Unmute achievement sound' : 'Mute achievement sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-mono">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border text-xs transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Badge Medallion */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated concentric rings */}
          <div
            className="absolute w-32 h-32 rounded-full border border-dashed animate-spin opacity-40"
            style={{
              borderColor: 'var(--theme-accent-primary)',
              animationDuration: '20s',
            }}
          />
          <div
            className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform"
            style={{
              backgroundColor: 'var(--theme-accent-glow)',
              borderColor: 'var(--theme-accent-primary)',
              color: 'var(--theme-accent-primary)',
              boxShadow: '0 0 25px var(--theme-accent-glow)',
            }}
          >
            <Icon className="w-12 h-12 stroke-[2.2]" />
          </div>
        </div>

        {/* Banner Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border mb-2"
          style={{
            backgroundColor: 'var(--theme-accent-glow)',
            borderColor: 'var(--theme-accent-primary)',
            color: 'var(--theme-accent-primary)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>NEW ACHIEVEMENT UNLOCKED!</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-extrabold tracking-tight mt-1" style={{ color: 'var(--theme-text-primary)' }}>
          {achievement.title}
        </h3>
        <p className="text-xs mt-2 leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--theme-text-secondary)' }}>
          {achievement.description}
        </p>

        {/* Criteria & Tier Badge */}
        <div
          className="mt-4 p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" style={{ color: 'var(--theme-success)' }} />
            <span style={{ color: 'var(--theme-text-secondary)' }}>Condition:</span>
          </div>
          <span className="font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
            {achievement.unlockCondition}
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg transition-all active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--theme-accent-primary)',
              color: isLight ? '#FFFFFF' : '#0B1020',
              boxShadow: '0 4px 16px var(--theme-accent-glow)',
            }}
          >
            Claim Badge & Continue
          </button>

          {onOpenAchievementsView && (
            <button
              onClick={() => {
                onClose();
                onOpenAchievementsView();
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-white/[0.08]"
              style={{
                borderColor: 'var(--theme-border)',
                backgroundColor: 'var(--theme-bg-elevated)',
                color: 'var(--theme-text-primary)',
              }}
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
