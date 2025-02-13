import OpenAI from "openai";
import { NextResponse } from "next/server";

// Pastikan API Key dipanggil betul
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Wajib ada dalam .env.local
});

export async function POST(request) {
  try {
    const { messages, model = "gpt-4" } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ Error: Invalid input format");
      return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
    }

    console.log("✅ Request received:", { messages, model });

    const response = await openai.chat.completions.create({
      model: model, // Default GPT-4
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

    console.log("✅ OpenAI Response:", response);

    return NextResponse.json({
      message: response.choices?.[0]?.message?.content || "No response from AI",
    });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error);

    let errorMessage = "Internal server error";
    if (error.response?.data?.error?.message) {
      errorMessage = `OpenAI Error: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} // <-- Missing '}' is fixed here
