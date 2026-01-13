import { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../lib/api/movies';

export const usePopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularMovies()
      .then(res => {
        if (res?.success) {
          setMovies(res.data.results || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
};
