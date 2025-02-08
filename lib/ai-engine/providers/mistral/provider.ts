// lib/ai-engine/mistral/provider.ts

interface MistralMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  
  interface MistralConfig {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
  
  export class MistralProvider {
    private apiKey: string;
    private baseUrl = 'https://api.mistral.ai/v1/chat/completions';
    private defaultModel = 'mistral-large-2.1';
  
    constructor(apiKey: string) {
      if (!apiKey) {
        throw new Error('Mistral API key is required');
      }
      this.apiKey = apiKey;
    }
  
    async generateCopy(
      prompt: string,
      config: MistralConfig = {}
    ) {
      try {
        const messages: MistralMessage[] = [
          {
            role: 'system',
            content: 'You are an expert marketing copywriter. Create compelling, clear, and engaging copy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ];
  
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: config.model || this.defaultModel,
            messages,
            temperature: config.temperature || 0.7,
            max_tokens: config.maxTokens || 500
          })
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Mistral API Error: ${error.message}`);
        }
  
        const data = await response.json();
        return {
          content: data.choices[0].message.content,
          usage: data.usage,
          model: config.model || this.defaultModel
        };
      } catch (error) {
        console.error('Mistral Generation Error:', error);
        throw error;
      }
    }
  
    // Helper method untuk check cost
    estimateCost(tokenCount: number): number {
      // Mistral Large pricing: $2.50 per 1M tokens
      const ratePerMillion = 2.50;
      return (tokenCount / 1_000_000) * ratePerMillion;
    }
  }
  
  // Create singleton instance
  let mistralProvider: MistralProvider | null = null;
  
  export const getMistralProvider = (): MistralProvider => {
    if (!mistralProvider) {
      const apiKey = process.env.MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error('MISTRAL_API_KEY environment variable is not set');
      }
      mistralProvider = new MistralProvider(apiKey);
    }
    return mistralProvider;
  };