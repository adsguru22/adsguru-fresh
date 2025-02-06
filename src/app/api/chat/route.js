import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Note: removed NEXT_PUBLIC_
});

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI marketing assistant specialized in Facebook/TikTok marketing, business strategy, and web development. When users request sales pages or marketing content, provide complete, ready-to-use code."
        },
        ...messages
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ 
      message: response.choices[0].message.content 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}