import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Music, Trees, Waves, Coffee, Ban } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { ThemeConfig } from '../types/theme';

interface AmbientAudioBarProps {
  theme: ThemeConfig;
  currentSound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe';
  volume: number;
  onSoundChange: (sound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe') => void;
  onVolumeChange: (volume: number) => void;
}

export const AmbientAudioBar: React.FC<AmbientAudioBarProps> = ({
  theme,
  currentSound,
  volume,
  onSoundChange,
  onVolumeChange,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [isOpen, setIsOpen] = useState(false);

  const options: { id: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe'; label: string; icon: React.ReactNode }[] = [
    { id: 'none', label: 'Off', icon: <Ban className="w-3.5 h-3.5" /> },
    { id: 'rain', label: 'Rain', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'lofi', label: 'Lo-Fi', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'nature', label: 'Nature', icon: <Trees className="w-3.5 h-3.5" /> },
    { id: 'waves', label: 'Waves', icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'cafe', label: 'Café', icon: <Coffee className="w-3.5 h-3.5" /> },
  ];

  const handleSelect = (id: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe') => {
    onSoundChange(id);
    if (id === 'none') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.startAmbient(id, isMuted ? 0 : volume);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(previousVolume || 0.5);
      soundEngine.setAmbientVolume(previousVolume || 0.5);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
      soundEngine.setAmbientVolume(0);
    }
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onVolumeChange(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
    soundEngine.setAmbientVolume(val);
  };

  const isPlaying = currentSound !== 'none' && !isMuted && volume > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
        {/* Toggle / Status pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
          title="Ambient Soundscapes"
        >
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5">
              <span className="w-0.5 bg-emerald-400 h-2 animate-pulse" />
              <span className="w-0.5 bg-emerald-400 h-3 animate-bounce" style={{ animationDuration: '0.6s' }} />
              <span className="w-0.5 bg-emerald-400 h-1.5 animate-pulse" />
            </div>
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span className="capitalize">{currentSound === 'none' ? 'Ambience' : currentSound}</span>
        </button>

        {/* Quick Mute/Unmute */}
        {currentSound !== 'none' && (
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isMuted ? 'Unmute ambience' : 'Mute ambience'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
            )}
          </button>
        )}
      </div>

      {/* Floating Sound Panel Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 z-50 p-3.5 rounded-2xl bg-neutral-900/90 backdrop-blur-2xl border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
              <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
                Ambient Soundscape
              </span>
              {currentSound !== 'none' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  Playing Real-Time
                </span>
              )}
            </div>

            {/* Sound options grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {options.map((opt) => {
                const active = currentSound === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? `${theme.primaryButton} shadow-md`
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {opt.icon}
                    <span className="text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider */}
            {currentSound !== 'none' && (
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Ambience Volume</span>
                  <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMute}
                    className="text-neutral-400 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleSlider}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
