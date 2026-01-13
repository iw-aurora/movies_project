import { IMAGE_BASE_URL } from '../../config/config';

export const getImageUrl = (path, size = 'w500') => {
  return path
    ? `${IMAGE_BASE_URL}${size}${path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
};

export const getPoster = (path, size = 'w500') => getImageUrl(path, size);

export const getBackdrop = (path, size = 'original') => getImageUrl(path, size);

export const getAvatar = (path, size = 'w185') => getImageUrl(path, size);
