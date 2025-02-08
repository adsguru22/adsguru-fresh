// lib/ai-engine/providers/together.ts

import { aiClient } from '@/lib/utils/api';

// Types for Together.ai API responses and requests
interface TogetherMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TogetherCompletionRequest {
  model: string;
  messages: TogetherMessage[];
  temperature?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

interface TogetherCompletionResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface TogetherError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

export class TogetherProvider {
  private apiKey: string;
  private baseUrl = 'https://api.together.xyz/v1/chat/completions';
  private defaultModel = 'Qwen/Qwen-VL-72B';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Together API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Generate AI completion using Together.ai
   */
  async generateCompletion(
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
      model?: string;
    } = {}
  ) {
    try {
      const messages: TogetherMessage[] = [
        {
          role: 'system',
          content: options.systemPrompt || 'You are a professional marketing copywriter and AI assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const requestBody: TogetherCompletionRequest = {
        model: options.
