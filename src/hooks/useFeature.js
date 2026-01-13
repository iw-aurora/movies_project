import { useEffect, useState } from 'react';
import { fetchFeaturedMovies } from '../lib/api/movies';

export const useFeaturedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchFeaturedMovies();
        if (res?.success) {
          setMovies(res.data.results || []);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { movies, loading };
};
