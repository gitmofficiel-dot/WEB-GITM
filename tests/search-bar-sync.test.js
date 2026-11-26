import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSearchQuery,
  shouldEmitSearch,
  syncExternalSearchValue,
} from '../src/utils/searchBarSync.js';

test('restored URL value suppresses mount-time emission (no 500ms erase)', () => {
  const initial = syncExternalSearchValue('robot');
  assert.deepEqual(initial, { nextInput: 'robot', nextLastEmitted: 'robot' });

  const mountCheck = shouldEmitSearch(initial.nextInput, initial.nextLastEmitted);
  assert.deepEqual(mountCheck, { shouldEmit: false, next: 'robot' });
});

test('uncontrolled empty mount suppresses spurious initial onSearch("")', () => {
  const check = shouldEmitSearch('', '');
  assert.deepEqual(check, { shouldEmit: false, next: '' });

  const whitespaceOnly = shouldEmitSearch('   ', '');
  assert.deepEqual(whitespaceOnly, { shouldEmit: false, next: '' });
});

test('user typing emits changed query and clearing emits empty once', () => {
  const typed = shouldEmitSearch('solar', '');
  assert.deepEqual(typed, { shouldEmit: true, next: 'solar' });

  const cleared = shouldEmitSearch('', 'solar');
  assert.deepEqual(cleared, { shouldEmit: true, next: '' });

  const afterClear = shouldEmitSearch('', '');
  assert.deepEqual(afterClear, { shouldEmit: false, next: '' });
});

test('external value update on browser back/forward syncs input without echo emit', () => {
  const syncedBack = syncExternalSearchValue('medina');
  assert.deepEqual(syncedBack, { nextInput: 'medina', nextLastEmitted: 'medina' });

  const echoCheck = shouldEmitSearch(syncedBack.nextInput, syncedBack.nextLastEmitted);
  assert.deepEqual(echoCheck, { shouldEmit: false, next: 'medina' });

  const syncedEmpty = syncExternalSearchValue(undefined);
  assert.deepEqual(syncedEmpty, { nextInput: '', nextLastEmitted: '' });
  assert.equal(normalizeSearchQuery(null), '');
});
