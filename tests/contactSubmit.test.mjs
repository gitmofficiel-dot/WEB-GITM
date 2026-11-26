import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTACT_COOLDOWN_MS,
  CONTACT_STORAGE_KEY,
  isRateLimited,
  parseValidTimestamp,
  readLastSubmit,
  submitContactForm
} from '../src/utils/contactSubmit.js';

const validForm = () => ({
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'Testing contact reliability.'
});

test('missing required fields exits early without sending or touching storage', async () => {
  let sendCalls = 0;
  let getStorageCalls = 0;
  const isSubmittingRef = { current: false };

  for (const field of ['name', 'email', 'message']) {
    const formData = validForm();
    formData[field] = '';
    const result = await submitContactForm({
      formData,
      isSubmittingRef,
      getStorage: () => {
        getStorageCalls += 1;
        return null;
      },
      memoryFallback: { lastSubmit: null },
      sendMessage: async () => {
        sendCalls += 1;
      }
    });
    assert.equal(result.status, 'invalid');
  }

  assert.equal(sendCalls, 0);
  assert.equal(getStorageCalls, 0);
  assert.equal(isSubmittingRef.current, false);
});

test('property getter throw on localStorage still allows send and enforces memory cooldown', async () => {
  let nowMs = 100000;
  let sendCalls = 0;
  let successCalls = 0;
  let rateLimitCalls = 0;
  let errorCalls = 0;
  const isSubmittingRef = { current: false };
  const memoryFallback = { lastSubmit: null };

  const throwingGetter = () => {
    throw new Error('SecurityError: blocked storage getter');
  };

  const first = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: throwingGetter,
    memoryFallback,
    now: () => nowMs,
    sendMessage: async () => {
      sendCalls += 1;
    },
    onSuccess: () => {
      successCalls += 1;
    },
    onError: () => {
      errorCalls += 1;
    }
  });

  assert.equal(first.status, 'success');
  assert.equal(sendCalls, 1);
  assert.equal(successCalls, 1);
  assert.equal(errorCalls, 0);
  assert.equal(memoryFallback.lastSubmit, 100000);

  nowMs += 30000;
  const second = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: throwingGetter,
    memoryFallback,
    now: () => nowMs,
    sendMessage: async () => {
      sendCalls += 1;
    },
    onRateLimit: () => {
      rateLimitCalls += 1;
    }
  });

  assert.equal(second.status, 'rate_limited');
  assert.equal(sendCalls, 1);
  assert.equal(rateLimitCalls, 1);
});

test('storage.getItem throw does not block submission and falls back to memory', async () => {
  let sendCalls = 0;
  const isSubmittingRef = { current: false };
  const memoryFallback = { lastSubmit: null };
  const storage = {
    getItem() {
      throw new Error('SecurityError: getItem blocked');
    },
    setItem() {}
  };

  const result = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => 200000,
    sendMessage: async () => {
      sendCalls += 1;
    }
  });

  assert.equal(result.status, 'success');
  assert.equal(sendCalls, 1);
  assert.equal(memoryFallback.lastSubmit, 200000);
});

test('successful send with storage.setItem throw reports success, not error, and updates memory fallback', async () => {
  let nowMs = 300000;
  let sendCalls = 0;
  let successCalls = 0;
  let errorCalls = 0;
  let rateLimitCalls = 0;
  const isSubmittingRef = { current: false };
  const memoryFallback = { lastSubmit: null };

  const storage = {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error('QuotaExceededError');
    }
  };

  const result = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => nowMs,
    sendMessage: async () => {
      sendCalls += 1;
    },
    onSuccess: () => {
      successCalls += 1;
    },
    onError: () => {
      errorCalls += 1;
    }
  });

  assert.equal(result.status, 'success');
  assert.equal(sendCalls, 1);
  assert.equal(successCalls, 1);
  assert.equal(errorCalls, 0);
  assert.equal(memoryFallback.lastSubmit, 300000);

  nowMs += 10000;
  const blocked = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => nowMs,
    sendMessage: async () => {
      sendCalls += 1;
    },
    onRateLimit: () => {
      rateLimitCalls += 1;
    }
  });

  assert.equal(blocked.status, 'rate_limited');
  assert.equal(rateLimitCalls, 1);
  assert.equal(sendCalls, 1);
});

test('malformed, negative, zero, and future timestamps are ignored and do not block', async () => {
  const nowMs = 500000;

  for (const bad of ['123junk', 'abc', '', '   ', 'NaN', '-1000', '0', String(nowMs + 1), null, undefined]) {
    assert.equal(parseValidTimestamp(bad, nowMs), null);

    let sendCalls = 0;
    const storage = {
      getItem: () => bad,
      setItem: () => {}
    };
    const result = await submitContactForm({
      formData: validForm(),
      isSubmittingRef: { current: false },
      getStorage: () => storage,
      memoryFallback: { lastSubmit: null },
      now: () => nowMs,
      sendMessage: async () => {
        sendCalls += 1;
      }
    });

    assert.equal(result.status, 'success');
    assert.equal(sendCalls, 1);
  }
});

test('readLastSubmit combines storage and memory using Math.max so older storage cannot override newer memory', () => {
  const nowMs = 100000;
  const storageOlder = { getItem: () => '10000' };
  const memoryNewer = { lastSubmit: 80000 };
  assert.equal(readLastSubmit(() => storageOlder, memoryNewer, nowMs), 80000);
  assert.equal(isRateLimited(nowMs, 80000), true);

  const storageNewer = { getItem: () => '90000' };
  const memoryOlder = { lastSubmit: 10000 };
  assert.equal(readLastSubmit(() => storageNewer, memoryOlder, nowMs), 90000);
});

test('exact 60s cooldown boundary: blocked at 59999ms, allowed at 60000ms', async () => {
  let nowMs = 1000000;
  let sendCalls = 0;
  const isSubmittingRef = { current: false };
  const store = new Map([[CONTACT_STORAGE_KEY, String(nowMs)]]);
  const storage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v)
  };
  const memoryFallback = { lastSubmit: nowMs };

  nowMs += CONTACT_COOLDOWN_MS - 1; // 59999ms elapsed
  const blocked = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => nowMs,
    sendMessage: async () => {
      sendCalls += 1;
    }
  });
  assert.equal(blocked.status, 'rate_limited');
  assert.equal(sendCalls, 0);

  nowMs += 1; // 60000ms elapsed
  const allowed = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => nowMs,
    sendMessage: async () => {
      sendCalls += 1;
    }
  });
  assert.equal(allowed.status, 'success');
  assert.equal(sendCalls, 1);
});

test('pending duplicate submission is blocked synchronously by reentrancy ref and payload is snapshotted before await', async () => {
  let resolveSend;
  let receivedPayload = null;
  let sendCalls = 0;
  const isSubmittingRef = { current: false };
  const formData = validForm();

  const firstPromise = submitContactForm({
    formData,
    isSubmittingRef,
    getStorage: () => null,
    memoryFallback: { lastSubmit: null },
    now: () => 700000,
    sendMessage: (payload) => {
      sendCalls += 1;
      receivedPayload = payload;
      return new Promise((resolve) => {
        resolveSend = resolve;
      });
    }
  });

  assert.equal(isSubmittingRef.current, true);

  // Mutate formData while sendMessage is in flight
  formData.message = 'Edited mid-flight';

  const duplicateResult = await submitContactForm({
    formData,
    isSubmittingRef,
    getStorage: () => null,
    memoryFallback: { lastSubmit: null },
    now: () => 700001,
    sendMessage: async () => {
      sendCalls += 1;
    }
  });

  assert.equal(duplicateResult.status, 'duplicate');
  assert.equal(sendCalls, 1);

  resolveSend();
  const firstResult = await firstPromise;
  assert.equal(firstResult.status, 'success');
  assert.equal(isSubmittingRef.current, false);
  assert.equal(receivedPayload.message, 'Testing contact reliability.');
});

test('failed send calls onError, records no cooldown, releases ref, and allows retry', async () => {
  let shouldFail = true;
  let sendCalls = 0;
  let errorCalls = 0;
  let successCalls = 0;
  const isSubmittingRef = { current: false };
  const memoryFallback = { lastSubmit: null };
  const store = new Map();
  const storage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v)
  };

  const failed = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => 800000,
    sendMessage: async () => {
      sendCalls += 1;
      if (shouldFail) throw new Error('Network error');
    },
    onError: () => {
      errorCalls += 1;
    },
    onSuccess: () => {
      successCalls += 1;
    }
  });

  assert.equal(failed.status, 'error');
  assert.equal(errorCalls, 1);
  assert.equal(successCalls, 0);
  assert.equal(memoryFallback.lastSubmit, null);
  assert.equal(store.has(CONTACT_STORAGE_KEY), false);
  assert.equal(isSubmittingRef.current, false);

  shouldFail = false;
  const retry = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => storage,
    memoryFallback,
    now: () => 800100,
    sendMessage: async () => {
      sendCalls += 1;
    },
    onError: () => {
      errorCalls += 1;
    },
    onSuccess: () => {
      successCalls += 1;
    }
  });

  assert.equal(retry.status, 'success');
  assert.equal(sendCalls, 2);
  assert.equal(errorCalls, 1);
  assert.equal(successCalls, 1);
  assert.equal(memoryFallback.lastSubmit, 800100);
  assert.equal(store.get(CONTACT_STORAGE_KEY), '800100');
});

test('onSuccess callback throw after successful send does not trigger onError or skip cooldown', async () => {
  let errorCalls = 0;
  const isSubmittingRef = { current: false };
  const memoryFallback = { lastSubmit: null };

  const result = await submitContactForm({
    formData: validForm(),
    isSubmittingRef,
    getStorage: () => null,
    memoryFallback,
    now: () => 900000,
    sendMessage: async () => {},
    onSuccess: () => {
      throw new Error('UI state error');
    },
    onError: () => {
      errorCalls += 1;
    }
  });

  assert.equal(result.status, 'success');
  assert.equal(errorCalls, 0);
  assert.equal(memoryFallback.lastSubmit, 900000);
  assert.equal(isSubmittingRef.current, false);
});
