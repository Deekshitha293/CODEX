const SUPPORTED_GST_RATES = [5, 12, 18, 28];

const calculateGST = (price, rate = 18) => {
  if (!SUPPORTED_GST_RATES.includes(Number(rate))) {
    throw new Error('Unsupported GST rate. Supported rates: 5, 12, 18, 28');
  }
  return (Number(price) * Number(rate)) / 100;
};

module.exports = { calculateGST, SUPPORTED_GST_RATES };
