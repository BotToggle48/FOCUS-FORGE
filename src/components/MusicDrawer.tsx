import React, { useState, memo } from 'react';
import {
  Music,
  CloudRain,
  X,
  Plus,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  Headphones,
  Check,
  Disc3,
  Coffee,
  Trees,
  Waves,
  Ban,
} from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import {
  CURATED_SPOTIFY_PLAYLISTS,
  CuratedSpotifyPlaylist,
  parseSpotifyUrl,
} from '../utils/spotify';
import { soundEngine } from '../utils/audio';

interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  spotifyUrl: string;
  onUpdateSpotifyUrl: (url: string) => void;
  ambientSound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe';
  ambientVolume: number;
  onAmbientSoundChange: (sound: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe') => void;
  onAmbientVolumeChange: (volume: number) => void;
}

/**
 * Isolated Spotify Embed IFrame component.
 * Kept alive in DOM so music is continuous.
 */
interface PersistentSpotifyEmbedProps {
  embedUrl: string;
}

const PersistentSpotifyEmbed = memo<PersistentSpotifyEmbedProps>(({ embedUrl }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-black/90 border border-white/10 shadow-inner">
      <iframe
        key={embedUrl}
        title="Spotify Official Embed Player"
        src={embedUrl}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        className="w-full border-0 rounded-2xl"
      />
    </div>
  );
});

PersistentSpotifyEmbed.displayName = 'PersistentSpotifyEmbed';

export const MusicDrawer: React.FC<MusicDrawerProps> = ({
  isOpen,
  onClose,
  theme: _theme,
  spotifyUrl,
  onUpdateSpotifyUrl,
  ambientSound,
  ambientVolume,
  onAmbientSoundChange,
  onAmbientVolumeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'spotify' | 'ambient'>('spotify');
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(ambientVolume);

  // Validate and parse Spotify URL
  const parsed = parseSpotifyUrl(spotifyUrl);
  const embedUrl = parsed.isValid && parsed.embedUrl
    ? parsed.embedUrl
    : 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0';

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a Spotify URL.');
      return;
    }

    const testParsed = parseSpotifyUrl(trimmed);
    if (!testParsed.isValid) {
      setErrorMessage(
        testParsed.error || 'Please enter a valid Spotify track, album, playlist, or artist URL.'
      );
      return;
    }

    onUpdateSpotifyUrl(trimmed);
    setIsEditing(false);
    setInputUrl('');
  };

  const handleSelectCurated = (playlist: CuratedSpotifyPlaylist) => {
    onUpdateSpotifyUrl(playlist.url);
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSelectSound = (id: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe') => {
    onAmbientSoundChange(id);
    if (id === 'none') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.startAmbient(id, isMuted ? 0 : ambientVolume);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onAmbientVolumeChange(prevVolume || 0.5);
      soundEngine.setAmbientVolume(prevVolume || 0.5);
    } else {
      setPrevVolume(ambientVolume);
      setIsMuted(true);
      onAmbientVolumeChange(0);
      soundEngine.setAmbientVolume(0);
    }
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onAmbientVolumeChange(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
    soundEngine.setAmbientVolume(val);
  };

  const ambientOptions: { id: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe'; label: string; icon: React.ReactNode }[] = [
    { id: 'none', label: 'Off', icon: <Ban className="w-4 h-4" /> },
    { id: 'rain', label: 'Rain', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'lofi', label: 'Lo-Fi', icon: <Music className="w-4 h-4" /> },
    { id: 'nature', label: 'Forest', icon: <Trees className="w-4 h-4" /> },
    { id: 'waves', label: 'Waves', icon: <Waves className="w-4 h-4" /> },
    { id: 'cafe', label: 'Café', icon: <Coffee className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Offscreen / Hidden Audio Anchor: Ensures persistent audio even when drawer is closed */}
      <div className={`fixed -left-[9999px] -top-[9999px] ${isOpen ? 'hidden' : 'block'}`}>
        <PersistentSpotifyEmbed embedUrl={embedUrl} />
      </div>

      {/* Floating Music Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[#12141c]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-6 text-neutral-100 overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setActiveTab('spotify')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'spotify'
                      ? 'bg-[#1DB954] text-black font-semibold shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Spotify</span>
                </button>
                <button
                  onClick={() => setActiveTab('ambient')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'ambient'
                      ? 'bg-sky-500 text-white font-semibold shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Ambient Sounds</span>
                  {ambientSound !== 'none' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close music panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spotify Tab Content */}
            {activeTab === 'spotify' && (
              <div className="mt-4 space-y-4">
                {/* Official Spotify Embed Player */}
                <PersistentSpotifyEmbed embedUrl={embedUrl} />

                {/* Edit Link or Add Custom Link */}
                {isEditing ? (
                  <form onSubmit={handleSaveUrl} className="space-y-3 pt-1">
                    <div>
                      <label htmlFor="spotify-url-input" className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Paste Spotify Track, Album, or Playlist URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="spotify-url-input"
                          type="url"
                          value={inputUrl}
                          onChange={(e) => {
                            setInputUrl(e.target.value);
                            setErrorMessage(null);
                          }}
                          placeholder="https://open.spotify.com/playlist/..."
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1aa34a] text-black text-xs font-semibold shadow-md transition-all active:scale-95"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setErrorMessage(null);
                          }}
                          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <button
                      onClick={() => {
                        setInputUrl(spotifyUrl);
                        setIsEditing(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white hover:underline underline-offset-2 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#1DB954]" />
                      <span>Change Spotify Link</span>
                    </button>

                    <a
                      href={spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Open in Spotify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Quick Focus Playlists */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-2">
                    Curated Focus Playlists
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CURATED_SPOTIFY_PLAYLISTS.map((pl) => {
                      const isActive = spotifyUrl === pl.url;
                      return (
                        <button
                          key={pl.id}
                          onClick={() => handleSelectCurated(pl)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all ${
                            isActive
                              ? 'bg-[#1DB954]/20 border border-[#1DB954]/50 text-white font-medium'
                              : 'bg-white/5 border border-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Headphones className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#1DB954]' : 'text-neutral-400'}`} />
                          <span className="truncate">{pl.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtle Spotify Info */}
                <p className="text-[10px] text-neutral-400/80 leading-relaxed border-t border-white/10 pt-2.5">
                  Powered by Spotify official embed. Log in to Spotify in your browser for full playlist and track playback.
                </p>
              </div>
            )}

            {/* Ambient Soundscapes Tab Content */}
            {activeTab === 'ambient' && (
              <div className="mt-4 space-y-4">
                <p className="text-xs text-neutral-300">
                  Built-in Web Audio generative soundscapes. Works seamlessly offline and blends with your focus.
                </p>

                {/* Sound Options Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {ambientOptions.map((opt) => {
                    const isSelected = ambientSound === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectSound(opt.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl text-xs transition-all ${
                          isSelected
                            ? 'bg-sky-500/20 border border-sky-400/50 text-white font-medium shadow-md shadow-sky-500/10'
                            : 'bg-white/5 border border-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-white/10 text-neutral-300'}`}>
                          {opt.icon}
                        </div>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Volume Slider (if sound active) */}
                {ambientSound !== 'none' && (
                  <div className="pt-2 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <button
                      onClick={handleToggleMute}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || ambientVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-sky-400" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : ambientVolume}
                      onChange={handleVolumeSlider}
                      className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="text-[11px] font-mono text-neutral-400 w-8 text-right">
                      {Math.round((isMuted ? 0 : ambientVolume) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
