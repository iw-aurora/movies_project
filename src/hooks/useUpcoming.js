import { useEffect, useState } from 'react';
import { fetchUpcoming } from '../lib/api/movies';

export const useUpcoming = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming()
      .then(res => {
        if (res?.success) {
          setMovies(res.data.results || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading };
};
