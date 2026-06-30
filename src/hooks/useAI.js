import { useState, useCallback } from 'react';
import { openRouterClient } from '../config/openrouter';

/**
 * Hook for interacting with AI services (OpenRouter)
 */
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callOpenRouter = async (systemPrompt, userPrompt, jsonFormat = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await openRouterClient.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        ...(jsonFormat && { response_format: { type: 'json_object' } })
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error('AI Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateText = useCallback(async (prompt, context = '') => {
    const systemPrompt = `You are an expert AI assistant for GITM (Groupe Innovation Technologique Maroc). 
    Context about GITM: A leading Moroccan Ecosystem for Tech Innovation.
    Additional context: ${context}
    Please respond professionally and accurately.`;
    
    return await callOpenRouter(systemPrompt, prompt);
  }, []);

  const translateText = useCallback(async (text) => {
    const systemPrompt = 'You are an expert translator. The user will give you text. Translate it into 4 languages: Arabic, English, French, and Chinese. Return a JSON object with strictly these keys: "ar", "en", "fr", "zh". DO NOT return markdown blocks, only the raw JSON.';
    
    const result = await callOpenRouter(systemPrompt, text, true);
    return JSON.parse(result);
  }, []);

  const summarize = useCallback(async (text) => {
    const systemPrompt = 'Summarize the following text concisely in the same language it was written. Highlight the main points.';
    return await callOpenRouter(systemPrompt, text);
  }, []);

  const generateSEO = useCallback(async (title, content) => {
    const systemPrompt = 'You are an SEO expert. Given the title and content of an article, return a JSON object with "metaDescription" (max 160 chars) and "tags" (array of 5-8 relevant keywords). DO NOT return markdown blocks, only raw JSON.';
    const result = await callOpenRouter(systemPrompt, `Title: ${title}\nContent: ${content}`, true);
    return JSON.parse(result);
  }, []);

  const moderateContent = useCallback(async (content) => {
    const systemPrompt = 'You are a content moderator. Analyze the provided text for inappropriate content, hate speech, spam, or PII. Return a JSON object with "isApproved" (boolean), "reason" (string, if rejected), and "flaggedWords" (array of strings). DO NOT return markdown blocks, only raw JSON.';
    const result = await callOpenRouter(systemPrompt, content, true);
    return JSON.parse(result);
  }, []);

  const generateQuiz = useCallback(async (topic, difficulty = 'intermediate', numQuestions = 5) => {
    const systemPrompt = `You are an expert course creator. Generate a multiple-choice quiz about "${topic}" at a "${difficulty}" level with ${numQuestions} questions. Return a JSON object with a "questions" array. Each question object should have: "question" (string), "options" (array of 4 strings), "correctAnswerIndex" (integer 0-3), and "explanation" (string). DO NOT return markdown blocks, only raw JSON.`;
    const result = await callOpenRouter(systemPrompt, `Generate quiz`, true);
    return JSON.parse(result);
  }, []);

  return {
    loading,
    error,
    generateText,
    translateText,
    summarize,
    generateSEO,
    moderateContent,
    generateQuiz
  };
};
