import { NextResponse } from 'next/server';

export async function POST() {
  // Will implement Together.ai integration here
  return NextResponse.json({ status: 'AI Route Active' });
}