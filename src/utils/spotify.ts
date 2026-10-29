import { SpotifyContentType, SpotifyItem } from '../types/music';

export interface SpotifyParseResult {
  isValid: boolean;
  embedUrl: string | null;
  type: SpotifyContentType | null;
  id: string | null;
  canonicalUrl: string | null;
  suggestedTitle?: string;
  error?: string;
}

export interface CuratedSpotifyPlaylist {
  id: string;
  name: string;
  genre: string;
  url: string;
  description: string;
  badge?: string;
}

export const CURATED_SPOTIFY_PLAYLISTS: CuratedSpotifyPlaylist[] = [
  {
    id: 'lofi-beats',
    name: 'Lo-Fi Beats',
    genre: 'Lo-Fi Chillhop',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS',
    description: 'Calm beats, soft kicks & warm vinyl warmth for studying.',
    badge: 'Popular',
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    genre: 'Atmospheric Ambient',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
    description: 'Keep calm and enter deep flow with ambient & post-rock soundscapes.',
    badge: 'Concentration',
  },
  {
    id: 'peaceful-piano',
    name: 'Peaceful Piano',
    genre: 'Classical & Acoustic',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    description: 'Relax and unwind with delicate acoustic piano melodies.',
    badge: 'Acoustic',
  },
  {
    id: 'synthwave-chill',
    name: 'Retro Synthwave Chill',
    genre: 'Cyberpunk & Synth',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    description: 'Nostalgic 80s arpeggios, neon synths & late night coding rhythm.',
    badge: 'Coding',
  },
  {
    id: 'brain-food',
    name: 'Brain Food',
    genre: 'Deep Electronic',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX3qCx52SuZ2Q',
    description: 'Hypnotic electronic and downtempo for uninterrupted flow state.',
    badge: 'Flow',
  },
  {
    id: 'instrumental-study',
    name: 'Instrumental Study',
    genre: 'Acoustic & Modern',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjG8',
    description: 'Soft instrumental background music for high-retention study.',
    badge: 'Study',
  },
  {
    id: 'ambient-chill',
    name: 'Ambient Chill',
    genre: 'Minimalist Soundscapes',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY',
    description: 'Subtle sound design and weightless textures to eliminate distractions.',
    badge: 'Zero Fatigue',
  },
  {
    id: 'lofi-sleep-study',
    name: 'Jazz in the Background',
    genre: 'Smooth Coffeehouse Jazz',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4wta20PHgwo',
    description: 'Warm double bass, brush snare, and vintage piano jazz.',
    badge: 'Coffeehouse',
  },
];

export const DEFAULT_SPOTIFY_URL = 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS';

/**
 * Validates and safely parses any Spotify playlist, album, track, artist, episode, or show URL/URI.
 * Supports standard web links, intl language links (e.g. /intl-es/), embed links, and URI schemes.
 */
export function parseSpotifyUrl(inputUrl: string): SpotifyParseResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      isValid: false,
      embedUrl: null,
      type: null,
      id: null,
      canonicalUrl: null,
      error: 'Please enter a Spotify URL',
    };
  }

  const clean = inputUrl.trim();

  // If already an embed URL (e.g. https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS...)
  if (clean.includes('open.spotify.com/embed/')) {
    const embedRegex = /open\.spotify\.com\/embed\/(playlist|track|album|artist|episode|show)\/([a-zA-Z0-9]+)/i;
    const match = clean.match(embedRegex);
    if (match) {
      const type = match[1].toLowerCase() as SpotifyContentType;
      const id = match[2];
      const canonicalUrl = `https://open.spotify.com/${type}/${id}`;
      const embedUrl = clean.includes('utm_source')
        ? clean
        : `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;

      // Check if matches curated list
      const curated = CURATED_SPOTIFY_PLAYLISTS.find((p) => p.url.includes(id));

      return {
        isValid: true,
        embedUrl,
        type,
        id,
        canonicalUrl,
        suggestedTitle: curated ? curated.name : `${capitalize(type)} (${id.slice(0, 6)}...)`,
      };
    }
  }

  // Handle standard Spotify web URLs:
  // e.g. https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS
  // e.g. https://open.spotify.com/intl-de/album/1DFixLWuPkv3KT3TnV35m3?si=123
  // e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
  const webRegex = /open\.spotify\.com\/(?:intl-[a-zA-Z0-9-]+\/)?(playlist|track|album|artist|episode|show)\/([a-zA-Z0-9]+)/i;
  const webMatch = clean.match(webRegex);

  if (webMatch) {
    const type = webMatch[1].toLowerCase() as SpotifyContentType;
    const id = webMatch[2];
    const canonicalUrl = `https://open.spotify.com/${type}/${id}`;
    const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    const curated = CURATED_SPOTIFY_PLAYLISTS.find((p) => p.url.includes(id));

    return {
      isValid: true,
      embedUrl,
      type,
      id,
      canonicalUrl,
      suggestedTitle: curated ? curated.name : `${capitalize(type)} (${id.slice(0, 6)}...)`,
    };
  }

  // Handle Spotify URI:
  // e.g. spotify:playlist:37i9dQZF1DX8Uebhn9wzrS
  // e.g. spotify:album:1DFixLWuPkv3KT3TnV35m3
  // e.g. spotify:track:4cOdK2wGLETKBW3PvgPWqT
  const uriRegex = /^spotify:(playlist|track|album|artist|episode|show):([a-zA-Z0-9]+)$/i;
  const uriMatch = clean.match(uriRegex);

  if (uriMatch) {
    const type = uriMatch[1].toLowerCase() as SpotifyContentType;
    const id = uriMatch[2];
    const canonicalUrl = `https://open.spotify.com/${type}/${id}`;
    const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    const curated = CURATED_SPOTIFY_PLAYLISTS.find((p) => p.url.includes(id));

    return {
      isValid: true,
      embedUrl,
      type,
      id,
      canonicalUrl,
      suggestedTitle: curated ? curated.name : `${capitalize(type)} (${id.slice(0, 6)}...)`,
    };
  }

  return {
    isValid: false,
    embedUrl: null,
    type: null,
    id: null,
    canonicalUrl: null,
    error: 'Please enter a valid Spotify album, playlist, or track URL (e.g. https://open.spotify.com/playlist/... or https://open.spotify.com/album/...)',
  };
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------------- LOCAL STORAGE FAVORITES & RECENTS ----------------

const STORAGE_KEY_FAVORITES = 'focusforge_spotify_favorites_v1';
const STORAGE_KEY_RECENT = 'focusforge_spotify_recent_v1';

export function getStoredSpotifyFavorites(): SpotifyItem[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error reading Spotify favorites:', e);
  }
  // Default seed: 2 curated favorites
  return [
    {
      id: 'lofi-beats',
      spotifyId: '37i9dQZF1DX8Uebhn9wzrS',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
      type: 'playlist',
      title: 'Lo-Fi Beats',
      subtitle: 'Chillhop study beats',
      addedAt: Date.now() - 86400000,
    },
    {
      id: 'deep-focus',
      spotifyId: '37i9dQZF1DWZeKCadgRdKQ',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0',
      type: 'playlist',
      title: 'Deep Focus',
      subtitle: 'Atmospheric post-rock & ambient',
      addedAt: Date.now() - 43200000,
    },
  ];
}

export function setStoredSpotifyFavorites(items: SpotifyItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage error saving Spotify favorites:', e);
  }
}

export function toggleStoredSpotifyFavorite(item: SpotifyItem): SpotifyItem[] {
  const existing = getStoredSpotifyFavorites();
  const index = existing.findIndex((f) => f.url === item.url || f.spotifyId === item.spotifyId);
  let updated: SpotifyItem[];
  if (index >= 0) {
    updated = existing.filter((_, i) => i !== index);
  } else {
    updated = [item, ...existing];
  }
  setStoredSpotifyFavorites(updated);
  return updated;
}

export function isSpotifyFavorite(url: string, favorites: SpotifyItem[]): boolean {
  if (!url) return false;
  const parsed = parseSpotifyUrl(url);
  if (!parsed.isValid || !parsed.id) return false;
  return favorites.some((f) => f.url === url || (parsed.id && f.spotifyId === parsed.id));
}

export function getStoredSpotifyRecent(): SpotifyItem[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_RECENT);
    if (val) {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage error reading Spotify recent items:', e);
  }
  return [];
}

export function addStoredSpotifyRecent(item: SpotifyItem): SpotifyItem[] {
  try {
    const existing = getStoredSpotifyRecent().filter(
      (r) => r.url !== item.url && r.spotifyId !== item.spotifyId
    );
    const updated = [item, ...existing].slice(0, 10); // keep 10 most recent
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('LocalStorage error writing Spotify recent items:', e);
    return [];
  }
}
