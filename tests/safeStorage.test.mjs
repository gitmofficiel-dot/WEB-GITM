import test from 'node:test';
import assert from 'node:assert/strict';
import { createSafeStorage } from '../src/utils/safeStorage.js';

function createMemoryBackedMock(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    storage: {
      getItem: (k) => (data.has(k) ? data.get(k) : null),
      setItem: (k, v) => { data.set(k, String(v)); },
      removeItem: (k) => { data.delete(k); }
    }
  };
}

const isValidSavedItems = (val) =>
  Boolean(val) &&
  typeof val === 'object' &&
  !Array.isArray(val) &&
  Array.isArray(val.news) &&
  Array.isArray(val.books);

test('normal read, write, and remove roundtrip', () => {
  const { storage, data } = createMemoryBackedMock({ gitm_lang: 'en' });
  const safe = createSafeStorage(() => storage);

  assert.equal(safe.getItem('gitm_lang'), 'en');
  assert.equal(safe.setItem('gitm_theme', 'light'), true);
  assert.equal(data.get('gitm_theme'), 'light');
  assert.equal(safe.getItem('gitm_theme'), 'light');
  assert.equal(safe.removeItem('gitm_theme'), true);
  assert.equal(safe.getItem('gitm_theme'), null);
});

test('handles throwing localStorage getter without crashing and falls back to memory', () => {
  const safe = createSafeStorage(() => {
    const err = new Error('Access denied');
    err.name = 'SecurityError';
    throw err;
  });

  assert.equal(safe.getItem('gitm_users'), null);
  assert.equal(safe.setItem('gitm_lang', 'en'), false);
  assert.equal(safe.getItem('gitm_lang'), 'en');
  assert.equal(safe.removeItem('gitm_lang'), false);
  assert.equal(safe.getItem('gitm_lang'), null);
});

test('handles throwing getItem without crashing', () => {
  const safe = createSafeStorage(() => ({
    getItem() { throw new Error('SecurityError'); },
    setItem() {},
    removeItem() {}
  }));

  assert.equal(safe.getItem('gitm_users'), null);
  const res = safe.readJSON('gitm_users', Array.isArray, () => []);
  assert.deepEqual(res, { value: [], valid: true });
});

test('gives in-memory precedence after failed setItem over stale persistent value', () => {
  const { storage, data } = createMemoryBackedMock({ gitm_lang: 'ar' });
  storage.setItem = () => {
    const err = new Error('QuotaExceededError');
    err.name = 'QuotaExceededError';
    throw err;
  };
  const safe = createSafeStorage(() => storage);

  assert.equal(safe.getItem('gitm_lang'), 'ar');
  assert.equal(safe.setItem('gitm_lang', 'en'), false);
  assert.equal(safe.getItem('gitm_lang'), 'en');
  assert.equal(data.get('gitm_lang'), 'ar');
});

test('gives in-memory precedence after failed removeItem over stale persistent value', () => {
  const { storage, data } = createMemoryBackedMock({ gitm_user: '{"name":"Test"}' });
  storage.removeItem = () => {
    throw new Error('SecurityError');
  };
  const safe = createSafeStorage(() => storage);

  assert.equal(safe.removeItem('gitm_user'), false);
  assert.equal(safe.getItem('gitm_user'), null);
  assert.equal(data.get('gitm_user'), '{"name":"Test"}');
});

test('readString validates allowlist and preserves invalid original stored value', () => {
  const { storage, data } = createMemoryBackedMock({
    gitm_lang: 'xx',
    gitm_theme: 'light'
  });
  const safe = createSafeStorage(() => storage);

  const langRes = safe.readString('gitm_lang', ['ar', 'en', 'fr'], 'ar');
  assert.deepEqual(langRes, { value: 'ar', valid: false });
  assert.equal(data.get('gitm_lang'), 'xx');

  const themeRes = safe.readString('gitm_theme', ['dark', 'light'], 'dark');
  assert.deepEqual(themeRes, { value: 'light', valid: true });
});

test('readJSON validates arrays, returns fresh fallbacks, and preserves malformed data', () => {
  const { storage, data } = createMemoryBackedMock({
    gitm_users: '{',
    gitm_grades: '{"bad":true}',
    gitm_tasks: '[{"id":1}]'
  });
  const safe = createSafeStorage(() => storage);

  const usersA = safe.readJSON('gitm_users', Array.isArray, () => []);
  const usersB = safe.readJSON('gitm_users', Array.isArray, () => []);
  assert.deepEqual(usersA, { value: [], valid: false });
  assert.notEqual(usersA.value, usersB.value);
  assert.equal(data.get('gitm_users'), '{');

  const grades = safe.readJSON('gitm_grades', Array.isArray, () => []);
  assert.deepEqual(grades, { value: [], valid: false });
  assert.equal(data.get('gitm_grades'), '{"bad":true}');

  const tasks = safe.readJSON('gitm_tasks', Array.isArray, () => []);
  assert.deepEqual(tasks, { value: [{ id: 1 }], valid: true });
});

test('readJSON validates savedItems {news, books} strict arrays and fresh fallbacks', () => {
  const { storage, data } = createMemoryBackedMock({
    gitm_saved_items: '{"news":[{"id":1}],"books":"bad"}',
    bad_json: '{'
  });
  const safe = createSafeStorage(() => storage);

  const res1 = safe.readJSON('gitm_saved_items', isValidSavedItems, () => ({ news: [], books: [] }));
  const res2 = safe.readJSON('gitm_saved_items', isValidSavedItems, () => ({ news: [], books: [] }));
  assert.deepEqual(res1, { value: { news: [], books: [] }, valid: false });
  assert.notEqual(res1.value, res2.value);
  assert.notEqual(res1.value.news, res2.value.news);
  assert.equal(data.get('gitm_saved_items'), '{"news":[{"id":1}],"books":"bad"}');

  const badRes = safe.readJSON('bad_json', isValidSavedItems, () => ({ news: [], books: [] }));
  assert.deepEqual(badRes, { value: { news: [], books: [] }, valid: false });
});

test('createSafeStorage instances are isolated from each other', () => {
  const s1 = createSafeStorage(() => null);
  const s2 = createSafeStorage(() => null);
  s1.setItem('gitm_lang', 'en');
  assert.equal(s1.getItem('gitm_lang'), 'en');
  assert.equal(s2.getItem('gitm_lang'), null);
});
