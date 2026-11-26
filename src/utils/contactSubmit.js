export const CONTACT_STORAGE_KEY = 'lastContactSubmit';
export const CONTACT_COOLDOWN_MS = 60000;

export function parseValidTimestamp(raw, nowMs) {
  if (typeof raw !== 'string' && typeof raw !== 'number') {
    return null;
  }

  let ts;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    ts = Number(trimmed);
  } else {
    ts = raw;
  }

  if (!Number.isFinite(ts) || ts <= 0 || ts > nowMs) {
    return null;
  }

  return ts;
}

function resolveStorage(getStorage) {
  if (typeof getStorage !== 'function') return null;
  try {
    return getStorage() || null;
  } catch {
    return null;
  }
}

export function readLastSubmit(getStorage, memoryFallback, nowMs) {
  const memoryTs = parseValidTimestamp(memoryFallback?.lastSubmit, nowMs);

  let storageTs = null;
  const storage = resolveStorage(getStorage);
  if (storage && typeof storage.getItem === 'function') {
    try {
      const raw = storage.getItem(CONTACT_STORAGE_KEY);
      storageTs = parseValidTimestamp(raw, nowMs);
    } catch {
      storageTs = null;
    }
  }

  if (memoryTs === null && storageTs === null) {
    return null;
  }

  return Math.max(memoryTs ?? 0, storageTs ?? 0);
}

export function isRateLimited(nowMs, lastSubmitMs, cooldownMs = CONTACT_COOLDOWN_MS) {
  if (!Number.isFinite(lastSubmitMs) || lastSubmitMs <= 0 || lastSubmitMs > nowMs) {
    return false;
  }
  return nowMs - lastSubmitMs < cooldownMs;
}

export function recordLastSubmit(nowMs, getStorage, memoryFallback) {
  if (memoryFallback && typeof memoryFallback === 'object') {
    memoryFallback.lastSubmit = nowMs;
  }

  const storage = resolveStorage(getStorage);
  if (storage && typeof storage.setItem === 'function') {
    try {
      storage.setItem(CONTACT_STORAGE_KEY, String(nowMs));
    } catch {
      // Best-effort storage write: never surface storage errors as send failures.
    }
  }
}

export async function submitContactForm({
  formData,
  isSubmittingRef,
  sendMessage,
  getStorage,
  memoryFallback,
  now = Date.now,
  cooldownMs = CONTACT_COOLDOWN_MS,
  onRateLimit,
  onSending,
  onSuccess,
  onError
}) {
  if (!formData?.name || !formData?.email || !formData?.message) {
    return { status: 'invalid' };
  }

  if (isSubmittingRef?.current) {
    return { status: 'duplicate' };
  }

  if (isSubmittingRef) {
    isSubmittingRef.current = true;
  }

  try {
    const nowMs = now();
    const lastSubmitMs = readLastSubmit(getStorage, memoryFallback, nowMs);

    if (isRateLimited(nowMs, lastSubmitMs, cooldownMs)) {
      onRateLimit?.();
      return { status: 'rate_limited' };
    }

    const payload = { ...formData };

    onSending?.();

    try {
      await sendMessage(payload);
    } catch (error) {
      onError?.(error);
      return { status: 'error', error };
    }

    const sentAt = now();
    recordLastSubmit(sentAt, getStorage, memoryFallback);

    try {
      onSuccess?.();
    } catch {
      // Post-persistence UI callback error must not trigger onError or invite duplicates.
    }

    return { status: 'success' };
  } finally {
    if (isSubmittingRef) {
      isSubmittingRef.current = false;
    }
  }
}
