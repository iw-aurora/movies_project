export const ENDPOINTS = {
  TRENDING: '/trending/all/day',
  POPULAR: '/movie/popular',
  GENRE: (genreId) => `/discover/movie?with_genres=${genreId}`,
  REGION: (lang) => `/discover/movie?with_original_language=${lang}`,
  ANIME: '/discover/movie?with_genres=16&with_keywords=210024|222243',
  FEATURED: '/discover/movie?sort_by=popularity.desc&vote_average.gte=7.5&vote_count.gte=500',
  UPCOMING: '/movie/upcoming',
};
