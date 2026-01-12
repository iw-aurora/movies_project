import { IMAGE_BASE_URL } from '../api/config';

export const getImageUrl = (path, size = 'w500') => {
  return path
    ? `${IMAGE_BASE_URL}${size}${path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
};

