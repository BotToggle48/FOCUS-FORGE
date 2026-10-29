export type SpotifyContentType = 'playlist' | 'album' | 'track' | 'artist' | 'episode' | 'show';

export interface SpotifyItem {
  id: string; // unique item id
  spotifyId: string;
  url: string;
  embedUrl: string;
  type: SpotifyContentType;
  title: string;
  subtitle?: string;
  addedAt: number; // timestamp
}

export interface SpotifyFavoritesState {
  favorites: SpotifyItem[];
  recent: SpotifyItem[];
}
