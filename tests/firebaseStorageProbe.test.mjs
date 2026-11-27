import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const firebaseSourcePath = path.resolve(__dirname, '../src/config/firebase.js');

function loadProbeHelpers(windowObj) {
  const source = fs.readFileSync(firebaseSourcePath, 'utf8');
  const start = source.indexOf('function probeStorage(');
  const end = source.indexOf('export const app =');
  assert.ok(start !== -1 && end !== -1 && end > start, 'Expected probe helpers in firebase.js');

  const snippet = source.slice(start, end);
  const context = vm.createContext({
    window: windowObj,
    Date,
    Math
  });
  vm.runInContext(`${snippet}\nthis.probeStorage = probeStorage;\nthis.isBrowserStorageAvailable = isBrowserStorageAvailable;`, context);
  return {
    probeStorage: context.probeStorage,
    isBrowserStorageAvailable: context.isBrowserStorageAvailable
  };
}

function createMockStorage(initial = {}, overrides = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: overrides.getItem || ((k) => (map.has(k) ? map.get(k) : null)),
    setItem: overrides.setItem || ((k, v) => { map.set(k, String(v)); }),
    removeItem: overrides.removeItem || ((k) => { map.delete(k); })
  };
}

test('normal success cleans up transient probe key and preserves unrelated keys', () => {
  const local = createMockStorage({ gitm_lang: 'ar', gitm_users: '[{"id":1}]' });
  const session = createMockStorage({ session_flag: '1' });
  const { isBrowserStorageAvailable } = loadProbeHelpers({
    localStorage: local,
    sessionStorage: session
  });

  assert.equal(isBrowserStorageAvailable(), true);
  assert.deepEqual(Array.from(local.map.entries()), [
    ['gitm_lang', 'ar'],
    ['gitm_users', '[{"id":1}]']
  ]);
  assert.deepEqual(Array.from(session.map.entries()), [['session_flag', '1']]);
});

test('returns false when window is absent or storage is missing/incomplete', () => {
  const absentWindow = loadProbeHelpers(undefined);
  assert.equal(absentWindow.isBrowserStorageAvailable(), false);

  const nullStorage = loadProbeHelpers({ localStorage: null, sessionStorage: createMockStorage() });
  assert.equal(nullStorage.isBrowserStorageAvailable(), false);

  const partialStorage = loadProbeHelpers({
    localStorage: { getItem() {}, setItem() {} },
    sessionStorage: createMockStorage()
  });
  assert.equal(partialStorage.isBrowserStorageAvailable(), false);
});

test('returns false when localStorage getter throws SecurityError', () => {
  const win = { sessionStorage: createMockStorage() };
  Object.defineProperty(win, 'localStorage', {
    get() {
      const err = new Error('Access denied');
      err.name = 'SecurityError';
      throw err;
    }
  });

  const { isBrowserStorageAvailable } = loadProbeHelpers(win);
  assert.equal(isBrowserStorageAvailable(), false);
});

test('returns false when sessionStorage alone is denied', () => {
  const local = createMockStorage({ keep: 'yes' });
  const win = { localStorage: local };
  Object.defineProperty(win, 'sessionStorage', {
    get() {
      throw new Error('SecurityError');
    }
  });

  const { isBrowserStorageAvailable } = loadProbeHelpers(win);
  assert.equal(isBrowserStorageAvailable(), false);
  assert.deepEqual(Array.from(local.map.entries()), [['keep', 'yes']]);
});

test('returns false when setItem throws and preserves unrelated keys', () => {
  const local = createMockStorage(
    { gitm_theme: 'dark' },
    {
      setItem() {
        throw new Error('QuotaExceededError');
      }
    }
  );
  const { isBrowserStorageAvailable } = loadProbeHelpers({
    localStorage: local,
    sessionStorage: createMockStorage()
  });

  assert.equal(isBrowserStorageAvailable(), false);
  assert.deepEqual(Array.from(local.map.entries()), [['gitm_theme', 'dark']]);
});

test('returns false when getItem throws and cleans up transient probe key in finally', () => {
  let removedKeys = [];
  const local = createMockStorage(
    { gitm_theme: 'dark' },
    {
      getItem() {
        throw new Error('SecurityError');
      },
      removeItem(k) {
        removedKeys.push(k);
        local.map.delete(k);
      }
    }
  );
  const { isBrowserStorageAvailable } = loadProbeHelpers({
    localStorage: local,
    sessionStorage: createMockStorage()
  });

  assert.equal(isBrowserStorageAvailable(), false);
  assert.equal(removedKeys.length, 1);
  assert.match(removedKeys[0], /^__gitm_storage_probe_/);
  assert.deepEqual(Array.from(local.map.entries()), [['gitm_theme', 'dark']]);
});

test('returns false when removeItem throws', () => {
  const local = createMockStorage(
    { gitm_theme: 'dark' },
    {
      removeItem() {
        throw new Error('SecurityError');
      }
    }
  );
  const { isBrowserStorageAvailable } = loadProbeHelpers({
    localStorage: local,
    sessionStorage: createMockStorage()
  });

  assert.equal(isBrowserStorageAvailable(), false);
});
