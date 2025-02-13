'use client';

import { useState } from 'react';
import { sendWhatsAppMessage } from '@/utils/wasapbot';

export default function WhatsAppBot() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const res = await sendWhatsAppMessage(phoneNumber, message);
      setResponse(res);
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Failed to send message.');
    }
  };

  return (
    <div className="whatsapp-bot">
      <h2>WhatsApp Bot</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send Message</button>
      {response && <p>Response: {response}</p>}
    </div>
  );
}
