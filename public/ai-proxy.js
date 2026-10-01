export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { messages, model, response_format, stream } = body;

    if (!Array.isArray(messages) || !messages.length || messages.length > 40) {
      return Response.json({ error: 'Invalid messages' }, { status: 400 });
    }
    const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing API Key on server" }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const modelsToTry = model && model !== 'openrouter/free' ? [model, 'openrouter/free'] : ['openrouter/free'];



    for (const currentModel of modelsToTry) {
      try {
        const payload = {
          model: currentModel,
          messages: messages
        };
        
        if (response_format) {
          payload.response_format = response_format;
        }
        
        if (stream) {
          payload.stream = true;
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gitm.pages.dev/",
            "X-Title": "GITM Platform"
          },
          signal: AbortSignal.timeout(60000),
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.warn(`Model ${currentModel} failed: ${response.status}`);
          continue;
        }

        // If streaming is requested, we just return the streaming response directly!
        if (stream) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set("Access-Control-Allow-Origin", "*");
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }

        // If not streaming, parse json
        const data = await response.json();
        
        if (data.error) {
          console.warn(`Model ${currentModel} returned API error`);
          continue;
        }

        return new Response(JSON.stringify(data), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        console.warn(`Model ${currentModel} threw exception: ${err.message}`);
        continue;
      }
    }

    return new Response(JSON.stringify({ 
      error: "All fallback models failed due to high load or errors.", 
      details: 'Please try again shortly.' 
    }), { status: 503, headers: { "Access-Control-Allow-Origin": "*" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}
