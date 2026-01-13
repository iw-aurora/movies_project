import { useState, useEffect } from "react";
import Info from "../components/TitlePage/Info";
import Cast from "../components/TitlePage/Cast";
import Trailer from "../components/TitlePage/Trailer";
import SimilarMovies from "../components/TitlePage/SimilarMovies";
import { useInfoMovies } from "../hooks/useInfoMovies";
import { useParams } from "react-router-dom";
import { TitlePageSkeleton } from "../components/skeleton/Skeletons";
import { MIN_LOADING_TIME } from "../config/config";

const TitlePage = () => {
  const { id } = useParams();
  const movieId = id ? parseInt(id, 10) : null;

  const { movieData, loading: dataLoading, error } = useInfoMovies(movieId);
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, [id]);

  const loading = dataLoading || minLoading;

  if (loading) {
    return <TitlePageSkeleton />;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#111112] text-zinc-100">
      <Info movie={movieData} />
      <Cast cast={movieData.cast} />
      <Trailer trailers={movieData.trailers} />
      <SimilarMovies movies={movieData.similarMovies} />
    </div>
  );
};

export default TitlePage;
