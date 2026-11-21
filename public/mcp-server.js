const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
};

const SERVER_INFO = {
  name: 'gitm',
  version: '1.0.0',
};

const PROTOCOL_VERSION = '2024-11-05';

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

const TOOLS = [
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
];

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

async function fetchCollection(projectId, collectionName, pageSize = 100) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodeURIComponent(collectionName)}?pageSize=${pageSize}`;
  const res = await fetch(url);
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`Firestore request failed (${res.status}) for ${collectionName}`);
  }
  const data = await res.json();
  return (data.documents || []).map(decodeDocument);
}

async function fetchGitmDataFallback(projectId, docName) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/gitm_data/${encodeURIComponent(docName)}`;
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

async function executeTool(name, args, projectId) {
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
    default:
      return null;
  }
}

export async function handleMcp(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method === 'GET') {
    return jsonResponse({
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
      protocol: 'mcp',
      transport: 'streamable-http',
      readOnly: true,
      tools: TOOLS,
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
      return rpcResult(id, { tools: TOOLS });

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      if (!TOOLS.some((t) => t.name === toolName)) {
        return rpcError(id, -32602, `Unknown tool: ${toolName}`);
      }
      try {
        const items = await executeTool(toolName, toolArgs, projectId);
        return rpcResult(id, {
          content: [{ type: 'text', text: JSON.stringify(items, null, 2) }],
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
