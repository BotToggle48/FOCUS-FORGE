import test from 'node:test';
import assert from 'node:assert/strict';

import { THEME_PRESETS, THEMES_LIST, DEFAULT_THEME_ID, AMBIENT_PRESETS } from '../../constants/themes';
import { ThemePresetId } from '../../types/theme';

test('theme system: default theme is midnight-aurora', () => {
  assert.equal(DEFAULT_THEME_ID, 'midnight-aurora');
  const defaultTheme = THEME_PRESETS[DEFAULT_THEME_ID];
  assert.ok(defaultTheme);
  assert.equal(defaultTheme.name, 'Midnight Aurora');
  assert.equal(defaultTheme.colors.mainBg, '#0B1020');
  assert.equal(defaultTheme.colors.cardBg, '#151D30');
  assert.equal(defaultTheme.colors.primaryAccent, '#43E6C3');
});

test('theme presets: all 6 complete themes exist with full token definitions', () => {
  const expectedKeys: ThemePresetId[] = [
    'midnight-aurora',
    'warm-paper',
    'forest-focus',
    'lavender-dream',
    'obsidian',
    'ember-sunset',
  ];

  assert.equal(THEMES_LIST.length, 6);

  expectedKeys.forEach((key) => {
    const theme = THEME_PRESETS[key];
    assert.ok(theme, `Theme ${key} should exist`);
    assert.ok(theme.name);
    assert.ok(theme.colors.mainBg);
    assert.ok(theme.colors.sidebarBg);
    assert.ok(theme.colors.cardBg);
    assert.ok(theme.colors.elevatedBg);
    assert.ok(theme.colors.primaryAccent);
    assert.ok(theme.colors.hoverAccent);
    assert.ok(theme.colors.primaryText);
    assert.ok(theme.colors.secondaryText);
    assert.ok(theme.colors.border);
    assert.ok(theme.colors.success);
    assert.ok(theme.colors.warning);
    assert.ok(theme.colors.error);
    assert.equal(theme.swatches.length, 4);
  });
});

test('warm paper: correctly configured as light theme with high contrast text', () => {
  const warmPaper = THEME_PRESETS['warm-paper'];
  assert.equal(warmPaper.isLight, true);
  assert.equal(warmPaper.colors.mainBg, '#F7F4ED');
  assert.equal(warmPaper.colors.cardBg, '#FFFFFF');
  assert.equal(warmPaper.colors.primaryAccent, '#65866D');
  assert.equal(warmPaper.colors.primaryText, '#292F2B');
});

test('ambient presets: includes the 6 requested environments', () => {
  assert.equal(AMBIENT_PRESETS.length, 6);
  const ids = AMBIENT_PRESETS.map((p) => p.id);
  assert.deepEqual(ids, ['none', 'rainy', 'library', 'forest', 'ocean', 'space']);
});
