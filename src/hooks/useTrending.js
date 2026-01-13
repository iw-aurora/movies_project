import { useEffect, useState } from 'react';
import { fetchTrending } from '../lib/api/movies';

export const useTrending = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending()
      .then(res => {
        if (res?.success) {
          setMovies(res.data.results || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
};
