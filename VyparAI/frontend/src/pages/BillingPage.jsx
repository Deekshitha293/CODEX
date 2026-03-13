import { useState } from 'react';
import client from '../api/client.js';

export default function BillingPage() {
  const [payload, setPayload] = useState('{"customerName":"Demo","items":[{"productId":"","quantity":1}]}');
  const [result, setResult] = useState('');

  const submit = async () => {
    const { data } = await client.post('/billing', JSON.parse(payload));
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div className="card">
      <h2>Billing</h2>
      <p>Paste bill JSON payload and submit.</p>
      <textarea rows="8" value={payload} onChange={(e) => setPayload(e.target.value)} />
      <button onClick={submit}>Create bill</button>
      <pre>{result}</pre>
    </div>
  );
}
