import { useState } from 'react';
import client from '../api/client.js';

export default function PredictPage() {
  const [features, setFeatures] = useState('10,20,30');
  const [prediction, setPrediction] = useState(null);

  const submit = async () => {
    const parsed = features.split(',').map((n) => Number(n.trim()));
    const { data } = await client.post('/predict', { features: parsed });
    setPrediction(data);
  };

  return (
    <div className="card">
      <h2>ML Prediction</h2>
      <input value={features} onChange={(e) => setFeatures(e.target.value)} />
      <button onClick={submit}>Predict</button>
      {prediction && <pre>{JSON.stringify(prediction, null, 2)}</pre>}
    </div>
  );
}
