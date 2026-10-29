import test from 'node:test';
import assert from 'node:assert/strict';

// Import pure logic functions
import { parseSpotifyUrl, CURATED_SPOTIFY_PLAYLISTS } from '../../utils/spotify.ts';
import { calculateProductivityStats } from '../../utils/storage.ts';
import { getTodayPhilosophyQuote, PHILOSOPHY_QUOTES } from '../../constants/quotes.ts';

test('parseSpotifyUrl: converts standard web URLs into valid embed URLs', () => {
  const playlistUrl = 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS';
  const parsed = parseSpotifyUrl(playlistUrl);
  assert.equal(parsed.isValid, true);
  assert.equal(parsed.type, 'playlist');
  assert.equal(parsed.id, '37i9dQZF1DX8Uebhn9wzrS');
  assert.match(parsed.embedUrl, /https:\/\/open\.spotify\.com\/embed\/playlist\/37i9dQZF1DX8Uebhn9wzrS/);
});

test('parseSpotifyUrl: rejects invalid inputs gracefully', () => {
  const invalid = parseSpotifyUrl('https://google.com');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.error);

  const empty = parseSpotifyUrl('');
  assert.equal(empty.isValid, false);
});

test('curated playlists: contains standard focus selections', () => {
  assert.ok(CURATED_SPOTIFY_PLAYLISTS.length >= 5);
  const lofi = CURATED_SPOTIFY_PLAYLISTS.find(p => p.id === 'lofi-beats');
  assert.ok(lofi);
  assert.equal(lofi.name, 'Lo-Fi Beats');
});

test('calculateProductivityStats: accurately calculates streaks and daily minutes', () => {
  const now = Date.now();
  const mockSessions = [
    {
      id: '1',
      timestamp: now,
      mode: 'focus',
      durationMinutes: 25,
    },
    {
      id: '2',
      timestamp: now,
      mode: 'focus',
      durationMinutes: 25,
    },
    {
      id: '3',
      timestamp: now,
      mode: 'shortBreak',
      durationMinutes: 5,
    },
  ];
  const mockTasks = [
    { id: 't1', title: 'Task 1', completed: true, priority: 'high', estimatedSessions: 2, completedSessions: 2, createdAt: now },
    { id: 't2', title: 'Task 2', completed: false, priority: 'medium', estimatedSessions: 1, completedSessions: 0, createdAt: now },
  ];

  const stats = calculateProductivityStats(mockSessions, mockTasks);
  assert.equal(stats.focusSessionsToday, 2);
  assert.equal(stats.totalFocusMinutesToday, 50);
  assert.equal(stats.completedTasksCount, 1);
  assert.ok(stats.streak >= 1);
});

test('30-day philosophy bank: returns valid quotes across 30 day cycle', () => {
  assert.equal(PHILOSOPHY_QUOTES.length, 30);
  
  for (let offset = -15; offset <= 15; offset++) {
    const q = getTodayPhilosophyQuote(offset);
    assert.ok(q);
    assert.ok(q.quote && q.quote.length > 10);
  }
});
