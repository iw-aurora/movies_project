import { useMemo } from 'react';
import { getRandomItem, limitArray } from '../lib/utils/array';
import { usePopularMovies } from './usePopular';
import { useUpcoming } from './useUpcoming';
import { useFeaturedMovies } from './useFeature';

export const useIntroduceData = () => {
  const { movies: popular, loading: popularLoading } = usePopularMovies();
  const { movies: upcoming, loading: upcomingLoading } = useUpcoming();
  const { movies: featured, loading: featuredLoading } = useFeaturedMovies();

  const loading =
    popularLoading ||
    upcomingLoading ||
    featuredLoading;

  const heroMovie = useMemo(
    () => (popular?.length ? getRandomItem(popular) : null),
    [popular]
  );

  const sections = useMemo(() => ({
    top5: limitArray(popular, 5),
    featured: limitArray(featured, 10),
    upcoming: limitArray(upcoming, 10),
  }), [
    popular,
    featured,
    upcoming
  ]);

  return { sections, heroMovie, loading };
};
