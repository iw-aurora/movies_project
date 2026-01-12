const TMDB_API_KEY = '3572afb2661c4acaf58252d63fc14cd1';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const GENRES = {
  ANIME: 16,
  DOCUMENTARY: 99,
  COMEDY: 35,
  SCI_FI: 878,
  ACTION: 28,
  KOREAN: 'ko',
  HORROR: 27,
};

// Trending
export const fetchTrending = async () => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=vi-VN`
    );
    if (!res.ok) throw new Error('Failed to fetch trending');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Popular
export const fetchPopularMovies = async () => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN`
    );
    if (!res.ok) throw new Error('Failed to fetch popular movies');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Theo thể loại
export const fetchByGenre = async (genreId) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=vi-VN`
    );
    if (!res.ok) throw new Error('Failed to fetch movies by genre');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Theo ngôn ngữ (Hàn, Thái, Nhật…)
export const fetchByRegion = async (lang) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${lang}&language=vi-VN`
    );
    if (!res.ok) throw new Error('Failed to fetch movies by region');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Anime
export const fetchAnime = async () => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}` +
      `&with_genres=${GENRES.ANIME}` +
      `&with_keywords=210024|222243` +
      `&language=vi-VN`
    );
    if (!res.ok) throw new Error('Failed to fetch anime');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Phim thuê đặc sắc
export const fetchFeaturedMovies = async () => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/discover/movie?` +
      new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'vi-VN',
        sort_by: 'popularity.desc',
        vote_average_gte: 7.5,
        vote_count_gte: 500,
        page: 1,
      })
    );

    if (!res.ok) throw new Error('Failed to fetch featured movies');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
// 
export const fetchUpcoming = async () => {
  const response = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=vi`);
  return response.json();
};
// Image
export const getImageUrl = (path, size = 'w500') => {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
};
