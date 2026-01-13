import { useEffect, useState } from 'react';
import { fetchByGenre, fetchByRegion } from '../lib/api/movies';

export const useMoviesByGenre = ({ genreId, region }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = genreId
          ? await fetchByGenre(genreId)
          : await fetchByRegion(region);

        if (res?.success) {
          setMovies(res.data.results || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [genreId, region]);

  return { movies, loading };
};
