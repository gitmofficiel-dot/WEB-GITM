export const DEFAULT_PROJECTS_CATEGORY = 'all';
export const DEFAULT_PROJECTS_PAGE = 1;

export const normalizeSearchValue = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim() !== '' ? value : '';
};

export const parsePositivePage = (raw) => {
  if (raw === null || raw === undefined) return DEFAULT_PROJECTS_PAGE;
  const trimmed = String(raw).trim();
  if (!/^[1-9]\d*$/.test(trimmed)) return DEFAULT_PROJECTS_PAGE;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : DEFAULT_PROJECTS_PAGE;
};

export const parseProjectsHubParams = (searchParams) => {
  const params = searchParams instanceof URLSearchParams
    ? searchParams
    : new URLSearchParams(searchParams || '');

  const q = normalizeSearchValue(params.get('q') ?? '');

  const rawCat = (params.get('category') || '').trim();
  const category = rawCat && rawCat.toLowerCase() !== DEFAULT_PROJECTS_CATEGORY
    ? rawCat
    : DEFAULT_PROJECTS_CATEGORY;

  const page = parsePositivePage(params.get('page'));

  return { q, category, page };
};

export const buildProjectsHubParams = (currentSearchParams, patch = {}) => {
  const next = new URLSearchParams(
    currentSearchParams instanceof URLSearchParams
      ? currentSearchParams.toString()
      : (currentSearchParams || '')
  );

  if (Object.prototype.hasOwnProperty.call(patch, 'q')) {
    const normalizedQ = normalizeSearchValue(patch.q ?? '');
    if (normalizedQ) next.set('q', normalizedQ);
    else next.delete('q');
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'category')) {
    const rawCat = typeof patch.category === 'string' ? patch.category.trim() : '';
    if (rawCat && rawCat.toLowerCase() !== DEFAULT_PROJECTS_CATEGORY) {
      next.set('category', rawCat);
    } else {
      next.delete('category');
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'page')) {
    const normalizedPage = parsePositivePage(patch.page);
    if (normalizedPage > DEFAULT_PROJECTS_PAGE) {
      next.set('page', String(normalizedPage));
    } else {
      next.delete('page');
    }
  }

  return next;
};

export const resolveProjectsHubCategory = (requestedCategory, availableCategories, loading) => {
  if (loading || requestedCategory === DEFAULT_PROJECTS_CATEGORY) {
    return requestedCategory;
  }
  if (Array.isArray(availableCategories) && availableCategories.includes(requestedCategory)) {
    return requestedCategory;
  }
  return DEFAULT_PROJECTS_CATEGORY;
};

export const resolveProjectsHubPage = (requestedPage, totalPages, loading) => {
  const safePage = parsePositivePage(requestedPage);
  if (loading) return safePage;
  if (totalPages <= 0) return DEFAULT_PROJECTS_PAGE;
  return Math.min(safePage, totalPages);
};
