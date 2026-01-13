import { useState, useEffect } from 'react';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies
} from '../lib/api/info';

export const useInfoMovies = (movieId) => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailResp, creditsResp, videosResp, similarResp] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieVideos(movieId),
          getSimilarMovies(movieId)
        ]);

        if (!detailResp.success || !creditsResp.success) {
          setError('Không tải được dữ liệu phim');
          setLoading(false);
          return;
        }

        const detail = detailResp.data;
        const credits = creditsResp.data;
        const videos = videosResp.data;
        const similar = similarResp.data;

        const director = credits.crew.find(p => p.job === 'Director');

        setMovieData({
          ...detail,
          director: director?.name || 'Unknown',
          cast: credits.cast.slice(0, 5),
          trailers: videos.results.filter(v => v.site === 'YouTube' && v.type === 'Trailer'),
          similarMovies: similar.results.slice(0, 5)
        });
      } catch (err) {
        console.error(err);
        setError('Không tải được dữ liệu phim');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  return { movieData, loading, error };
};
