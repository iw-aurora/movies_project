import Info from '../components/TitlePage/Info';
import Cast from '../components/TitlePage/Cast';
import Trailer from '../components/TitlePage/Trailer';
import SimilarMovies from '../components/TitlePage/SimilarMovies';
import { useInfoMovies } from '../hooks/useInfoMovies';
import { useParams } from 'react-router-dom';

const TitlePage = () => {
    // const movieId = 667320;
    const { id } = useParams(); 
    const movieId = id ? parseInt(id, 10) : null;
 

  const { movieData, loading, error } = useInfoMovies(movieId);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Đang tải dữ liệu phim...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050e1d] text-white">
      <Info movie={movieData} />
      <Cast cast={movieData.cast} />
      <Trailer trailers={movieData.trailers} />
      <SimilarMovies movies={movieData.similarMovies} />
    </div>
  );
};

export default TitlePage;
