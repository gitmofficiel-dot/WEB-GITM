import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

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
