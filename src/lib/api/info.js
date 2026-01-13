import client from './client'; 

export const getMovieDetails = (id) => client.get(`/movie/${id}`);
export const getMovieCredits = (id) => client.get(`/movie/${id}/credits`);
export const getMovieVideos = (id) => client.get(`/movie/${id}/videos`);
export const getSimilarMovies = (id) => client.get(`/movie/${id}/similar`);
