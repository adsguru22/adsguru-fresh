import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/utils/wasapbot';

export async function POST(request) {
  try {
    const { phoneNumber, message } = await request.json();
    const response = await sendWhatsAppMessage(phoneNumber, message);
    return NextResponse.json(response);
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
