import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { type, details } = await request.json();
    const prompt = generateCopywritingPrompt(type, details);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert copywriter specializing in marketing content.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ copy: response.choices[0].message.content });
  } catch (error) {
    console.error('Copywriting API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateCopywritingPrompt(type, details) {
  switch (type) {
    case 'landing':
      return `Create a high-converting landing page copy for ${details.product}. 
              Target audience: ${details.audience}
              Key benefits: ${details.benefits}
              Call to action: ${details.cta}`;
    case 'ad':
      return `Write a compelling ad copy for ${details.platform}.
              Product: ${details.product}
              Target audience: ${details.audience}
              Key message: ${details.message}`;
    default:
      return details.prompt;
  }
}
