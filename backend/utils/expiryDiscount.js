const getExpiryDiscount = (expiryDate) => {
  const daysLeft = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  if (daysLeft <= 3) return { daysLeft, discountPercentage: 40 };
  if (daysLeft <= 7) return { daysLeft, discountPercentage: 25 };
  if (daysLeft <= 15) return { daysLeft, discountPercentage: 10 };
  return { daysLeft, discountPercentage: 0 };
};

module.exports = { getExpiryDiscount };
