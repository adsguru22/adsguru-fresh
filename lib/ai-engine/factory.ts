// lib/ai-engine/factory.ts

import { MistralProvider } from './providers/mistral';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';

export type AIModelType = 'mistral' | 'openai' | 'claude';
export type TaskType = 'research' | 'copywriting' | 'ideation' | 'optimization';

interface AIResponse {
  content: string;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  model: string;
}

export class AIFactory {
  private static instance: AIFactory;
  private mistralProvider?: MistralProvider;
  private openaiProvider?: OpenAIProvider;
  private claudeProvider?: ClaudeProvider;

  private constructor() {}

  public static getInstance(): AIFactory {
    if (!AIFactory.instance) {
      AIFactory.instance = new AIFactory();
    }
    return AIFactory.instance;
  }

  private getOptimalModel(task: TaskType): AIModelType {
    switch (task) {
      case 'research':
        return 'openai'; // GPT-4 best for research
      case 'copywriting':
        return 'claude'; // Claude best for creative writing
      case 'ideation':
        return 'mistral'; // Mistral good for quick ideation
      case 'optimization':
        return 'openai'; // GPT-4 good for optimization
      default:
        return 'mistral';
    }
  }

  async generateContent(
    prompt: string,
    task: TaskType,
    forceModel?: AIModelType
  ): Promise<AIResponse> {
    const model = forceModel || this.getOptimalModel(task);

    try {
      switch (model) {
        case 'mistral':
          if (!this.mistralProvider) {
            this.mistralProvider = new MistralProvider(process.env.MISTRAL_API_KEY!);
          }
          return await this.mistralProvider.generate(prompt);

        case 'openai':
          if (!this.openaiProvider) {
            this.openaiProvider = new OpenAIProvider(process.env.OPENAI_API_KEY!);
          }
          return await this.openaiProvider.generate(prompt);

        case 'claude':
          if (!this.claudeProvider) {
            this.claudeProvider = new ClaudeProvider(process.env.CLAUDE_API_KEY!);
          }
          return await this.claudeProvider.generate(prompt);

        default:
          throw new Error('Invalid AI model specified');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw error;
    }
  }
}

// Usage example:
// const factory = AIFactory.getInstance();
// const result = await factory.generateContent("Write ad copy for...", "copywriting");