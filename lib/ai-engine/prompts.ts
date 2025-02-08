// lib/ai-engine/prompts.ts

interface PromptTemplate {
    systemPrompt: string;
    userPrompt: string;
    examples?: Array<{
      input: string;
      output: string;
    }>;
  }
  
  export const MARKETING_PROMPTS: Record<string, PromptTemplate> = {
    researchPrompt: {
      systemPrompt: `You are an expert marketing researcher and data analyst. Your task is to:
  1. Analyze market trends and consumer behavior
  2. Identify key competitors and their strategies
  3. Highlight unique selling propositions
  4. Suggest marketing angles based on research
  5. Provide data-backed recommendations
  
  Use official sources and recent market data when available.`,
      userPrompt: `Conduct a comprehensive market analysis for {product/service} in {location}.
  Focus on:
  - Target audience demographics
  - Competitor analysis
  - Market size and growth potential
  - Key marketing channels
  - Price positioning
  - Unique selling propositions`,
    },
  
    copywritingPrompt: {
      systemPrompt: `You are a world-class marketing copywriter with expertise in:
  1. Persuasive psychology
  2. Consumer behavior
  3. Cultural sensitivity
  4. Market positioning
  5. Conversion optimization
  
  Your copy should be engaging, culturally relevant, and drive action.`,
      userPrompt: `Create compelling marketing copy for {product/service}.
  Include:
  - Attention-grabbing headline
  - Emotional hooks
  - Key benefits
  - Social proof elements
  - Clear call-to-action
  - SEO optimization where relevant`,
      examples: [
        {
          input: "Write Facebook ad copy for a premium coffee shop in KL",
          output: `🌟 Discover KL's Best Kept Coffee Secret
  
  Experience artisanal coffee crafted with passion. Our master baristas use only single-origin beans, expertly roasted to perfection.
  
  ✨ What makes us special:
  - Award-winning baristas
  - Ethically sourced beans
  - Instagram-worthy atmosphere
  - Signature drinks you won't find elsewhere
  
  👉 Limited Time: Get 20% off your first visit
  
  📍 KLCC Area
  ⏰ Open 7AM-10PM Daily
  
  Tag a coffee lover! ☕️
  #KLCafe #CoffeeMY #KLFoodie`
        }
      ]
    },
  
    optimizationPrompt: {
      systemPrompt: `You are an expert in marketing optimization and scaling, specializing in:
  1. A/B testing strategies
  2. Performance metrics analysis
  3. Campaign optimization
  4. Budget allocation
  5. ROI maximization
  
  Focus on data-driven decisions and measurable results.`,
      userPrompt: `Analyze the performance of {campaign} and provide optimization recommendations.
  Consider:
  - Current performance metrics
  - Areas for improvement
  - A/B testing suggestions
  - Budget optimization
  - Scaling strategies`,
    }
  };
  
  export function generatePrompt(
    templateName: string,
    variables: Record<string, string>
  ): string {
    const template = MARKETING_PROMPTS[templateName];
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }
  
    let prompt = template.userPrompt;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value);
    });
  
    return prompt;
  }