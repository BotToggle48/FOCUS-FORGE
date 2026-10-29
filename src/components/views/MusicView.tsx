import React, { useState } from 'react';
import {
  Music,
  Plus,
  Play,
  Heart,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Headphones,
  CheckCircle2,
  Trash2,
  Clock,
  RotateCcw,
  Info,
  Check,
  Disc3,
  ListMusic,
  FolderHeart,
  History,
  Copy,
} from 'lucide-react';
import { SpotifyItem } from '../../types/music';
import {
  parseSpotifyUrl,
  CURATED_SPOTIFY_PLAYLISTS,
  CuratedSpotifyPlaylist,
  isSpotifyFavorite,
  toggleStoredSpotifyFavorite,
  getStoredSpotifyFavorites,
  getStoredSpotifyRecent,
  addStoredSpotifyRecent,
} from '../../utils/spotify';

interface MusicViewProps {
  currentSpotifyUrl: string;
  onSelectSpotifyUrl: (url: string) => void;
  isLight?: boolean;
}

export const MusicView: React.FC<MusicViewProps> = ({
  currentSpotifyUrl,
  onSelectSpotifyUrl,
  isLight = false,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<SpotifyItem[]>(() => getStoredSpotifyFavorites());
  const [recents, setRecents] = useState<SpotifyItem[]>(() => getStoredSpotifyRecent());
  const [copiedLink, setCopiedLink] = useState(false);

  const parsedCurrent = parseSpotifyUrl(currentSpotifyUrl);
  const isCurrentFavorite = isSpotifyFavorite(currentSpotifyUrl, favorites);

  const handleLoadUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const clean = inputUrl.trim();
    if (!clean) {
      setErrorMessage('Please paste a Spotify album, playlist, or track URL.');
      return;
    }

    const res = parseSpotifyUrl(clean);
    if (!res.isValid || !res.embedUrl) {
      setErrorMessage(
        res.error || 'Invalid Spotify URL. Please paste a link like https://open.spotify.com/album/... or playlist/...'
      );
      return;
    }

    onSelectSpotifyUrl(clean);
    const item: SpotifyItem = {
      id: res.id || `spotify-${Date.now()}`,
      spotifyId: res.id || '',
      url: clean,
      embedUrl: res.embedUrl,
      type: res.type || 'playlist',
      title: res.suggestedTitle || `${res.type?.toUpperCase()} Playback`,
      addedAt: Date.now(),
    };
    const updatedRecents = addStoredSpotifyRecent(item);
    setRecents(updatedRecents);

    setInputUrl('');
    setSuccessMessage(`Loaded ${res.type}: ${res.suggestedTitle || 'Spotify content'}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSelectCurated = (playlist: CuratedSpotifyPlaylist) => {
    onSelectSpotifyUrl(playlist.url);
    const item: SpotifyItem = {
      id: playlist.id,
      spotifyId: playlist.url.split('/').pop() || '',
      url: playlist.url,
      embedUrl: `https://open.spotify.com/embed/playlist/${playlist.url.split('/').pop()}?utm_source=generator&theme=0`,
      type: 'playlist',
      title: playlist.name,
      subtitle: playlist.genre,
      addedAt: Date.now(),
    };
    const updatedRecents = addStoredSpotifyRecent(item);
    setRecents(updatedRecents);
  };

  const handleToggleFavoriteCurrent = () => {
    if (!parsedCurrent.isValid) return;
    const item: SpotifyItem = {
      id: parsedCurrent.id || `spotify-${Date.now()}`,
      spotifyId: parsedCurrent.id || '',
      url: currentSpotifyUrl,
      embedUrl: parsedCurrent.embedUrl || '',
      type: parsedCurrent.type || 'playlist',
      title: parsedCurrent.suggestedTitle || `${parsedCurrent.type?.toUpperCase()} Playback`,
      addedAt: Date.now(),
    };
    const updated = toggleStoredSpotifyFavorite(item);
    setFavorites(updated);
  };

  const handleRemoveFavorite = (favItem: SpotifyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleStoredSpotifyFavorite(favItem);
    setFavorites(updated);
  };

  const handleCopyLink = () => {
    if (!currentSpotifyUrl) return;
    navigator.clipboard.writeText(currentSpotifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2" style={{ color: 'var(--theme-text-primary)' }}>
      {/* 1. Header Banner */}
      <div
        className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ backgroundColor: 'var(--theme-accent-primary)' }}
        />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md shrink-0"
              style={{
                backgroundColor: 'rgba(29, 185, 84, 0.15)',
                borderColor: 'rgba(29, 185, 84, 0.4)',
                color: '#1DB954',
              }}
            >
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Spotify Music Integration</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">
                  OFFICIAL EMBED
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                Continuous album & playlist playback that never pauses when switching routes or resetting timers.
              </p>
            </div>
          </div>
        </div>

        {/* Streaming notice pill */}
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono self-start md:self-auto relative z-10"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <Disc3 className="w-4 h-4 text-[#1DB954] animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
              Decoupled Audio
            </p>
            <p className="text-[10px]" style={{ color: 'var(--theme-text-secondary)' }}>
              Persistent root player active
            </p>
          </div>
        </div>
      </div>

      {/* 2. Paste & Load Link Input Card */}
      <div
        className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold tracking-tight">Paste Any Spotify Album, Playlist, or Track Link</h3>
            <p className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              Supports URLs from Spotify Desktop or Web (e.g. open.spotify.com/album/..., /playlist/..., /track/...).
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
            <span>Examples:</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">album/ID</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">playlist/ID</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">track/ID</span>
          </div>
        </div>

        <form onSubmit={handleLoadUrl} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://open.spotify.com/album/..."
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border text-xs focus:outline-none transition-all font-mono"
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: errorMessage ? 'var(--theme-error)' : 'var(--theme-border)',
                  color: 'var(--theme-text-primary)',
                }}
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              style={{
                backgroundColor: 'var(--theme-accent-primary)',
                color: isLight ? '#FFFFFF' : '#0B1020',
                boxShadow: '0 4px 14px var(--theme-accent-glow)',
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Load Content</span>
            </button>
          </div>

          {/* Validation Feedback */}
          {errorMessage && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl border text-xs animate-in fade-in"
              style={{
                backgroundColor: 'rgba(255, 112, 125, 0.12)',
                borderColor: 'var(--theme-error)',
                color: 'var(--theme-error)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl border text-xs animate-in fade-in"
              style={{
                backgroundColor: 'rgba(67, 217, 163, 0.12)',
                borderColor: 'var(--theme-success)',
                color: 'var(--theme-success)',
              }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </form>
      </div>

      {/* 3. Currently Loaded Content Details & Full Songs Guidance */}
      <div
        className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-md"
              style={{
                backgroundColor: 'rgba(29, 185, 84, 0.15)',
                borderColor: 'rgba(29, 185, 84, 0.4)',
                color: '#1DB954',
              }}
            >
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.2 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  CURRENTLY ACTIVE
                </span>
                <span className="text-xs font-mono uppercase" style={{ color: 'var(--theme-text-secondary)' }}>
                  {parsedCurrent.type}
                </span>
              </div>
              <h4 className="text-base font-bold mt-0.5" style={{ color: 'var(--theme-text-primary)' }}>
                {parsedCurrent.suggestedTitle || 'Spotify Soundscape'}
              </h4>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleFavoriteCurrent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: isCurrentFavorite ? 'rgba(239, 68, 68, 0.15)' : 'var(--theme-bg-elevated)',
                borderColor: isCurrentFavorite ? 'rgba(239, 68, 68, 0.4)' : 'var(--theme-border)',
                color: isCurrentFavorite ? '#EF4444' : 'var(--theme-text-primary)',
              }}
            >
              <Heart className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-current' : ''}`} />
              <span>{isCurrentFavorite ? 'Favorited' : 'Save Favorite'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--theme-bg-elevated)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-primary)',
              }}
              title="Copy Spotify URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <a
              href={parsedCurrent.canonicalUrl || currentSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer hover:bg-emerald-500/10"
              style={{
                borderColor: 'rgba(29, 185, 84, 0.4)',
                color: '#1DB954',
                backgroundColor: 'var(--theme-bg-elevated)',
              }}
            >
              <span>Open in Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Guidance Banner on Full Song Playback vs 30s Previews */}
        <div
          className="p-4 rounded-xl border text-xs leading-relaxed space-y-1.5"
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text-secondary)',
          }}
        >
          <p className="font-semibold flex items-center gap-1.5 text-emerald-400">
            <Info className="w-4 h-4 shrink-0" />
            <span>How to Ensure Full Song Playback (Never Stops at 30 Seconds)</span>
          </p>
          <p>
            Spotify's platform policy serves 30-second previews to logged-out browser sessions.
            To enjoy <strong>full, uninterrupted albums and playlists</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li>Click the <strong>Log in</strong> button located directly inside the Spotify embed player at the bottom right.</li>
            <li>Alternatively, log into your Spotify account at <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="underline text-emerald-400">open.spotify.com</a> in this browser.</li>
            <li>Our persistent player stays alive during route switches, timer ticks, and theme updates so your music never drops!</li>
          </ul>
        </div>
      </div>

      {/* 4. Curated Focus Playlists */}
      <div
        className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
        style={{
          backgroundColor: 'var(--theme-bg-card)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--theme-accent-primary)' }} />
            <h3 className="text-sm sm:text-base font-bold">Curated Focus Soundtracks</h3>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
            8 Handpicked Flow Presets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CURATED_SPOTIFY_PLAYLISTS.map((pl) => {
            const isPlayingThis = currentSpotifyUrl === pl.url;

            return (
              <div
                key={pl.id}
                onClick={() => handleSelectCurated(pl)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isPlayingThis ? 'ring-2 scale-102 shadow-lg' : 'hover:scale-101'
                }`}
                style={{
                  backgroundColor: 'var(--theme-bg-elevated)',
                  borderColor: isPlayingThis ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                  boxShadow: isPlayingThis ? '0 0 16px var(--theme-accent-glow)' : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border"
                      style={{
                        backgroundColor: isPlayingThis ? 'var(--theme-accent-glow)' : 'transparent',
                        borderColor: isPlayingThis ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                        color: isPlayingThis ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)',
                      }}
                    >
                      {pl.badge || 'FOCUS'}
                    </span>
                    {isPlayingThis && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <Disc3 className="w-3.5 h-3.5 animate-spin" /> Loaded
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold transition-colors group-hover:text-emerald-400" style={{ color: 'var(--theme-text-primary)' }}>
                    {pl.name}
                  </h4>
                  <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--theme-accent-primary)' }}>
                    {pl.genre}
                  </p>
                  <p className="text-[10px] mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                    {pl.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t flex items-center justify-between text-[10px] font-mono font-semibold" style={{ borderColor: 'var(--theme-border)' }}>
                  <span style={{ color: isPlayingThis ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)' }}>
                    {isPlayingThis ? 'Active' : 'Load Playlist'}
                  </span>
                  <Play className="w-3 h-3 fill-current opacity-70 group-hover:opacity-100" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Favorites & Recents 2-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Column 1: Favorites */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm sm:text-base font-bold">Saved Favorites</h3>
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
              {favorites.length} saved
            </span>
          </div>

          {favorites.length === 0 ? (
            <div
              className="py-8 text-center rounded-xl border space-y-2 p-4"
              style={{
                backgroundColor: 'var(--theme-bg-elevated)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <Heart className="w-7 h-7 mx-auto text-neutral-500 stroke-[1.5]" />
              <p className="text-xs font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                No favorites saved yet.
              </p>
              <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                Click the heart icon on any loaded album or playlist to save it here for instant one-click access.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {favorites.map((fav) => {
                const isPlaying = currentSpotifyUrl === fav.url;

                return (
                  <div
                    key={fav.id}
                    onClick={() => onSelectSpotifyUrl(fav.url)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isPlaying ? 'ring-1' : 'hover:bg-white/[0.04]'
                    }`}
                    style={{
                      backgroundColor: 'var(--theme-bg-elevated)',
                      borderColor: isPlaying ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isPlaying ? 'var(--theme-accent-primary)' : 'var(--theme-border)' }} />
                      <div className="min-w-0">
                        <p className="font-semibold truncate" style={{ color: 'var(--theme-text-primary)' }}>
                          {fav.title}
                        </p>
                        <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--theme-text-secondary)' }}>
                          {fav.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleRemoveFavorite(fav, e)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 2: Recently Played */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl"
          style={{
            backgroundColor: 'var(--theme-bg-card)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" style={{ color: 'var(--theme-accent-primary)' }} />
              <h3 className="text-sm sm:text-base font-bold">Recently Opened</h3>
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
              {recents.length} recent
            </span>
          </div>

          {recents.length === 0 ? (
            <div
              className="py-8 text-center rounded-xl border space-y-2 p-4"
              style={{
                backgroundColor: 'var(--theme-bg-elevated)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <Clock className="w-7 h-7 mx-auto text-neutral-500 stroke-[1.5]" />
              <p className="text-xs font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                No recently played links.
              </p>
              <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                Paste or select an album or playlist above to start your listening history.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recents.map((item, idx) => {
                const isPlaying = currentSpotifyUrl === item.url;

                return (
                  <div
                    key={`${item.url}-${idx}`}
                    onClick={() => onSelectSpotifyUrl(item.url)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isPlaying ? 'ring-1' : 'hover:bg-white/[0.04]'
                    }`}
                    style={{
                      backgroundColor: 'var(--theme-bg-elevated)',
                      borderColor: isPlaying ? 'var(--theme-accent-primary)' : 'var(--theme-border)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isPlaying ? 'var(--theme-accent-primary)' : 'var(--theme-border)' }} />
                      <div className="min-w-0">
                        <p className="font-semibold truncate" style={{ color: 'var(--theme-text-primary)' }}>
                          {item.title}
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--theme-text-secondary)' }}>
                          {item.addedAt ? new Date(item.addedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase font-bold" style={{ color: isPlaying ? 'var(--theme-accent-primary)' : 'var(--theme-text-secondary)' }}>
                      {isPlaying ? 'Playing' : 'Open'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
