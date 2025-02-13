'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AffiliateTracker() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [commission, setCommission] = useState('');
  const [productId, setProductId] = useState('');
  const [affiliateId, setAffiliateId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleTrackSale = async () => {
    try {
      const response = await axios.post('/api/affiliate', {
        userId,
        amount,
        commission,
        productId,
        affiliateId
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error('Error tracking sale:', error);
      setResponseMessage('Failed to track sale.');
    }
  };

  return (
    <div className="affiliate-tracker">
      <h2>Affiliate Tracker</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Commission"
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Affiliate ID"
        value={affiliateId}
        onChange={(e) => setAffiliateId(e.target.value)}
      />
      <button onClick={handleTrackSale}>Track Sale</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
