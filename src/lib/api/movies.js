import client from './client';
import { ENDPOINTS } from './endpoints';

export const fetchTrending = () => client.get(ENDPOINTS.TRENDING);

export const fetchPopularMovies = () => client.get(ENDPOINTS.POPULAR);

export const fetchByGenre = (genreId) => client.get(ENDPOINTS.GENRE(genreId));

export const fetchByRegion = (lang) => client.get(ENDPOINTS.REGION(lang));

export const fetchAnime = () => client.get(ENDPOINTS.ANIME);

export const fetchFeaturedMovies = () => client.get(ENDPOINTS.FEATURED);

export const fetchUpcoming = () => client.get(ENDPOINTS.UPCOMING);