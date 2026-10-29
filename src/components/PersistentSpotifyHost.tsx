import React, { memo, useState, useEffect } from 'react';
import {
  Music,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Sparkles,
  Heart,
  Volume2,
  Info,
  Disc3,
  X,
  AlertCircle,
} from 'lucide-react';
import { SpotifyItem } from '../types/music';
import {
  parseSpotifyUrl,
  isSpotifyFavorite,
  toggleStoredSpotifyFavorite,
  getStoredSpotifyFavorites,
  addStoredSpotifyRecent,
} from '../utils/spotify';

interface PersistentSpotifyHostProps {
  currentSpotifyUrl: string;
  onUpdateSpotifyUrl: (url: string) => void;
  isMusicViewActive: boolean;
  onNavigateToMusic: () => void;
  isLight?: boolean;
}

/**
 * Single, persistent Spotify Embed iframe host.
 * Crucial design: This component remains mounted at the application root level across all view switches.
 * It NEVER unmounts on timer ticks, navigation changes, or theme updates.
 */
export const PersistentSpotifyHost: React.FC<PersistentSpotifyHostProps> = memo(({
  currentSpotifyUrl,
  onUpdateSpotifyUrl,
  isMusicViewActive,
  onNavigateToMusic,
  isLight = false,
}) => {
  const [isMiniPlayerMinimized, setIsMiniPlayerMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('focusforge_spotify_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const [isExpandedHeight, setIsExpandedHeight] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<SpotifyItem[]>(() => getStoredSpotifyFavorites());
  const [showLoginHelp, setShowLoginHelp] = useState<boolean>(false);

  // Sync favorites when changed externally
  useEffect(() => {
    const handleStorage = () => setFavorites(getStoredSpotifyFavorites());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const parsed = parseSpotifyUrl(currentSpotifyUrl);
  const embedUrl = parsed.isValid && parsed.embedUrl
    ? parsed.embedUrl
    : 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0';

  const isFav = isSpotifyFavorite(currentSpotifyUrl, favorites);

  const handleToggleFavorite = () => {
    if (!parsed.isValid) return;
    const item: SpotifyItem = {
      id: parsed.id || `spotify-${Date.now()}`,
      spotifyId: parsed.id || '',
      url: currentSpotifyUrl,
      embedUrl,
      type: parsed.type || 'playlist',
      title: parsed.suggestedTitle || `${parsed.type?.toUpperCase()} Playback`,
      addedAt: Date.now(),
    };
    const updated = toggleStoredSpotifyFavorite(item);
    setFavorites(updated);
  };

  const handleToggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMiniPlayerMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('focusforge_spotify_minimized', next ? 'true' : 'false');
      } catch {}
      return next;
    });
  };

  // If on the dedicated Music workspace, the full player area in MusicView is highlighted,
  // but to guarantee zero audio interruptions, the physical iframe stays in this stable host.
  // We dock it nicely at bottom-right or inside the active viewport based on mode.

  const iframeHeight = isExpandedHeight ? '352' : '152';

  return (
    <div
      aria-label="Spotify Continuous Playback Container"
      className={`transition-all duration-300 z-40 select-none ${
        isMusicViewActive
          ? 'fixed bottom-6 right-6 sm:right-8 w-[calc(100vw-3rem)] sm:w-[420px] max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
          : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-w-md shadow-2xl'
      }`}
      style={{
        pointerEvents: 'auto',
      }}
    >
      <div
        className="rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-2xl"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text-primary)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Mini-Player Header Bar */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5 border-b cursor-pointer"
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-bg-elevated)',
          }}
          onClick={() => {
            if (isMiniPlayerMinimized) setIsMiniPlayerMinimized(false);
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
              style={{
                backgroundColor: 'rgba(29, 185, 84, 0.15)',
                color: '#1DB954',
                border: '1px solid rgba(29, 185, 84, 0.3)',
              }}
            >
              <Disc3 className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold truncate" style={{ color: 'var(--theme-text-primary)' }}>
                  {parsed.suggestedTitle || 'Spotify Focus Player'}
                </span>
                <span
                  className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold tracking-wider"
                  style={{
                    backgroundColor: 'rgba(29, 185, 84, 0.15)',
                    color: '#1DB954',
                    border: '1px solid rgba(29, 185, 84, 0.3)',
                  }}
                >
                  {parsed.type || 'MUSIC'}
                </span>
              </div>
              <p className="text-[10px] truncate font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                {isMiniPlayerMinimized ? 'Playing in background • Click to expand' : 'Continuous streaming connected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Favorite toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: isFav ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                borderColor: isFav ? 'rgba(239, 68, 68, 0.3)' : 'var(--theme-border)',
                color: isFav ? '#EF4444' : 'var(--theme-text-secondary)',
              }}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>

            {/* Expand Height toggle (152px vs 352px) */}
            {!isMiniPlayerMinimized && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpandedHeight(!isExpandedHeight);
                }}
                className="p-1.5 rounded-lg border transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-secondary)',
                }}
                title={isExpandedHeight ? 'Compact view (152px)' : 'Expanded view (352px)'}
                aria-label="Toggle player height"
              >
                {isExpandedHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Open in full Music Workspace */}
            {!isMusicViewActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToMusic();
                }}
                className="p-1.5 rounded-lg border transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-secondary)',
                }}
                title="Open Music Workspace"
                aria-label="Open Music Workspace"
              >
                <Music className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Direct Open in Spotify Link */}
            <a
              href={parsed.canonicalUrl || currentSpotifyUrl || 'https://open.spotify.com'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--theme-border)',
                color: '#1DB954',
              }}
              title="Open directly in Spotify app/web"
              aria-label="Open in Spotify"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Minimize/Maximize button */}
            <button
              onClick={handleToggleMinimize}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-secondary)',
              }}
              title={isMiniPlayerMinimized ? 'Expand music player' : 'Minimize to bar'}
              aria-label="Toggle minimize"
            >
              {isMiniPlayerMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Player Body (Persistent IFrame) */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isMiniPlayerMinimized ? 'h-0 opacity-0 pointer-events-none' : 'p-3 opacity-100'
          }`}
        >
          {/* Official Spotify Embed Player */}
          <div
            className="rounded-xl overflow-hidden border shadow-inner"
            style={{
              borderColor: 'var(--theme-border)',
              backgroundColor: '#000000',
              height: `${iframeHeight}px`,
            }}
          >
            <iframe
              id="spotify-persistent-embed"
              title="FocusForge Spotify Player"
              src={embedUrl}
              width="100%"
              height={iframeHeight}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="eager"
              className="w-full h-full border-0 rounded-xl"
            />
          </div>

          {/* Footer Notice: Login for Full Songs Requirement */}
          <div className="flex items-center justify-between text-[10px] font-mono mt-2 px-1">
            <button
              onClick={() => setShowLoginHelp(!showLoginHelp)}
              className="flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              <Info className="w-3 h-3 text-[#1DB954]" />
              <span>Full Songs Guide</span>
            </button>

            <span style={{ color: 'var(--theme-text-secondary)' }}>
              Official Spotify Embed
            </span>
          </div>

          {/* Login Help Accordion */}
          {showLoginHelp && (
            <div
              className="mt-2 p-2.5 rounded-xl border text-[11px] leading-relaxed space-y-1 animate-in fade-in"
              style={{
                backgroundColor: 'var(--theme-bg-elevated)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-secondary)',
              }}
            >
              <p className="font-semibold text-emerald-400">
                How to Play Full Songs (No 30s cut-off):
              </p>
              <p>
                1. Spotify embeds play 30s previews unless logged in. Click the <strong>Log in</strong> button inside the player or be logged in at open.spotify.com.
              </p>
              <p>
                2. Once logged in, your full library and tracks will play uninterrupted as you focus!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PersistentSpotifyHost.displayName = 'PersistentSpotifyHost';
