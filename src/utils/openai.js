// src/utils/openai.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function getChatResponse(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // atau model custom GPT kita
      messages: [
        {
          role: "system",
          content: "You are an expert AI marketing assistant specialized in Facebook/TikTok marketing, business strategy, and web development. When users request sales pages or marketing content, provide complete, ready-to-use code."
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Sorry, I encountered an error. Please try again.";
  }
}