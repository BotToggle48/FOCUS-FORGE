import test from 'node:test';
import assert from 'node:assert/strict';

import { PACING_PRESETS, SOUND_EFFECTS_META } from '../../types/atlas';

test('pacing presets: provides valid timing configurations for all modes', () => {
  const classic = PACING_PRESETS.classic;
  assert.equal(classic.focusMinutes, 25);
  assert.equal(classic.breakMinutes, 5);
  assert.equal(classic.longBreakMinutes, 15);

  const deep = PACING_PRESETS.deep;
  assert.equal(deep.focusMinutes, 50);
  assert.equal(deep.breakMinutes, 10);

  const marathon = PACING_PRESETS.marathon;
  assert.equal(marathon.focusMinutes, 90);
  assert.equal(marathon.breakMinutes, 20);
});

test('sound effects metadata: has 14 distinct high-fidelity ambient categories', () => {
  assert.equal(SOUND_EFFECTS_META.length, 14);
  const rain = SOUND_EFFECTS_META.find((s) => s.id === 'rain');
  assert.ok(rain);
  assert.equal(rain.category, 'water');

  const fire = SOUND_EFFECTS_META.find((s) => s.id === 'fire');
  assert.ok(fire);
  assert.equal(fire.label, 'Campfire');
});
