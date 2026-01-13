import { useEffect, useState } from 'react';
import { fetchAnime } from '../lib/api/movies';

export const useAnime = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnime()
      .then(res => {
        if (res?.success) {
          setMovies(res.data.results || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
};
