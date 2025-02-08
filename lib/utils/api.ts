import axios from 'axios';

export const aiClient = axios.create({
  baseURL: '/api/ai',
  timeout: 30000,
  headers: {
    'X-API-KEY': process.env.TOGETHER_AI_API_KEY
  }
});

// Error handling wrapper
export const safeFetch = async <T>(promise: Promise<T>) => {
  try {
    return await promise;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Request failed');
  }
};