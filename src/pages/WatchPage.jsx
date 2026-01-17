import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VidPlayer from '../components/WatchingPage/VidPlayer';
import MovieInfo from '../components/WatchingPage/MovieInfo';
import Suggestion from '../components/WatchingPage/Suggestion'
import { ChevronRight } from 'lucide-react';
import { getMovieDetails, getMovieVideos, getSimilarMovies } from '../lib/api/info';
import { getBackdrop } from '../lib/utils/image';

const WatchPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const [detailResp, videosResp, similarResp] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getSimilarMovies(id)
        ]);

        if (detailResp.success) {
          setMovie(detailResp.data);
        }

        if (videosResp.success) {
           const trailer = videosResp.data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
           if (trailer) {
             setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
           } else {
             setTrailerUrl(null);
           }
        }

        if (similarResp.success) {
          setRecommendations(similarResp.data.results || []);
        }

      } catch (error) {
        console.error('Failed to load app data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#111112]">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
          </div>
      )
  }

  if (!movie) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#111112] text-white">
              <p>Không tìm thấy phim.</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600/40 selection:text-white bg-[#111112]">

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-24"></div>

      <main className="flex-1 px-4 md:px-12 py-8 max-w-[1600px] mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs text-gray-600 mb-8 font-black uppercase tracking-widest">
          <Link to="/" className="hover:text-blue-500 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={12} className="text-gray-800" />
          <Link to="#" className="hover:text-blue-500 transition-colors">
            Phim
          </Link>
          <ChevronRight size={12} className="text-gray-800" />
          <span className="text-gray-400">{movie.title || movie.name}</span>
        </nav>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            <VidPlayer 
                trailerUrl={trailerUrl} 
                movie={movie} 
                backdropUrl={getBackdrop(movie.backdrop_path, "original")}
            />
            {/* MovieInfo currently handles comments mostly, adapting it to generic use */}
            <MovieInfo movie={movie} /> 
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <Suggestion
                // episodes={} // Leave empty for movie mode
                recommendations={recommendations}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default WatchPage;
