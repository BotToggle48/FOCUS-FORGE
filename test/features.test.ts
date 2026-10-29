import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSpotifyUrl, CURATED_SPOTIFY_PLAYLISTS } from '../src/utils/spotify.ts';
import { getTodayPhilosophyQuote, PHILOSOPHY_QUOTES } from '../src/constants/quotes.ts';

test('parseSpotifyUrl parses various valid Spotify formats correctly', () => {
  // Playlist URL with query params
  const playlist = parseSpotifyUrl('https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS?si=123');
  assert.equal(playlist.isValid, true);
  assert.equal(playlist.type, 'playlist');
  assert.equal(playlist.id, '37i9dQZF1DX8Uebhn9wzrS');
  assert.ok(playlist.embedUrl?.includes('open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS'));

  // Track URL
  const track = parseSpotifyUrl('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT');
  assert.equal(track.isValid, true);
  assert.equal(track.type, 'track');
  assert.equal(track.id, '4cOdK2wGLETKBW3PvgPWqT');

  // Album URL
  const album = parseSpotifyUrl('https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3');
  assert.equal(album.isValid, true);
  assert.equal(album.type, 'album');

  // Spotify URI format
  const uri = parseSpotifyUrl('spotify:playlist:37i9dQZF1DX8Uebhn9wzrS');
  assert.equal(uri.isValid, true);
  assert.equal(uri.type, 'playlist');
});

test('parseSpotifyUrl rejects invalid strings gracefully', () => {
  const empty = parseSpotifyUrl('');
  assert.equal(empty.isValid, false);

  const invalid = parseSpotifyUrl('https://youtube.com/watch?v=123');
  assert.equal(invalid.isValid, false);
});

test('CURATED_SPOTIFY_PLAYLISTS has 5 curated presets', () => {
  assert.equal(CURATED_SPOTIFY_PLAYLISTS.length, 5);
  CURATED_SPOTIFY_PLAYLISTS.forEach((p) => {
    const res = parseSpotifyUrl(p.url);
    assert.equal(res.isValid, true, `Preset ${p.name} should have valid Spotify URL`);
  });
});

test('Philosophy quotes has 30 unique original reflections', () => {
  assert.equal(PHILOSOPHY_QUOTES.length, 30);
  const quotesSet = new Set(PHILOSOPHY_QUOTES.map((q) => q.quote));
  assert.equal(quotesSet.size, 30, 'All 30 quotes should be unique');

  // Verify cycling works with dayOffset
  const today = getTodayPhilosophyQuote(0);
  assert.ok(today && today.quote.length > 10);

  const tomorrow = getTodayPhilosophyQuote(1);
  const yesterday = getTodayPhilosophyQuote(-1);
  assert.ok(tomorrow.quote);
  assert.ok(yesterday.quote);
});
