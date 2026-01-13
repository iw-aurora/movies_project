import { IMAGE_BASE_URL } from '../../config/config';

export const getImageUrl = (path, size = 'w500') => {
  return path
    ? `${IMAGE_BASE_URL}${size}${path}`
    : 'https://static.toiimg.com/thumb/msid-123564632,imgsize-51528,width-400,resizemode-4/release-of-balakrishnas-akhanda-2-thandaavam-postponed.jpg';
};


export const getPoster = (path, size = 'w500') => getImageUrl(path, size);

export const getBackdrop = (path, size = 'original') => getImageUrl(path, size);

export const getAvatar = (path, size = 'w185') => getImageUrl(path, size);
