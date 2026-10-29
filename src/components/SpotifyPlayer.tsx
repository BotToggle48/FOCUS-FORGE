import React, { useState, memo } from 'react';
import {
  Music,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Headphones,
  Check,
  Disc3,
  X,
  Maximize2,
  Minimize2,
  Info,
} from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import {
  CURATED_SPOTIFY_PLAYLISTS,
  CuratedSpotifyPlaylist,
  parseSpotifyUrl,
} from '../utils/spotify';

interface SpotifyPlayerProps {
  theme: ThemeConfig;
  spotifyUrl: string;
  onUpdateSpotifyUrl: (url: string) => void;
}

/**
 * Isolated Spotify Embed IFrame.
 * Memoized to prevent iframe reloads on timer ticks, theme changes, or parent state updates.
 */
interface SpotifyEmbedViewProps {
  embedUrl: string;
  isExpandedView: boolean;
}

const SpotifyEmbedView = memo<SpotifyEmbedViewProps>(({ embedUrl, isExpandedView }) => {
  const height = isExpandedView ? '352' : '152';

  return (
    <div className="overflow-hidden rounded-2xl bg-black/80 border border-white/10 shadow-inner transition-all duration-300">
      <iframe
        key={embedUrl}
        title="Spotify Official Embed Player"
        src={embedUrl}
        width="100%"
        height={height}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        className="w-full border-0 transition-all duration-300"
      />
    </div>
  );
});

SpotifyEmbedView.displayName = 'SpotifyEmbedView';

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = memo(({
  theme,
  spotifyUrl,
  onUpdateSpotifyUrl,
}) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(true);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const parsed = parseSpotifyUrl(spotifyUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMessage('Please enter a Spotify link');
      return;
    }

    const res = parseSpotifyUrl(inputUrl);
    if (res.isValid && res.embedUrl) {
      onUpdateSpotifyUrl(inputUrl.trim());
      setInputUrl('');
      setErrorMessage(null);
      setIsEditing(false);
      setIsPlayerOpen(true);
    } else {
      setErrorMessage(res.error || 'Invalid Spotify URL');
    }
  };

  const handleSelectCurated = (playlist: CuratedSpotifyPlaylist) => {
    onUpdateSpotifyUrl(playlist.url);
    setIsEditing(false);
    setIsPlayerOpen(true);
    setErrorMessage(null);
  };

  return (
    <div
      className={`w-full rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-4 sm:p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300`}
    >
      {/* Player Header & Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#1DB954]/20 border border-[#1DB954]/30 text-[#1DB954] shadow-sm shrink-0">
            <Disc3 className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                Focus Soundscape
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30 shrink-0">
                Spotify
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate">
              {parsed.isValid ? 'Official streaming embed connected' : 'Connect your Spotify playlists or study tracks'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Info tooltip button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1.5 rounded-xl border transition-all ${
              showInfo
                ? 'bg-[#1DB954]/20 border-[#1DB954]/40 text-[#1DB954]'
                : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
            }`}
            title="Spotify Playback Guide & Login Info"
            aria-label="Spotify Playback Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Size toggle (Compact vs Full Playlist view) */}
          {parsed.isValid && isPlayerOpen && (
            <button
              onClick={() => setIsExpandedView(!isExpandedView)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10"
              title={isExpandedView ? 'Compact player (152px)' : 'Expanded playlist view (352px)'}
              aria-label="Toggle player size"
            >
              {isExpandedView ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Change link button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all border border-white/10"
            title="Change Spotify Link"
          >
            {isEditing ? 'Cancel' : 'Change'}
          </button>

          {/* Collapse/Expand button */}
          <button
            onClick={() => setIsPlayerOpen(!isPlayerOpen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10"
            title={isPlayerOpen ? 'Collapse player' : 'Expand player'}
            aria-label="Toggle player visibility"
          >
            {isPlayerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Playback & Login Info Notice */}
      {showInfo && (
        <div className="mt-3 p-3 rounded-2xl bg-black/60 border border-emerald-500/20 text-xs text-neutral-300 space-y-1.5 animate-in fade-in duration-150">
          <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Spotify Playback Notice:
          </p>
          <p className="text-[11px] text-neutral-300/90 leading-relaxed">
            By Spotify policy, users not logged into Spotify in this browser will hear <strong>30-second previews</strong>.
            To enjoy <strong>full uninterrupted songs</strong>, simply make sure you are logged into your Spotify account in another tab on this browser, or click <em>"Open in Spotify"</em> below.
          </p>
        </div>
      )}

      {/* URL Input Form (when editing) */}
      {isEditing && (
        <div className="mt-4 pt-3.5 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Paste Spotify playlist, track, or album link..."
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-3.5 pr-8 py-2 bg-black/50 border border-white/15 focus:border-[#1DB954] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none transition-all"
                  autoFocus
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl('')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            {errorMessage && (
              <p className="flex items-center gap-1 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}

            {/* Quick 1-click curated focus playlists */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#1DB954]" /> Curated Study Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CURATED_SPOTIFY_PLAYLISTS.map((cp) => (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => handleSelectCurated(cp)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-all text-left"
                    title={cp.description}
                  >
                    <span>{cp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Embedded Spotify IFrame Player (when expanded) */}
      {isPlayerOpen && (
        <div className="mt-4 pt-3.5 border-t border-white/10 animate-in fade-in duration-200">
          {parsed.isValid && parsed.embedUrl ? (
            <SpotifyEmbedView
              embedUrl={parsed.embedUrl}
              isExpandedView={isExpandedView}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-black/30 border border-white/5">
              <Headphones className="w-8 h-8 text-neutral-500 mb-2" />
              <p className="text-xs font-semibold text-neutral-300">No Spotify playlist loaded</p>
              <p className="text-[11px] text-neutral-400 mt-1 max-w-xs">
                Paste any link from the Spotify app or web player to stream music alongside your timer.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
              >
                Paste a Spotify Link
              </button>
            </div>
          )}

          {/* Player footer info & external link */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400/80 mt-2 px-1">
            <span className="truncate">
              Full songs require active Spotify login in browser
            </span>
            <a
              href={spotifyUrl || 'https://open.spotify.com'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#1DB954] hover:underline font-medium shrink-0 ml-2"
            >
              <span>Open in Spotify</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
});

SpotifyPlayer.displayName = 'SpotifyPlayer';
