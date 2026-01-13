// Lấy ngẫu nhiên 1 phần tử trong mảng
export const getRandomItem = (array) => {
  if (!array || array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// Lấy tối đa 'limit' phần tử từ mảng
export const limitArray = (array, limit) => {
  if (!array) return [];
  return array.slice(0, limit);
};
