const origin = process.argv[2] || 'https://gitm.pages.dev';
const response = await fetch(`${origin}/api/chat/completions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({model:'openrouter/free',messages:[{role:'user',content:'قل مرحباً فقط.'}],stream:true}),
  signal: AbortSignal.timeout(90000),
});
const body = await response.text();
console.log(JSON.stringify({status:response.status,type:response.headers.get('content-type'),sample:body.slice(0,700)}));
if (!response.ok || !body.includes('data:')) process.exitCode = 1;
