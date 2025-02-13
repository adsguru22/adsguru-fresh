const WASAPBOT_API_KEY = process.env.WASAPBOT_ACCESS_TOKEN;
const WASAPBOT_BASE_URL = 'https://dash.wasapbot.my/api';

export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await fetch(`${WASAPBOT_BASE_URL}/send_message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WASAPBOT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message
      })
    });
    return await response.json();
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    throw error;
  }
};
