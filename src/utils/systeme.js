const SYSTEME_API_KEY = process.env.SYSTEME_API_KEY;
const SYSTEME_BASE_URL = 'https://systeme.io/api/v1';

export const trackSale = async (saleData) => {
  try {
    const response = await fetch(`${SYSTEME_BASE_URL}/sales`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SYSTEME_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saleData)
    });
    return await response.json();
  } catch (error) {
    console.error('Systeme.io API Error:', error);
    throw error;
  }
};
