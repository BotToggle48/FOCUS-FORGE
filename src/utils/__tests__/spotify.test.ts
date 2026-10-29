import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSpotifyUrl,
  CURATED_SPOTIFY_PLAYLISTS,
  DEFAULT_SPOTIFY_URL,
} from '../spotify';

test('Spotify: Parses standard album URL correctly', () => {
  const url = 'https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3';
  const res = parseSpotifyUrl(url);

  assert.equal(res.isValid, true);
  assert.equal(res.type, 'album');
  assert.equal(res.id, '1DFixLWuPkv3KT3TnV35m3');
  assert.equal(res.canonicalUrl, 'https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3');
  assert.equal(
    res.embedUrl,
    'https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3?utm_source=generator&theme=0'
  );
});

test('Spotify: Parses playlist URL with query parameters correctly', () => {
  const url = 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS?si=abc123xyz';
  const res = parseSpotifyUrl(url);

  assert.equal(res.isValid, true);
  assert.equal(res.type, 'playlist');
  assert.equal(res.id, '37i9dQZF1DX8Uebhn9wzrS');
  assert.equal(res.canonicalUrl, 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS');
  assert.equal(
    res.embedUrl,
    'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0'
  );
});

test('Spotify: Parses track URL correctly', () => {
  const url = 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT';
  const res = parseSpotifyUrl(url);

  assert.equal(res.isValid, true);
  assert.equal(res.type, 'track');
  assert.equal(res.id, '4cOdK2wGLETKBW3PvgPWqT');
  assert.equal(res.canonicalUrl, 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT');
  assert.equal(
    res.embedUrl,
    'https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT?utm_source=generator&theme=0'
  );
});

test('Spotify: Parses internationalized URLs (e.g. /intl-de/album/...)', () => {
  const url = 'https://open.spotify.com/intl-de/album/4m2880jivSbbyEGAKfITCa';
  const res = parseSpotifyUrl(url);

  assert.equal(res.isValid, true);
  assert.equal(res.type, 'album');
  assert.equal(res.id, '4m2880jivSbbyEGAKfITCa');
  assert.equal(res.canonicalUrl, 'https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa');
});

test('Spotify: Parses URI scheme formats (spotify:album:...)', () => {
  const uri = 'spotify:album:1DFixLWuPkv3KT3TnV35m3';
  const res = parseSpotifyUrl(uri);

  assert.equal(res.isValid, true);
  assert.equal(res.type, 'album');
  assert.equal(res.id, '1DFixLWuPkv3KT3TnV35m3');
  assert.equal(res.canonicalUrl, 'https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3');
  assert.equal(
    res.embedUrl,
    'https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3?utm_source=generator&theme=0'
  );
});

test('Spotify: Rejects invalid or dangerous non-Spotify URLs safely', () => {
  assert.equal(parseSpotifyUrl('').isValid, false);
  assert.equal(parseSpotifyUrl('https://evil.com/malware').isValid, false);
  assert.equal(parseSpotifyUrl('javascript:alert(1)').isValid, false);
  assert.equal(parseSpotifyUrl('https://youtube.com/watch?v=123').isValid, false);
  assert.equal(parseSpotifyUrl('https://open.spotify.com/user/fakeuser').isValid, false);
});

test('Spotify: Default and curated playlists are all valid Spotify links', () => {
  const defaultRes = parseSpotifyUrl(DEFAULT_SPOTIFY_URL);
  assert.equal(defaultRes.isValid, true);
  assert.equal(defaultRes.type, 'playlist');

  assert.ok(CURATED_SPOTIFY_PLAYLISTS.length >= 8);
  for (const playlist of CURATED_SPOTIFY_PLAYLISTS) {
    const res = parseSpotifyUrl(playlist.url);
    assert.equal(res.isValid, true, `Curated playlist ${playlist.name} should be valid`);
    assert.equal(res.type, 'playlist');
    assert.ok(res.embedUrl?.startsWith('https://open.spotify.com/embed/playlist/'));
  }
});
