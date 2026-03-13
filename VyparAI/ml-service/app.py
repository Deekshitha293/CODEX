from flask import Flask, request, jsonify
import joblib
import numpy as np
from pathlib import Path

app = Flask(__name__)
MODEL_PATH = Path(__file__).parent / 'model' / 'demand_model.joblib'


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError('Model file missing. Run python training/train_model.py first.')
    return joblib.load(MODEL_PATH)


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.post('/predict')
def predict():
    payload = request.get_json(force=True)
    features = payload.get('features', [])
    X = np.array(features, dtype=float).reshape(1, -1)
    model = load_model()
    pred = model.predict(X)[0]
    return jsonify({'prediction': float(pred), 'features': features})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
