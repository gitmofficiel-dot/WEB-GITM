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
    const { messages, model, response_format } = body;

    const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing API Key on server" }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const FALLBACK_MODELS = [
      "google/gemma-4-26b-a4b-it:free",
      "qwen/qwen3.8-27b:free",
      "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      "poolside/laguna-xs-2.1:free",
      "liquid/lfm-2.5-2.6b:free"
    ];

    const modelsToTry = model ? [model, ...FALLBACK_MODELS.filter(m => m !== model)] : FALLBACK_MODELS;

    let lastError = null;

    for (const currentModel of modelsToTry) {
      try {
        const payload = {
          model: currentModel,
          messages: messages
        };
        
        if (response_format) {
          payload.response_format = response_format;
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gitm.pages.dev/",
            "X-Title": "GITM Platform"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          lastError = await response.text();
          console.warn(`Model ${currentModel} failed: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.error) {
          lastError = JSON.stringify(data.error);
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
        lastError = err.message;
        console.warn(`Model ${currentModel} threw exception: ${err.message}`);
        continue;
      }
    }

    return new Response(JSON.stringify({ 
      error: "All fallback models failed due to high load or errors.", 
      details: lastError 
    }), { status: 503, headers: { "Access-Control-Allow-Origin": "*" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}
