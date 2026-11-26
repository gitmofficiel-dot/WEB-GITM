import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hasCourseModules, resolveCourseStartTransition } from '../src/utils/academyCourseState.js';

const academySource = fs.readFileSync(
  new URL('../src/components/Academy.jsx', import.meta.url),
  'utf8'
);

test('Academy removes six-month duration fallback and guards duration display', () => {
  assert.doesNotMatch(academySource, /6\s*Months/i);
  assert.doesNotMatch(academySource, /6\s*mois/i);
  assert.match(academySource, /String\(activeCourse\.duration \|\| ''\)\.trim\(\)/);
});

test('Academy removes unsupported expert and learning outcome promises', () => {
  assert.doesNotMatch(academySource, /What you will learn/i);
  assert.doesNotMatch(academySource, /ماذا ستتعلم/);
  assert.doesNotMatch(academySource, /Ce que vous allez apprendre/i);
  assert.doesNotMatch(academySource, /Learn from industry experts/i);
  assert.doesNotMatch(academySource, /التعلم من خبراء الصناعة/);
  assert.doesNotMatch(academySource, /from top experts in technology and business/i);
  assert.doesNotMatch(academySource, /من أفضل الخبراء في التكنولوجيا والأعمال/);
  assert.doesNotMatch(academySource, /experts en technologie et en affaires/i);
});

test('Empty or missing curriculum courses cannot transition into enrolled/started state', () => {
  for (const emptyCourse of [null, undefined, {}, { id: 'c1' }, { id: 'c2', modules: null }, { id: 'c3', modules: [] }]) {
    assert.equal(hasCourseModules(emptyCourse), false);
    assert.deepEqual(resolveCourseStartTransition(emptyCourse), {
      started: false,
      showIntro: false,
      allowed: false,
    });
  }
});

test('Populated curriculum courses preserve start and intro transitions unchanged', () => {
  const withoutIntro = { id: 'c4', modules: [{ id: 'm1', title: 'Lesson 1' }] };
  assert.equal(hasCourseModules(withoutIntro), true);
  assert.deepEqual(resolveCourseStartTransition(withoutIntro), {
    started: true,
    showIntro: false,
    allowed: true,
  });

  const withIntro = { id: 'c5', modules: [{ id: 'm1' }], courseIntroText: 'Overview' };
  assert.equal(hasCourseModules(withIntro), true);
  assert.deepEqual(resolveCourseStartTransition(withIntro), {
    started: true,
    showIntro: true,
    allowed: true,
  });

  assert.match(academySource, /resolveCourseStartTransition\(activeCourse\)/);
  assert.match(academySource, /!hasCourseModules\(activeCourse\)/);
  assert.match(academySource, /disabled\s+aria-disabled="true"/);
});
