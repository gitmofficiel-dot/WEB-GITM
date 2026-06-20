import OpenAI from 'openai';

// NOTE: In a real production environment, you should never expose your API keys in the frontend code.
// For this prototype, we are using the key provided by the user directly.
export const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'sk-or-v1-missing',
  dangerouslyAllowBrowser: true // Required since we are calling it from the client side (React)
});

export const generateArticle = async (promptText) => {
  try {
    const response = await openRouterClient.chat.completions.create({
      model: 'openai/gpt-4o', // or 'openai/gpt-oss-120b:free'
      messages: [
        {
          role: 'system',
          content: 'You are an expert technology journalist and PR manager for GITM (Groupe Innovation Technologique Maroc). The user will give you a brief prompt about an event or news. Write a professional, detailed, and engaging news article in Arabic. Return only the article text without any markdown or conversational filler. The first sentence should be a catchy title.'
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating article with OpenRouter:', error);
    throw error;
  }
};
