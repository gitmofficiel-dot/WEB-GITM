const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
};

const SERVER_INFO = {
  name: 'gitm',
  version: '2.0.0',
};

const PROTOCOL_VERSION = '2024-11-05';
const MAX_STRING_LENGTH = 200000;
const MAX_ARRAY_LENGTH = 200;
const MAX_NESTING_DEPTH = 12;
const TIMESTAMP_FIELDS = new Set(['createdAt', 'updatedAt', 'at']);

const LIMIT_SCHEMA = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      description: 'Maximum number of items to return (default 50, max 100).',
    },
  },
  additionalProperties: false,
};

const ID_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, description: 'Firestore document ID.' },
  },
  required: ['id'],
  additionalProperties: false,
};

const CREATE_SCHEMA = {
  type: 'object',
  properties: {
    data: { type: 'object', description: 'Document fields to create.' },
  },
  required: ['data'],
  additionalProperties: false,
};

const UPDATE_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, description: 'Firestore document ID.' },
    data: { type: 'object', description: 'Fields to patch.' },
  },
  required: ['id', 'data'],
  additionalProperties: false,
};

const DELETE_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, description: 'Firestore document ID.' },
    confirm: { type: 'boolean', description: 'Must be true to confirm deletion.' },
  },
  required: ['id', 'confirm'],
  additionalProperties: false,
};

const SET_STATUS_SCHEMA = {
  type: 'object',
  properties: {
    collection: {
      type: 'string',
      enum: ['news', 'events', 'projects', 'courses'],
      description: 'Target collection.',
    },
    id: { type: 'string', minLength: 1, description: 'Firestore document ID.' },
    status: { type: 'string', minLength: 1, description: 'New status value.' },
  },
  required: ['collection', 'id', 'status'],
  additionalProperties: false,
};

const PUBLIC_TOOLS = [
  {
    name: 'list_news',
    description: 'Read-only list of GITM news articles from Firestore.',
    inputSchema: LIMIT_SCHEMA,
  },
  {
    name: 'list_events',
    description: 'Read-only list of GITM events from Firestore.',
    inputSchema: LIMIT_SCHEMA,
  },
  {
    name: 'list_projects',
    description: 'Read-only list of GITM projects from Firestore.',
    inputSchema: LIMIT_SCHEMA,
  },
  {
    name: 'list_courses',
    description: 'Read-only list of GITM courses from Firestore.',
    inputSchema: LIMIT_SCHEMA,
  },
  {
    name: 'list_team',
    description: 'Read-only list of public GITM team members from Firestore.',
    inputSchema: LIMIT_SCHEMA,
  },
  {
    name: 'get_news',
    description: 'Get a single GITM news article by document ID.',
    inputSchema: ID_SCHEMA,
  },
  {
    name: 'get_event',
    description: 'Get a single GITM event by document ID.',
    inputSchema: ID_SCHEMA,
  },
  {
    name: 'get_project',
    description: 'Get a single GITM project by document ID.',
    inputSchema: ID_SCHEMA,
  },
  {
    name: 'get_course',
    description: 'Get a single GITM course by document ID.',
    inputSchema: ID_SCHEMA,
  },
  {
    name: 'ping_test',
    description: 'Health check returning server time and admin configuration status.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

const ADMIN_TOOLS = [
  { name: 'create_news', description: 'Create a news article.', inputSchema: CREATE_SCHEMA },
  { name: 'update_news', description: 'Update fields of a news article.', inputSchema: UPDATE_SCHEMA },
  { name: 'delete_news', description: 'Delete a news article (requires confirm:true).', inputSchema: DELETE_SCHEMA },
  { name: 'create_event', description: 'Create an event.', inputSchema: CREATE_SCHEMA },
  { name: 'update_event', description: 'Update fields of an event.', inputSchema: UPDATE_SCHEMA },
  { name: 'delete_event', description: 'Delete an event (requires confirm:true).', inputSchema: DELETE_SCHEMA },
  { name: 'create_project', description: 'Create a project.', inputSchema: CREATE_SCHEMA },
  { name: 'update_project', description: 'Update fields of a project.', inputSchema: UPDATE_SCHEMA },
  { name: 'delete_project', description: 'Delete a project (requires confirm:true).', inputSchema: DELETE_SCHEMA },
  { name: 'create_course', description: 'Create a course.', inputSchema: CREATE_SCHEMA },
  { name: 'update_course', description: 'Update fields of a course.', inputSchema: UPDATE_SCHEMA },
  { name: 'delete_course', description: 'Delete a course (requires confirm:true).', inputSchema: DELETE_SCHEMA },
  { name: 'set_status', description: 'Update the status of a news, event, project, or course document.', inputSchema: SET_STATUS_SCHEMA },
];

const PUBLIC_TOOL_NAMES = new Set(PUBLIC_TOOLS.map((t) => t.name));
const ADMIN_TOOL_NAMES = new Set(ADMIN_TOOLS.map((t) => t.name));

const PUBLIC_TEAM_FIELDS = [
  'id',
  'name',
  'displayName',
  'fullName',
  'role',
  'title',
  'position',
  'bio',
  'description',
  'photoURL',
  'avatar',
  'image',
  'department',
  'skills',
  'linkedin',
  'github',
  'website',
  'order',
  'isTeamMember',
];

const COLLECTION_WHITELISTS = {
  news: new Set([
    'titleAr', 'titleEn', 'title', 'content', 'contentAr', 'contentEn',
    'tags', 'category', 'attachments', 'imageUrl', 'mainImage',
    'fbVideo', 'ytVideo', 'updates', 'additions', 'author',
    'status', 'date', 'views', 'createdAt', 'updatedAt',
  ]),
  events: new Set([
    'title', 'titleEn', 'description', 'eventType', 'mode', 'location',
    'virtualLink', 'startDate', 'startTime', 'endDate', 'endTime',
    'maxCapacity', 'isRegistrationOpen', 'agenda', 'speakers',
    'fbVideo', 'ytVideo', 'attachments', 'imageUrl', 'author',
    'status', 'createdAt', 'updatedAt',
  ]),
  projects: new Set([
    'titleAr', 'titleEn', 'titleFr', 'descriptionAr', 'descriptionEn', 'descriptionFr', 'imageUrl', 'status',
    'category', 'githubUrl', 'progress', 'coverImage', 'fbVideo',
    'ytVideo', 'teamMembers', 'attachments', 'techStack', 'author',
    'createdAt', 'updatedAt',
  ]),
  courses: new Set([
    'title', 'track', 'level', 'description', 'modules', 'coverImage',
    'imageUrl', 'fbVideo', 'ytVideo', 'attachments', 'courseIntroVideo',
    'courseIntroText', 'author', 'status', 'createdAt', 'updatedAt',
  ]),
};

const VALID_STATUSES = {
  news: new Set(['draft', 'Published']),
  events: new Set(['draft', 'Published']),
  courses: new Set(['draft', 'Published']),
  projects: new Set(['draft', 'in-progress', 'completed']),
};

const ARRAY_FIELDS = {
  news: new Set(['tags', 'attachments', 'updates', 'additions']),
  events: new Set(['agenda', 'speakers', 'attachments']),
  projects: new Set(['teamMembers', 'attachments', 'techStack']),
  courses: new Set(['modules', 'attachments']),
};

const NUMBER_FIELDS = {
  news: new Set(['views']),
  events: new Set(['maxCapacity']),
  projects: new Set(['progress']),
  courses: new Set([]),
};

const BOOLEAN_FIELDS = {
  news: new Set([]),
  events: new Set(['isRegistrationOpen']),
  projects: new Set([]),
  courses: new Set([]),
};

// Module-level OAuth token cache for edge isolate reuse
let tokenCache = { token: null, expiresAt: 0, clientEmail: null };

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function rpcResult(id, result) {
  return jsonResponse({ jsonrpc: '2.0', id: id ?? null, result });
}

function rpcError(id, code, message, data) {
  const error = data !== undefined ? { code, message, data } : { code, message };
  return jsonResponse({ jsonrpc: '2.0', id: id ?? null, error });
}

// Constant-time bearer comparison using SHA-256 digests
async function isAdminAuthorized(request, env) {
  const expected = env?.MCP_ADMIN_KEY;
  if (!expected || typeof expected !== 'string') return false;
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  const provided = authHeader.slice(7);
  if (!provided) return false;

  const enc = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(provided)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  const a = new Uint8Array(hashA);
  const b = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

// Base64URL helpers for JWT signing
function base64UrlEncodeBytes(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncodeJson(obj) {
  return base64UrlEncodeBytes(new TextEncoder().encode(JSON.stringify(obj)));
}

function pemToPkcs8Bytes(pem) {
  const normalized = String(pem)
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Obtain and cache Google OAuth2 access token via WebCrypto RS256 JWT
async function getAccessToken(env) {
  const raw = env?.FIREBASE_SERVICE_ACCOUNT;
  if (!raw || typeof raw !== 'string') {
    throw new Error('write credential not configured');
  }

  let sa;
  try {
    sa = JSON.parse(raw);
  } catch {
    throw new Error('write credential not configured');
  }

  if (!sa?.client_email || !sa?.private_key) {
    throw new Error('write credential not configured');
  }

  const nowMs = Date.now();
  if (
    tokenCache.token &&
    tokenCache.clientEmail === sa.client_email &&
    nowMs < tokenCache.expiresAt - 300000
  ) {
    return tokenCache.token;
  }

  const nowSec = Math.floor(nowMs / 1000);
  const headerB64 = base64UrlEncodeJson({ alg: 'RS256', typ: 'JWT' });
  const claimB64 = base64UrlEncodeJson({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600,
  });
  const signingInput = `${headerB64}.${claimB64}`;

  let signatureB64;
  try {
    const keyBytes = pemToPkcs8Bytes(sa.private_key);
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBytes,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(signingInput)
    );
    signatureB64 = base64UrlEncodeBytes(new Uint8Array(sigBuf));
  } catch {
    throw new Error('failed to sign write credential');
  }

  const jwt = `${signingInput}.${signatureB64}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${encodeURIComponent(jwt)}`,
  });

  if (!res.ok) {
    throw new Error(`failed to obtain write token (${res.status})`);
  }

  const tokenData = await res.json();
  if (!tokenData?.access_token) {
    throw new Error('failed to obtain write token');
  }

  const expiresInSec = Number(tokenData.expires_in) || 3600;
  tokenCache = {
    token: tokenData.access_token,
    expiresAt: nowMs + expiresInSec * 1000,
    clientEmail: sa.client_email,
  };
  return tokenCache.token;
}

// Firestore REST decoders
function decodeFirestoreValue(val) {
  if (!val || typeof val !== 'object') return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    const values = val.arrayValue?.values || [];
    return values.map(decodeFirestoreValue);
  }
  if ('mapValue' in val) {
    return decodeFields(val.mapValue?.fields || {});
  }
  return null;
}

function decodeFields(fields) {
  const obj = {};
  for (const [key, value] of Object.entries(fields || {})) {
    obj[key] = decodeFirestoreValue(value);
  }
  return obj;
}

function decodeDocument(doc) {
  const id = doc.name ? doc.name.split('/').pop() : undefined;
  const decoded = decodeFields(doc.fields || {});
  return id ? { id, ...decoded } : decoded;
}

// Firestore REST encoder with size and depth caps
function encodeFirestoreValue(val, fieldName = '', depth = 0) {
  if (depth > MAX_NESTING_DEPTH) {
    throw new Error('Value nesting depth exceeds limit');
  }
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      throw new Error(`Invalid number value${fieldName ? ` for ${fieldName}` : ''}`);
    }
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') {
    if (val.length > MAX_STRING_LENGTH) {
      throw new Error(`String exceeds maximum length (${MAX_STRING_LENGTH})${fieldName ? ` for ${fieldName}` : ''}`);
    }
    if (depth === 0 && TIMESTAMP_FIELDS.has(fieldName)) {
      return { timestampValue: val };
    }
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    if (val.length > MAX_ARRAY_LENGTH) {
      throw new Error(`Array exceeds maximum length (${MAX_ARRAY_LENGTH})${fieldName ? ` for ${fieldName}` : ''}`);
    }
    return {
      arrayValue: {
        values: val.map((item) => encodeFirestoreValue(item, '', depth + 1)),
      },
    };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = encodeFirestoreValue(v, k, depth + 1);
      }
    }
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported value type${fieldName ? ` for ${fieldName}` : ''}`);
}

function encodeFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = encodeFirestoreValue(v, k, 0);
    }
  }
  return fields;
}

// Firestore REST read helpers
function firestoreBase(projectId) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;
}

function validateDocId(id) {
  if (typeof id !== 'string') throw new Error('Invalid or missing id');
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 256 || trimmed.includes('/') || trimmed === '.' || trimmed === '..') {
    throw new Error('Invalid document id');
  }
  return trimmed;
}

async function fetchCollection(projectId, collectionName, pageSize = 100) {
  const url = `${firestoreBase(projectId)}/${encodeURIComponent(collectionName)}?pageSize=${pageSize}`;
  const res = await fetch(url);
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`Firestore request failed (${res.status}) for ${collectionName}`);
  }
  const data = await res.json();
  return (data.documents || []).map(decodeDocument);
}

async function fetchGitmDataFallback(projectId, docName) {
  const url = `${firestoreBase(projectId)}/gitm_data/${encodeURIComponent(docName)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const values = data?.fields?.items?.arrayValue?.values || [];
  return values.map((val, index) => {
    const item = decodeFirestoreValue(val);
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return item.id ? item : { id: `${docName}-${index}`, ...item };
    }
    return item;
  });
}

async function fetchWithFallback(projectId, collectionName, limit) {
  let items = await fetchCollection(projectId, collectionName);
  if (items.length === 0 && ['news', 'events', 'courses'].includes(collectionName)) {
    items = await fetchGitmDataFallback(projectId, collectionName);
  }
  return items.slice(0, limit);
}

async function fetchDocumentById(projectId, collectionName, rawId) {
  const id = validateDocId(rawId);
  const url = `${firestoreBase(projectId)}/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (res.ok) {
    const doc = await res.json();
    return decodeDocument(doc);
  }
  if (res.status === 404 && ['news', 'events', 'courses'].includes(collectionName)) {
    const fallbackItems = await fetchGitmDataFallback(projectId, collectionName);
    const match = fallbackItems.find((item) => item && String(item.id) === id);
    if (match) return match;
  }
  if (res.status === 404) {
    throw new Error(`Document not found: ${collectionName}/${id}`);
  }
  throw new Error(`Firestore request failed (${res.status}) for ${collectionName}/${id}`);
}

function sanitizeTeamMember(member) {
  const clean = {};
  for (const field of PUBLIC_TEAM_FIELDS) {
    if (member[field] !== undefined) {
      clean[field] = member[field];
    }
  }
  return clean;
}

async function fetchTeam(projectId, limit) {
  const users = await fetchCollection(projectId, 'users');
  return users
    .filter((user) => user.isTeamMember === true)
    .map(sanitizeTeamMember)
    .slice(0, limit);
}

function parseLimit(args) {
  const raw = args?.limit;
  if (raw === undefined || raw === null) return 50;
  const num = Number(raw);
  if (!Number.isFinite(num) || num < 1) return 50;
  return Math.min(Math.floor(num), 100);
}

// Validation and normalization for admin writes
function isPlainObject(val) {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

function validateStatus(collectionName, status) {
  const allowed = VALID_STATUSES[collectionName];
  if (!allowed || !allowed.has(status)) {
    throw new Error(`Invalid status '${status}' for ${collectionName}. Allowed: ${Array.from(allowed || []).join(', ')}`);
  }
}

function validateFieldTypes(collectionName, data) {
  for (const [key, val] of Object.entries(data)) {
    if (val === undefined || val === null) continue;
    if (ARRAY_FIELDS[collectionName].has(key)) {
      if (!Array.isArray(val)) throw new Error(`Field '${key}' must be an array`);
      if (val.length > MAX_ARRAY_LENGTH) throw new Error(`Field '${key}' exceeds max ${MAX_ARRAY_LENGTH} items`);
      if (collectionName === 'projects' && key === 'techStack') {
        if (!val.every((item) => typeof item === 'string')) {
          throw new Error("Field 'techStack' must be an array of strings");
        }
      }
    } else if (NUMBER_FIELDS[collectionName].has(key)) {
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new Error(`Field '${key}' must be a valid number`);
      }
    } else if (BOOLEAN_FIELDS[collectionName].has(key)) {
      if (typeof val !== 'boolean') {
        throw new Error(`Field '${key}' must be a boolean`);
      }
    }
  }
}

function filterWhitelistedFields(collectionName, rawData, isUpdate) {
  if (!isPlainObject(rawData)) {
    throw new Error('data must be a JSON object');
  }
  const whitelist = COLLECTION_WHITELISTS[collectionName];
  const rejected = [];
  const clean = {};

  for (const [key, val] of Object.entries(rawData)) {
    if (key === 'id' || (isUpdate && (key === 'createdAt' || key === 'updatedAt'))) {
      rejected.push(key);
      continue;
    }
    if (!whitelist.has(key)) {
      rejected.push(key);
      continue;
    }
    clean[key] = val;
  }

  if (rejected.length > 0) {
    throw new Error(`Rejected unknown or disallowed fields: ${rejected.join(', ')}`);
  }
  return clean;
}

function prepareCreatePayload(collectionName, rawData) {
  const clean = filterWhitelistedFields(collectionName, rawData, false);
  const nowIso = new Date().toISOString();
  const today = nowIso.split('T')[0];

  if (clean.status !== undefined) {
    validateStatus(collectionName, clean.status);
  }
  validateFieldTypes(collectionName, clean);

  const status = clean.status || 'draft';
  const author = clean.author || 'MCP Admin';

  if (collectionName === 'news') {
    const baseTitle = clean.title || clean.titleAr || clean.titleEn;
    const baseContent = clean.content || clean.contentAr || clean.contentEn;
    if (!baseTitle || typeof baseTitle !== 'string' || !baseTitle.trim()) {
      throw new Error('news requires title (or titleAr/titleEn)');
    }
    if (!baseContent || typeof baseContent !== 'string' || !baseContent.trim()) {
      throw new Error('news requires content (or contentAr/contentEn)');
    }
    const payload = {
      tags: [],
      attachments: [],
      updates: [],
      additions: [],
      views: 0,
      ...clean,
      title: clean.title || baseTitle,
      titleAr: clean.titleAr || baseTitle,
      titleEn: clean.titleEn || baseTitle,
      content: clean.content || baseContent,
      contentAr: clean.contentAr || baseContent,
      contentEn: clean.contentEn || baseContent,
      author,
      status,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    if (status === 'Published' && !payload.date) {
      payload.date = today;
    }
    return payload;
  }

  if (collectionName === 'events') {
    if (!clean.title || typeof clean.title !== 'string' || !clean.title.trim()) {
      throw new Error('events requires title');
    }
    if (!clean.startDate || typeof clean.startDate !== 'string' || !clean.startDate.trim()) {
      throw new Error('events requires startDate');
    }
    return {
      agenda: [],
      speakers: [],
      attachments: [],
      isRegistrationOpen: true,
      ...clean,
      author,
      status,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }

  if (collectionName === 'projects') {
    const hasTitle = (typeof clean.titleAr === 'string' && clean.titleAr.trim()) ||
      (typeof clean.titleEn === 'string' && clean.titleEn.trim());
    if (!hasTitle) {
      throw new Error('projects requires titleAr or titleEn');
    }
    return {
      progress: 0,
      teamMembers: [],
      attachments: [],
      techStack: [],
      ...clean,
      author,
      status,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }

  if (collectionName === 'courses') {
    if (!clean.title || typeof clean.title !== 'string' || !clean.title.trim()) {
      throw new Error('courses requires title');
    }
    return {
      modules: [],
      attachments: [],
      ...clean,
      author,
      status,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }

  throw new Error(`Unsupported collection: ${collectionName}`);
}

function prepareUpdatePayload(collectionName, rawData) {
  const clean = filterWhitelistedFields(collectionName, rawData, true);
  if (Object.keys(clean).length === 0) {
    throw new Error('No updatable fields provided');
  }
  if (clean.status !== undefined) {
    validateStatus(collectionName, clean.status);
  }
  validateFieldTypes(collectionName, clean);
  clean.updatedAt = new Date().toISOString();
  return clean;
}

// Firestore REST write helpers
async function firestoreCreate(projectId, collectionName, payload, token) {
  const url = `${firestoreBase(projectId)}/${encodeURIComponent(collectionName)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fields: encodeFields(payload) }),
  });
  if (!res.ok) {
    throw new Error(`Firestore create failed (${res.status}) for ${collectionName}`);
  }
  const doc = await res.json();
  return decodeDocument(doc);
}

async function firestorePatch(projectId, collectionName, id, payload, token) {
  const params = new URLSearchParams();
  for (const field of Object.keys(payload)) {
    params.append('updateMask.fieldPaths', field);
  }
  params.set('currentDocument.exists', 'true');
  const url = `${firestoreBase(projectId)}/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}?${params.toString()}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fields: encodeFields(payload) }),
  });
  if (res.status === 404) {
    throw new Error(`Document not found: ${collectionName}/${id}`);
  }
  if (!res.ok) {
    throw new Error(`Firestore update failed (${res.status}) for ${collectionName}/${id}`);
  }
  const doc = await res.json();
  return decodeDocument(doc);
}

async function firestoreDelete(projectId, collectionName, id, token) {
  const url = `${firestoreBase(projectId)}/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}?currentDocument.exists=true`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 404) {
    throw new Error(`Document not found: ${collectionName}/${id}`);
  }
  if (!res.ok) {
    throw new Error(`Firestore delete failed (${res.status}) for ${collectionName}/${id}`);
  }
  return { deleted: true, collection: collectionName, id };
}

// Best-effort audit logger (never logs secrets or document bodies)
async function writeAuditLog(projectId, env, entry) {
  try {
    const token = await getAccessToken(env);
    const payload = {
      tool: String(entry.tool || ''),
      collection: String(entry.collection || ''),
      docId: entry.docId ? String(entry.docId) : '',
      ok: Boolean(entry.ok),
      at: new Date().toISOString(),
    };
    if (entry.error) {
      payload.error = String(entry.error).slice(0, 500);
    }
    await fetch(`${firestoreBase(projectId)}/mcp_audit_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fields: encodeFields(payload) }),
    });
  } catch {
    // Best-effort only
  }
}

// Execute public tools
async function executePublicTool(name, args, projectId, env) {
  const limit = parseLimit(args);
  switch (name) {
    case 'list_news':
      return fetchWithFallback(projectId, 'news', limit);
    case 'list_events':
      return fetchWithFallback(projectId, 'events', limit);
    case 'list_projects':
      return fetchWithFallback(projectId, 'projects', limit);
    case 'list_courses':
      return fetchWithFallback(projectId, 'courses', limit);
    case 'list_team':
      return fetchTeam(projectId, limit);
    case 'get_news':
      return fetchDocumentById(projectId, 'news', args?.id);
    case 'get_event':
      return fetchDocumentById(projectId, 'events', args?.id);
    case 'get_project':
      return fetchDocumentById(projectId, 'projects', args?.id);
    case 'get_course':
      return fetchDocumentById(projectId, 'courses', args?.id);
    case 'ping_test':
      return {
        ok: true,
        time: new Date().toISOString(),
        adminConfigured: Boolean(env?.MCP_ADMIN_KEY),
      };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Execute admin write tools with audit logging
async function executeAdminTool(name, args, projectId, env) {
  let targetCollection = '';
  let docId = typeof args?.id === 'string' ? args.id.trim() : '';

  const toolCollectionMap = {
    create_news: 'news', update_news: 'news', delete_news: 'news',
    create_event: 'events', update_event: 'events', delete_event: 'events',
    create_project: 'projects', update_project: 'projects', delete_project: 'projects',
    create_course: 'courses', update_course: 'courses', delete_course: 'courses',
  };
  targetCollection = toolCollectionMap[name] || (typeof args?.collection === 'string' ? args.collection : '');

  try {
    const token = await getAccessToken(env);
    let result;

    if (name.startsWith('create_')) {
      const payload = prepareCreatePayload(targetCollection, args?.data);
      result = await firestoreCreate(projectId, targetCollection, payload, token);
      docId = result?.id || '';
    } else if (name.startsWith('update_')) {
      docId = validateDocId(args?.id);
      const payload = prepareUpdatePayload(targetCollection, args?.data);
      result = await firestorePatch(projectId, targetCollection, docId, payload, token);
    } else if (name.startsWith('delete_')) {
      if (args?.confirm !== true) {
        throw new Error('Deletion requires confirm: true');
      }
      docId = validateDocId(args?.id);
      result = await firestoreDelete(projectId, targetCollection, docId, token);
    } else if (name === 'set_status') {
      if (!COLLECTION_WHITELISTS[targetCollection]) {
        throw new Error('collection must be one of: news, events, projects, courses');
      }
      docId = validateDocId(args?.id);
      validateStatus(targetCollection, args?.status);
      const payload = { status: args.status, updatedAt: new Date().toISOString() };
      result = await firestorePatch(projectId, targetCollection, docId, payload, token);
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    await writeAuditLog(projectId, env, {
      tool: name,
      collection: targetCollection,
      docId,
      ok: true,
    });
    return result;
  } catch (err) {
    await writeAuditLog(projectId, env, {
      tool: name,
      collection: targetCollection,
      docId,
      ok: false,
      error: err?.message || 'Admin operation failed',
    });
    throw err;
  }
}

export async function handleMcp(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const isAdmin = await isAdminAuthorized(request, env);

  if (request.method === 'GET') {
    return jsonResponse({
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      protocol: 'mcp',
      transport: 'streamable-http',
      readOnly: false,
      tools: isAdmin ? [...PUBLIC_TOOLS, ...ADMIN_TOOLS] : PUBLIC_TOOLS,
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return rpcError(null, -32700, 'Parse error: Invalid JSON');
  }

  if (!body || typeof body !== 'object' || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return rpcError(body?.id ?? null, -32600, 'Invalid Request');
  }

  const { id, method, params = {} } = body;
  const projectId = env?.VITE_FIREBASE_PROJECT_ID || 'gitm-1b637';

  switch (method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case 'notifications/initialized':
      return new Response(null, { status: 202, headers: CORS_HEADERS });

    case 'ping':
      return rpcResult(id, {});

    case 'tools/list':
      return rpcResult(id, {
        tools: isAdmin ? [...PUBLIC_TOOLS, ...ADMIN_TOOLS] : PUBLIC_TOOLS,
      });

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      if (ADMIN_TOOL_NAMES.has(toolName)) {
        if (!isAdmin) {
          return rpcError(id, -32001, 'unauthorized');
        }
        try {
          const result = await executeAdminTool(toolName, toolArgs, projectId, env);
          return rpcResult(id, {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            isError: false,
          });
        } catch (err) {
          return rpcResult(id, {
            content: [{ type: 'text', text: err?.message || 'Internal error' }],
            isError: true,
          });
        }
      }

      if (!PUBLIC_TOOL_NAMES.has(toolName)) {
        return rpcError(id, -32602, `Unknown tool: ${toolName}`);
      }

      try {
        const result = await executePublicTool(toolName, toolArgs, projectId, env);
        return rpcResult(id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: false,
        });
      } catch (err) {
        return rpcResult(id, {
          content: [{ type: 'text', text: err?.message || 'Internal error' }],
          isError: true,
        });
      }
    }

    default:
      if (id === undefined || id === null) {
        return new Response(null, { status: 202, headers: CORS_HEADERS });
      }
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}
