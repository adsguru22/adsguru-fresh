'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SalesPageGenerator() {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [benefits, setBenefits] = useState('');
  const [cta, setCta] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('/api/copywriting', {
        type: 'landing',
        details: { product, audience, benefits, cta }
      });
      setGeneratedCode(response.data.copy);
    } catch (error) {
      console.error('Error generating sales page:', error);
      setGeneratedCode('Failed to generate code.');
    }
  };

  return (
    <div className="sales-page-generator">
      <h2>Sales Page Generator</h2>
      <input
        type="text"
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <input
        type="text"
        placeholder="Target Audience"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />
      <input
        type="text"
        placeholder="Key Benefits"
        value={benefits}
        onChange={(e) => setBenefits(e.target.value)}
      />
      <input
        type="text"
        placeholder="Call to Action"
        value={cta}
        onChange={(e) => setCta(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate Sales Page</button>
      {generatedCode && (
        <div>
          <h3>Generated Code:</h3>
          <pre>{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}
