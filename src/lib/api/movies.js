import client from './client';
import { ENDPOINTS } from './endpoints';

export const fetchTrending = () => client.get(ENDPOINTS.TRENDING);

export const fetchPopularMovies = (page = 1) => client.get(ENDPOINTS.POPULAR, { params: { page } });

export const fetchByGenre = (genreId, page = 1) => client.get(ENDPOINTS.GENRE(genreId), { params: { page } });

export const fetchByRegion = (lang) => client.get(ENDPOINTS.REGION(lang));

export const fetchAnime = () => client.get(ENDPOINTS.ANIME);

export const fetchFeaturedMovies = () => client.get(ENDPOINTS.FEATURED);

export const fetchUpcoming = () => client.get(ENDPOINTS.UPCOMING);

export const fetchPopularSeries = (page = 1) => client.get(ENDPOINTS.TV_POPULAR, { params: { page } });

export const fetchSeriesByGenre = (genreId, page = 1) => client.get(ENDPOINTS.TV_GENRE(genreId), { params: { page } });

export const searchMovies = (query, page = 1) => client.get(ENDPOINTS.SEARCH, { params: { query, page } });

export const discoverMovies = ({ page = 1, genreId = null, sortBy = 'popularity.desc' }) => {
    const params = {
        page,
        sort_by: sortBy,
        'vote_count.gte': 100, // Filter out noise
    };
    if (genreId && genreId !== 'all') {
        params.with_genres = genreId;
    }
    return client.get(ENDPOINTS.DISCOVER, { params });
};