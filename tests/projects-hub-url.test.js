import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProjectsHubParams,
  parsePositivePage,
  parseProjectsHubParams,
  resolveProjectsHubCategory,
  resolveProjectsHubPage,
} from '../src/utils/projectsHubUrl.js';

test('return, reload, and back round-trip preserves q, category, page, and unrelated params', () => {
  const initial = new URLSearchParams('utm_source=test');
  const withFilters = buildProjectsHubParams(initial, {
    q: 'robot',
    category: 'Robotics',
    page: 2,
  });

  assert.equal(withFilters.toString(), 'utm_source=test&q=robot&category=Robotics&page=2');

  // Simulate navigating to /project-details/:id and returning via location.state.from
  const returnUrl = new URL(`/projects-hub?${withFilters.toString()}`, 'https://example.org');
  const restored = parseProjectsHubParams(returnUrl.searchParams);

  assert.deepEqual(restored, {
    q: 'robot',
    category: 'Robotics',
    page: 2,
  });
  assert.equal(returnUrl.searchParams.get('utm_source'), 'test');
});

test('defaults are omitted cleanly from URL search params', () => {
  const next = buildProjectsHubParams('q=robot&category=Robotics&page=3&ref=nav', {
    q: '   ',
    category: 'all',
    page: 1,
  });
  assert.equal(next.toString(), 'ref=nav');
});

test('invalid page values normalize to 1 and out-of-bounds pages clamp after load', () => {
  assert.equal(parsePositivePage(null), 1);
  assert.equal(parsePositivePage(''), 1);
  assert.equal(parsePositivePage('0'), 1);
  assert.equal(parsePositivePage('-4'), 1);
  assert.equal(parsePositivePage('abc'), 1);
  assert.equal(parsePositivePage('1.5'), 1);
  assert.equal(parsePositivePage('3'), 3);

  // Do not clamp while loading
  assert.equal(resolveProjectsHubPage(4, 0, true), 4);
  // Clamp to last valid page once loaded
  assert.equal(resolveProjectsHubPage(99, 3, false), 3);
  assert.equal(resolveProjectsHubPage(2, 3, false), 2);
});

test('invalid category is preserved during loading and normalized to all after load', () => {
  const available = ['all', 'Robotics', 'AI'];

  assert.equal(resolveProjectsHubCategory('Robotics', ['all'], true), 'Robotics');
  assert.equal(resolveProjectsHubCategory('UnknownCat', ['all'], true), 'UnknownCat');

  assert.equal(resolveProjectsHubCategory('Robotics', available, false), 'Robotics');
  assert.equal(resolveProjectsHubCategory('UnknownCat', available, false), 'all');
  assert.equal(resolveProjectsHubCategory('all', available, false), 'all');
});

test('empty results resolve to page 1 while preserving query and valid category', () => {
  const params = new URLSearchParams('q=no_match_xyz&category=AI&page=3');
  const parsed = parseProjectsHubParams(params);
  const category = resolveProjectsHubCategory(parsed.category, ['all', 'AI', 'Robotics'], false);
  const page = resolveProjectsHubPage(parsed.page, 0, false);

  assert.equal(parsed.q, 'no_match_xyz');
  assert.equal(category, 'AI');
  assert.equal(page, 1);

  const canonical = buildProjectsHubParams(params, {
    q: parsed.q,
    category,
    page,
  });
  assert.equal(canonical.toString(), 'q=no_match_xyz&category=AI');
});
