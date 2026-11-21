# GITM MCP Server

خادم **GITM MCP** يعطي أي عميل ذكاء اصطناعي وصول مباشر لمحتوى منصة GITM عبر [Model Context Protocol](https://modelcontextprotocol.io/).
The GITM MCP server gives AI clients direct access to GITM platform content.

- **Endpoint**: `https://gitm.pages.dev/mcp`
- **Transport**: Streamable HTTP, JSON-RPC 2.0 (`GET` returns server info, `POST` handles requests)
- **Source**: `public/mcp-server.js`

## 1. Public tools (read-only, no key)

| Tool | Input | Description |
| :--- | :--- | :--- |
| `list_news` | `{ "limit"?: 1..100 }` | News articles |
| `get_news` | `{ "id" }` | One article |
| `list_events` | `{ "limit"? }` | Events |
| `get_event` | `{ "id" }` | One event |
| `list_projects` | `{ "limit"? }` | Projects |
| `get_project` | `{ "id" }` | One project |
| `list_courses` | `{ "limit"? }` | Academy courses |
| `get_course` | `{ "id" }` | One course |
| `list_team` | `{ "limit"? }` | Public team fields only |
| `ping_test` | `{}` | Health check |

## 2. Admin tools (need a Bearer key)

These appear in `tools/list` only when the request carries the header:

```
Authorization: Bearer <MCP_ADMIN_KEY>
```

| Tool | Input | Description |
| :--- | :--- | :--- |
| `create_news`, `create_event`, `create_project`, `create_course` | `{ "data": {...} }` | Create an item |
| `update_news`, `update_event`, `update_project`, `update_course` | `{ "id", "data": {...} }` | Update fields |
| `delete_news`, `delete_event`, `delete_project`, `delete_course` | `{ "id", "confirm": true }` | Delete (refused without `confirm: true`) |
| `set_status` | `{ "collection", "id", "status" }` | Change publish status |

Every admin write is recorded in the `mcp_audit_log` Firestore collection. Never paste the key in chats, issues or commits. Rotate it by changing the `MCP_ADMIN_KEY` secret in Cloudflare Pages and redeploying.

## 3. Examples

```bash
# Server info
curl -s https://gitm.pages.dev/mcp

# Health check
curl -s -X POST https://gitm.pages.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"ping_test","arguments":{}}}'

# Last 5 projects
curl -s -X POST https://gitm.pages.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_projects","arguments":{"limit":5}}}'
```

## 4. Client config

Public (read-only):

```json
{ "mcpServers": { "gitm": { "url": "https://gitm.pages.dev/mcp" } } }
```

Admin (keep the key private):

```json
{
  "mcpServers": {
    "gitm-admin": {
      "url": "https://gitm.pages.dev/mcp",
      "headers": { "Authorization": "Bearer <YOUR_MCP_ADMIN_KEY>" }
    }
  }
}
```

Note: some HTTP clients send a default library user-agent that Cloudflare blocks (403). Use a normal user-agent.
