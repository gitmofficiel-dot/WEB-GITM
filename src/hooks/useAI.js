import { useState, useCallback } from 'react';
import { openRouterClient } from '../config/openrouter';

/**
 * Hook for interacting with AI services (OpenRouter)
 */
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const MODEL_ROUTER = {
    'translation': 'google/gemma-2-9b-it:free', 
    'generation': 'meta-llama/llama-3.2-3b-instruct:free', 
    'complex_json': 'meta-llama/llama-3.3-70b-instruct:free', 
    'moderation': 'meta-llama/llama-3.3-70b-instruct:free', 
    'default': 'meta-llama/llama-3.3-70b-instruct:free'
  };

  const callOpenRouter = async (systemPrompt, userPrompt, jsonFormat = false, taskType = 'default', specificModel = null) => {
    setLoading(true);
    setError(null);
    try {
      const selectedModel = specificModel || MODEL_ROUTER[taskType] || MODEL_ROUTER.default;
      const response = await openRouterClient.chat.completions.create({
        model: selectedModel,
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
    
    return await callOpenRouter(systemPrompt, prompt, false, 'generation');
  }, []);

  const translateText = useCallback(async (text) => {
    const systemPrompt = 'You are an expert translator. The user will give you text. Translate it into 4 languages: Arabic, English, French, and Chinese. Return a JSON object with strictly these keys: "ar", "en", "fr", "zh". DO NOT return markdown blocks, only the raw JSON.';
    
    const result = await callOpenRouter(systemPrompt, text, true, 'translation');
    return JSON.parse(result);
  }, []);

  const summarize = useCallback(async (text) => {
    const systemPrompt = 'Summarize the following text concisely in the same language it was written. Highlight the main points.';
    return await callOpenRouter(systemPrompt, text, false, 'generation');
  }, []);

  const generateSEO = useCallback(async (title, content) => {
    const systemPrompt = 'You are an SEO expert. Given the title and content of an article, return a JSON object with "metaDescription" (max 160 chars) and "tags" (array of 5-8 relevant keywords). DO NOT return markdown blocks, only raw JSON.';
    const result = await callOpenRouter(systemPrompt, `Title: ${title}\nContent: ${content}`, true, 'complex_json');
    return JSON.parse(result);
  }, []);

  const moderateContent = useCallback(async (content) => {
    const systemPrompt = 'You are a content moderator. Analyze the provided text for inappropriate content, hate speech, spam, or PII. Return a JSON object with "isApproved" (boolean), "reason" (string, if rejected), and "flaggedWords" (array of strings). DO NOT return markdown blocks, only raw JSON.';
    const result = await callOpenRouter(systemPrompt, content, true, 'moderation');
    return JSON.parse(result);
  }, []);

  const generateQuiz = useCallback(async (topic, difficulty = 'intermediate', numQuestions = 5) => {
    const systemPrompt = `You are an expert course creator. Generate a multiple-choice quiz about "${topic}" at a "${difficulty}" level with ${numQuestions} questions. Return a JSON object with a "questions" array. Each question object should have: "question" (string), "options" (array of 4 strings), "correctAnswerIndex" (integer 0-3), and "explanation" (string). DO NOT return markdown blocks, only raw JSON.`;
    const result = await callOpenRouter(systemPrompt, `Generate quiz`, true, 'complex_json');
    return JSON.parse(result);
  }, []);

  const evaluateCode = useCallback(async (code, language, problemDescription) => {
    const systemPrompt = `You are an expert programming instructor and an automated grading system (like HackerRank). You will be given a problem description and the student's code in ${language}.
Evaluate the code for correctness, efficiency, and edge cases. 
Return a JSON object with: 
- "score": an integer from 0 to 100
- "feedback": a short string giving constructive feedback
- "passed": boolean (true if score >= 70)
- "improvements": an array of short strings with suggestions.
DO NOT return markdown blocks, only raw JSON.`;
    const result = await callOpenRouter(systemPrompt, `Problem: ${problemDescription}\n\nCode:\n${code}`, true, 'complex_json');
    return JSON.parse(result);
  }, []);

  const simulateCodeExecution = useCallback(async (code, language) => {
    const systemPrompt = `You are a code execution engine (like Judge0). The user provides code in ${language}. 
Execute the code mentally and return the exact standard output (stdout) and standard error (stderr).
Return a JSON object with strictly these keys:
- "output": a string containing the exact stdout and stderr (or compilation error).
- "status": string "success" if it runs successfully, or "error" if it crashes or fails to compile.
DO NOT return markdown blocks, only raw JSON.`;
    const result = await callOpenRouter(systemPrompt, code, true, 'complex_json');
    return JSON.parse(result);
  }, []);

  const chatWithGitmai = useCallback(async (messages, selectedModelSlug, globalContext = '') => {
    setLoading(true);
    setError(null);
    try {
      const systemPrompt = `You are "GITM AI" (الذكاء الاصطناعي لـ GITM), a highly advanced AI developed entirely by the "GITM Team" (فريق GITM). 
You MUST NOT mention OpenAI, Meta, Google, Qwen, Liquid, OpenRouter, or your original model name under any circumstances. 
If asked who made you, you answer "I was developed by the GITM Team (فريق GITM)."
You are helpful, professional, and knowledgeable about Technology, AI, IoT, and Robotics.
Context about current GITM Data from Database:
${globalContext}
Use this context to answer questions accurately about our team, projects, courses, and news.`;

      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const FALLBACK_MODELS = [
        'meta-llama/llama-3.3-70b-instruct:free',
        'google/gemma-2-9b-it:free',
        'meta-llama/llama-3.2-3b-instruct:free',
        'microsoft/phi-3-mini-128k-instruct:free'
      ];
      
      const modelsToTry = [selectedModelSlug, ...FALLBACK_MODELS.filter(m => m !== selectedModelSlug)];
      let lastError = null;

      for (let i = 0; i < modelsToTry.length; i++) {
        try {
          const response = await openRouterClient.chat.completions.create({
            model: modelsToTry[i],
            messages: formattedMessages,
          });
          return response.choices[0].message.content;
        } catch (err) {
          console.warn(`Model ${modelsToTry[i]} failed. Trying next...`, err);
          lastError = err;
        }
      }
      throw lastError || new Error('All models failed');
    } catch (err) {
      console.error('GITM AI Chat Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateText,
    translateText,
    summarize,
    generateSEO,
    moderateContent,
    generateQuiz,
    evaluateCode,
    simulateCodeExecution,
    chatWithGitmai
  };
};
