const tf = require('@tensorflow/tfjs-node');

const linearRegressionForecast = async (last30daysSales) => {
  const values = (last30daysSales || []).slice(-30);
  if (values.length < 2) {
    const fallback = values[values.length - 1] || 0;
    return Array.from({ length: 7 }, () => fallback);
  }

  const xs = tf.tensor2d(values.map((_, idx) => [idx]));
  const ys = tf.tensor2d(values.map((v) => [v]));
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
  model.compile({ optimizer: tf.train.sgd(0.01), loss: 'meanSquaredError' });
  await model.fit(xs, ys, { epochs: 120, verbose: 0 });

  const futureXs = tf.tensor2d(Array.from({ length: 7 }, (_, i) => [values.length + i]));
  const output = model.predict(futureXs);
  const predicted = Array.from(await output.data()).map((v) => Math.max(0, Number(v.toFixed(2))));

  tf.dispose([xs, ys, futureXs, output, model]);
  return predicted;
};

module.exports = { linearRegressionForecast };
