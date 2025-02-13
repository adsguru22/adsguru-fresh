import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get user by email
export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
};

// Function to update user tokens
export const updateUserTokens = async (userId, tokens) => {
  const { error } = await supabase
    .from('users')
    .update({ tokens_remaining: tokens })
    .eq('id', userId);
  
  if (error) throw error;
};
