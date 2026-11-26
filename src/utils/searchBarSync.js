export const normalizeSearchQuery = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim() !== '' ? value : '';
};

export const shouldEmitSearch = (currentInput, lastEmitted) => {
  const next = normalizeSearchQuery(currentInput);
  return {
    shouldEmit: next !== lastEmitted,
    next,
  };
};

export const syncExternalSearchValue = (externalValue) => {
  const nextInput = externalValue === null || externalValue === undefined ? '' : String(externalValue);
  return {
    nextInput,
    nextLastEmitted: normalizeSearchQuery(nextInput),
  };
};
