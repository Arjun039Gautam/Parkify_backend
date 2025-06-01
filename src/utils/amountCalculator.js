// utils/amountCalculator.js
export const calculateAmount = ({ isGuest, vehicleType, passType = null }) => {
  const guestPrices = {
    '2-wheeler': 20,
    '4-wheeler': 50
  };

  const userPrices = {
    daily: { '2-wheeler': 20, '4-wheeler': 50 },
    monthly: { '2-wheeler': 450, '4-wheeler': 1200 },
    yearly: { '2-wheeler': 3650, '4-wheeler': 12770 }
  };

  if (isGuest) {
    return guestPrices[vehicleType] || 0;
  } else {
    return (userPrices[passType]?.[vehicleType]) || 0;
  }
};
