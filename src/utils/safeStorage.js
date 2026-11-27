export function createSafeStorage(
  storageProvider = () => (typeof window !== 'undefined' ? window.localStorage : null)
) {
  const memoryStore = new Map();
  const memoryOverrides = new Set();
  const deletedKeys = new Set();

  function resolveStorage() {
    try {
      const storage = typeof storageProvider === 'function' ? storageProvider() : storageProvider;
      if (
        !storage ||
        typeof storage.getItem !== 'function' ||
        typeof storage.setItem !== 'function' ||
        typeof storage.removeItem !== 'function'
      ) {
        return null;
      }
      return storage;
    } catch {
      return null;
    }
  }

  function getItem(key) {
    const normalizedKey = String(key);
    if (deletedKeys.has(normalizedKey)) {
      return null;
    }
    if (memoryOverrides.has(normalizedKey)) {
      return memoryStore.has(normalizedKey) ? memoryStore.get(normalizedKey) : null;
    }

    const storage = resolveStorage();
    if (storage) {
      try {
        const value = storage.getItem(normalizedKey);
        return value === undefined ? null : value;
      } catch {
        // Fall back to in-memory store
      }
    }

    return memoryStore.has(normalizedKey) ? memoryStore.get(normalizedKey) : null;
  }

  function setItem(key, value) {
    const normalizedKey = String(key);
    const stringValue = String(value);
    memoryStore.set(normalizedKey, stringValue);
    deletedKeys.delete(normalizedKey);

    const storage = resolveStorage();
    if (storage) {
      try {
        storage.setItem(normalizedKey, stringValue);
        memoryOverrides.delete(normalizedKey);
        return true;
      } catch {
        memoryOverrides.add(normalizedKey);
        return false;
      }
    }

    memoryOverrides.add(normalizedKey);
    return false;
  }

  function removeItem(key) {
    const normalizedKey = String(key);
    memoryStore.delete(normalizedKey);

    const storage = resolveStorage();
    if (storage) {
      try {
        storage.removeItem(normalizedKey);
        memoryOverrides.delete(normalizedKey);
        deletedKeys.delete(normalizedKey);
        return true;
      } catch {
        memoryOverrides.delete(normalizedKey);
        deletedKeys.add(normalizedKey);
        return false;
      }
    }

    memoryOverrides.delete(normalizedKey);
    deletedKeys.add(normalizedKey);
    return false;
  }

  function readString(key, allowedValues, fallback) {
    const raw = getItem(key);
    if (raw === null) {
      return { value: fallback, valid: true };
    }

    const isAllowed = Array.isArray(allowedValues)
      ? allowedValues.includes(raw)
      : Boolean(allowedValues && typeof allowedValues === 'object' && Object.prototype.hasOwnProperty.call(allowedValues, raw));

    if (isAllowed) {
      return { value: raw, valid: true };
    }

    return { value: fallback, valid: false };
  }

  function readJSON(key, validator, createFallback) {
    const raw = getItem(key);
    if (raw === null) {
      return { value: createFallback(), valid: true };
    }

    try {
      const parsed = JSON.parse(raw);
      if (validator(parsed)) {
        return { value: parsed, valid: true };
      }
      return { value: createFallback(), valid: false };
    } catch {
      return { value: createFallback(), valid: false };
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    readString,
    readJSON
  };
}

export const safeStorage = createSafeStorage();
export default safeStorage;
