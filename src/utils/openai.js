// src/utils/openai.js
import OpenAI from 'openai';

// Pastikan API Key diambil dari env untuk backend
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // JANGAN guna NEXT_PUBLIC_
});

export async function getChatResponse(messages, model = "gpt-4") {
  try {
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format: Must be an array.");
    }

    const response = await openai.chat.completions.create({
      model: model, // Boleh tukar model jika perlu
      messages: [
        {
          role: "system",
          content: process.env.DEFAULT_INSTRUCTION || 
            "You are AdsGuru AI, an expert AI marketing assistant specialized in Facebook/TikTok marketing, business strategy, and web development. When users request sales pages or marketing content, provide complete, ready-to-use code.",
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("OpenAI API Error:", error);

    let errorMessage = "Sorry, I encountered an error. Please try again.";
    if (error.response?.data?.error?.message) {
      errorMessage = `OpenAI Error: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }

    return errorMessage;
  }
}
