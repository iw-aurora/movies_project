import { useMemo } from 'react';
import { GENRES } from '../lib/api/genres';
import { getRandomItem, limitArray } from '../lib/utils/array';

import { useTrending } from './useTrending';
import { usePopularMovies } from './usePopular';
import { useAnime } from './useAnime';
import { useUpcoming } from './useUpcoming';
import { useFeaturedMovies } from './useFeature';
import { useMoviesByGenre } from './useMoviesByGenre';

export const useHomeData = () => {
  const { movies: trending, loading: trendingLoading } = useTrending();
  const { movies: popular, loading: popularLoading } = usePopularMovies();
  const { movies: anime, loading: animeLoading } = useAnime();
  const { movies: upcoming, loading: upcomingLoading } = useUpcoming();
  const { movies: featured, loading: featuredLoading } = useFeaturedMovies();

  const { movies: nature, loading: natureLoading } =
    useMoviesByGenre({ genreId: GENRES.DOCUMENTARY });

  const { movies: comedy, loading: comedyLoading } =
    useMoviesByGenre({ genreId: GENRES.COMEDY });

  const { movies: sciFi, loading: sciFiLoading } =
    useMoviesByGenre({ genreId: GENRES.SCI_FI });

  const { movies: horror, loading: horrorLoading } =
    useMoviesByGenre({ genreId: GENRES.HORROR });

  const { movies: korean, loading: koreanLoading } =
    useMoviesByGenre({ region: GENRES.KOREAN });

  const loading =
    trendingLoading ||
    popularLoading ||
    animeLoading ||
    upcomingLoading ||
    featuredLoading ||
    natureLoading ||
    comedyLoading ||
    sciFiLoading ||
    horrorLoading ||
    koreanLoading;

  const heroMovie = useMemo(
    () => (trending.length ? getRandomItem(trending) : null),
    [trending]
  );

  const sections = useMemo(() => ({
    hot: limitArray(trending, 10),
    top5: limitArray(popular, 5),
    featured: limitArray(featured, 10),
    topSpecial: limitArray(popular, 3),
    nature,
    comedy,
    korean,
    anime,
    scifi: sciFi,
    horror,
    upcoming: limitArray(upcoming, 10),
  }), [
    trending,
    popular,
    featured,
    nature,
    comedy,
    korean,
    anime,
    sciFi,
    horror,
    upcoming
  ]);

  return { sections, heroMovie, loading };
};
