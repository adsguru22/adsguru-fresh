import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request) {
  try {
    const { userId, amount, commission, productId, affiliateId } = await request.json();
    
    const { data, error } = await supabase
      .from('sales')
      .insert([{ user_id: userId, amount, commission, product_id: productId, affiliate_id: affiliateId }]);

    if (error) {
      return NextResponse.json({ error: 'Error tracking sale' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Sale tracked successfully', data });
  } catch (error) {
    console.error('Affiliate API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
