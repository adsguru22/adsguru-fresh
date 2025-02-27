import { OpenAI } from 'openai';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { WhatsAppMessage, Customer } from '@/types/whatsapp';
import { wasapbot } from '@/lib/services/wasapbot';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type MessageContent = {
  text?: string | null;
  template?: {
    components: Array<{
      text?: string;
    }>;
  };
  type?: string;
  media_url?: string;
};

type AnalysisResult = {
  intent: string;
  sentiment: string;
  urgency: string;
  topics: string[];
  products: string[];
  requiresHumanAttention: boolean;
};

// Default customer type with required fields
const DEFAULT_CUSTOMER: Customer = {
  id: '',
  phone_number: '',
  first_contact: new Date().toISOString(),
  interaction_count: 0,
  metadata: {}
};

class WhatsAppAIProcessor {
  private supabase;

  constructor() {
    this.supabase = createClientComponentClient();
  }

  private getMessageText(message: WhatsAppMessage): string {
    const content = message.content as MessageContent;
    
    if (typeof content.text === 'string') {
      return content.text;
    }
    
    if (content.template?.components) {
      const textComponent = content.template.components.find(c => typeof c.text === 'string');
      if (textComponent?.text) {
        return textComponent.text;
      }
    }
    
    return '';
  }

  private createPromptContent(parts: (string | null | undefined)[]): string {
    return parts.filter(part => part !== null && part !== undefined)
      .map(part => String(part))
      .join('\n');
  }

  private createAnalysisPrompt(messageText: string, conversationContext: string): ChatMessage[] {
    const promptParts: string[] = [
      conversationContext,
      `Customer message: "${messageText}"`,
      "",
      "Analyze this WhatsApp message and determine:",
      "1. The primary intent category (select one): inquiry, purchase_intent, support, complaint, feedback, greeting, other",
      "2. The sentiment: positive, neutral, negative",
      "3. Urgency level: high, medium, low",
      "4. Key topics mentioned (max 3)",
      "5. Any specific products or services mentioned",
      "",
      "Respond in JSON format:",
      "{",
      '  "category": "intent_category",',
      '  "sentiment": "sentiment",',
      '  "urgency": "urgency_level",',
      '  "topics": ["topic1", "topic2"],',
      '  "products": ["product1", "product2"],',
      '  "requiresHumanAttention": true/false',
      "}"
    ];

    return [
      { 
        role: "system", 
        content: "You are an AI assistant that analyzes customer messages." 
      },
      {
        role: "user",
        content: this.createPromptContent(promptParts)
      }
    ];
  }

  private createResponsePrompt(messageText: string, analysis: AnalysisResult, business: any, customer: Customer): ChatMessage[] {
    const customerName = customer?.name || '';
    
    const promptParts: string[] = [
      `Customer message: "${messageText}"`,
      "",
      `Intent analysis: The customer message shows ${analysis.intent} intent with ${analysis.sentiment} sentiment and ${analysis.urgency} urgency.`,
      "",
      `You are representing ${business.name}, a ${business.description}.`,
      `Our tone is ${business.tone} and our communication style is ${business.style}.`,
      "",
      "Craft a helpful WhatsApp response that:",
      `1. Addresses the customer appropriately ${customerName ? `using their name (${customerName})` : ''}`,
      `2. Responds directly to their ${analysis.intent}`,
      "3. Is concise and to the point (keep under 200 characters)",
      "4. Sounds natural and conversational",
      "5. Includes a clear next step or call to action if appropriate",
      "",
      "Respond in JSON format:",
      "{",
      '  "text": "your response here",',
      '  "createTask": true/false,',
      '  "taskTitle": "optional task title",',
      '  "taskDescription": "optional task description"',
      "}"
    ];

    return [
      {
        role: "system",
        content: "You are an AI assistant helping businesses communicate with customers on WhatsApp."
      },
      {
        role: "user",
        content: this.createPromptContent(promptParts)
      }
    ];
  }

  async analyzeMessage(message: WhatsAppMessage): Promise<any> {
    try {
      // Get conversation history
      const history = await this.getConversationHistory(message.contact_id);
      
      // Create conversation context
      const conversationContext = history.length > 0
        ? 'Previous conversation:\n' + 
          history.map(msg => `${msg.direction === 'inbound' ? 'Customer' : 'Business'}: ${this.getMessageText(msg)}`).join('\n') + '\n\n'
        : '';

      const messageText = this.getMessageText(message);
      const messages = this.createAnalysisPrompt(messageText, conversationContext);

      // Analyze with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        response_format: { type: "json_object" }
      });

      const analysisText = completion.choices[0].message.content || '{}';
      const analysis = JSON.parse(analysisText);

      // Store analysis in database
      const { data, error } = await this.supabase
        .from('whatsapp_message_analysis')
        .insert({
          message_id: message.id,
          intent: analysis.category,
          sentiment: analysis.sentiment,
          urgency: analysis.urgency,
          topics: analysis.topics,
          products: analysis.products,
          requires_attention: analysis.requiresHumanAttention,
          confidence_score: 0.9,
          processed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;

    } catch (error) {
      console.error('Error analyzing message:', error);
      throw error;
    }
  }

  async generateResponse(message: WhatsAppMessage, analysis: AnalysisResult, customer: Customer) {
    try {
      // Get business profile
      const business = await this.getBusinessProfile();
      const messageText = this.getMessageText(message);
      const messages = this.createResponsePrompt(messageText, analysis, business, customer);

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content || '{}';
      return JSON.parse(responseText);

    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async processQueue(batchSize: number = 10) {
    try {
      // Get pending messages from queue
      const { data: queueItems, error: queueError } = await this.supabase
        .from('whatsapp_ai_queue')
        .select('*, whatsapp_messages(*)')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(batchSize);

      if (queueError) throw queueError;

      // Process each message
      for (const item of queueItems || []) {
        try {
          // Update status to processing
          await this.supabase
            .from('whatsapp_ai_queue')
            .update({ status: 'processing' })
            .eq('id', item.id);

          // Analyze message
          const analysis = await this.analyzeMessage(item.whatsapp_messages);
          
          // Get customer info
          const customer = await this.getCustomerInfo(item.whatsapp_messages.contact_id);
          
          // Generate response if auto-reply is enabled
          if (item.auto_reply) {
            const response = await this.generateResponse(
              item.whatsapp_messages, 
              analysis,
              customer
            );
            
            // Send response if text is available
            if (response.text) {
              await wasapbot.sendMessage({
                number: item.whatsapp_messages.from,
                message: response.text
              });
            }
            
            // Create task if needed
            if (response.createTask && response.taskTitle) {
              await this.createTask(
                item.whatsapp_messages.contact_id,
                response.taskTitle,
                response.taskDescription || ''
              );
            }
          }

          // Update status to completed
          await this.supabase
            .from('whatsapp_ai_queue')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', item.id);

        } catch (processError) {
          console.error(`Error processing queue item ${item.id}:`, processError);
          
          // Update status to failed
          await this.supabase
            .from('whatsapp_ai_queue')
            .update({ 
              status: 'failed',
              error: processError instanceof Error ? processError.message : 'Unknown error'
            })
            .eq('id', item.id);
        }
      }

      return {
        processed: queueItems?.length || 0,
        success: true
      };

    } catch (error) {
      console.error('Error processing queue:', error);
      throw error;
    }
  }

  private async getConversationHistory(contactId: string, limit: number = 5): Promise<WhatsAppMessage[]> {
    const { data } = await this.supabase
      .from('whatsapp_messages')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  private async getBusinessProfile() {
    // In a real implementation, this would likely fetch from database
    return {
      name: 'AdsGuru AI360',
      description: 'digital marketing platform',
      tone: 'professional but friendly',
      style: 'helpful and concise'
    };
  }
  
  private async getCustomerInfo(contactId: string): Promise<Customer> {
    try {
      const { data } = await this.supabase
        .from('whatsapp_contacts')
        .select('*')
        .eq('id', contactId)
        .single();
        
      return data || { ...DEFAULT_CUSTOMER }; // Use default customer if data is null
    } catch (error) {
      console.error('Error fetching customer info:', error);
      return { ...DEFAULT_CUSTOMER }; // Use default customer if error occurs
    }
  }
  
  private async createTask(contactId: string, title: string, description: string) {
    try {
      await this.supabase
        .from('tasks')
        .insert({
          contact_id: contactId,
          title,
          description,
          status: 'pending',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }
}

export const whatsappAI = new WhatsAppAIProcessor();
