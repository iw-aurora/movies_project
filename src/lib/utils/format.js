export const formatRating = (rating, decimals = 1) => {
  if (!rating && rating !== 0) return '0.0';
  return Number(rating).toFixed(decimals);
};