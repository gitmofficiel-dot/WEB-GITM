import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../public/_worker.js';
import { onRequest } from '../public/ai-proxy.js';

const request = (body) => new Request('https://gitm.pages.dev/api/ai', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
test('invalid messages are rejected before contacting provider', async () => {
  assert.equal((await onRequest({ request: request({}), env: {} })).status, 400);
});
test('missing server credentials produce an explicit failure', async () => {
  const response = await onRequest({ request: request({ messages: [{role:'user',content:'Hello'}] }), env: {} });
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /Missing API Key/);
});
test('both deployed AI paths route to proxy and preserve streamed Arabic text', async () => {
  const originalFetch = globalThis.fetch;
  const streamed = 'data: {"choices":[{"delta":{"content":"مرحبا"}}]}\n\ndata: [DONE]\n\n';
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(JSON.parse(options.body));
    assert.equal(options.headers.Authorization, 'Bearer test-server-key');
    return new Response(streamed, {headers:{'Content-Type':'text/event-stream'}});
  };
  try {
    for (const path of ['/api/ai', '/api/chat/completions']) {
      const req = new Request(`https://gitm.pages.dev${path}`, request({messages:[{role:'user',content:'مرحبا'}],stream:true}));
      const response = await worker.fetch(req, {OPENROUTER_API_KEY:'test-server-key',ASSETS:{fetch(){throw new Error('AI reached static assets');}}});
      assert.equal(response.status,200);
      assert.equal(await response.text(),streamed);
    }
    assert.equal(calls[0].model,'openrouter/free');
  } finally { globalThis.fetch = originalFetch; }
});
test('unavailable selected model falls back to free router', async () => {
  const originalFetch = globalThis.fetch;
  const models = [];
  globalThis.fetch = async (url, options) => {
    models.push(JSON.parse(options.body).model);
    return models.length === 1 ? new Response('Unavailable',{status:404}) : Response.json({choices:[{message:{content:'Hello'}}]});
  };
  try {
    const response = await onRequest({request:request({model:'old-model:free',messages:[{role:'user',content:'Hello'}]}),env:{OPENROUTER_API_KEY:'test'}});
    assert.equal(response.status,200);
    assert.deepEqual(models,['old-model:free','openrouter/free']);
  } finally { globalThis.fetch = originalFetch; }
});
