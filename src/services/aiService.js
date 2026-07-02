const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// We should ideally use an env variable. If not set, it will fail gracefully.
// Make sure to add VITE_OPENROUTER_API_KEY to your .env file
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export const systemPrompt = {
  ar: "أنت المساعد الذكي الرسمي لنادي التكنولوجيا والابتكار GITM (Group of Innovation and Technology of Morocco). مهمتك هي مساعدة الأعضاء والطلاب في أسئلتهم حول التكنولوجيا، الأكواد البرمجية، الأكاديمية، والمشاريع. أجب بطريقة احترافية، مشجعة، ومختصرة.",
  en: "You are the official AI Assistant for GITM (Group of Innovation and Technology of Morocco). Your mission is to help members and students with questions about technology, coding, the academy, and projects. Reply in a professional, encouraging, and concise manner."
};

/**
 * Sends a message to OpenRouter API and streams the response.
 * @param {Array} messages - Array of message objects {role, content}
 * @param {Function} onChunk - Callback triggered on each new chunk of text: (accumulatedText) => void
 * @returns {Promise<void>}
 */
export async function streamChatCompletion(messages, onChunk) {
  if (!API_KEY) {
    throw new Error('OpenRouter API Key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file.');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin, // For OpenRouter rankings
        'X-Title': 'GITM Platform' // For OpenRouter rankings
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-coder:free',
        messages: messages,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim() === 'data: [DONE]') {
          return;
        }
        if (line.startsWith('data: ')) {
          try {
            const dataStr = line.slice(6);
            if (!dataStr.trim()) continue;
            
            const data = JSON.parse(dataStr);
            const delta = data.choices?.[0]?.delta?.content || '';
            if (delta) {
              accumulatedText += delta;
              onChunk(accumulatedText);
            }
          } catch (e) {
            console.error('Error parsing stream data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('AI Streaming Error:', error);
    throw error;
  }
}
