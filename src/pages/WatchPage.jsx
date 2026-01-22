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

        if (videosResp.success && videosResp.data.results?.length > 0) {
           const videos = videosResp.data.results.filter(v => v.site === 'YouTube');
           
           // Priority order: Official Trailer → Any Trailer → Teaser → Any video
           const video = 
             videos.find(v => v.type === 'Trailer' && v.official) ||  // Official trailer
             videos.find(v => v.type === 'Trailer') ||                 // Any trailer
             videos.find(v => v.type === 'Teaser') ||                  // Teaser
             videos.find(v => v.type === 'Clip') ||                    // Clip
             videos[0];                                                 // First available video
           
           if (video) {
             setTrailerUrl(`https://www.youtube.com/embed/${video.key}`);
           } else {
             setTrailerUrl(null);
           }
        } else {
          setTrailerUrl(null);
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

      <main className="flex-1 px-2 md:px-12 py-4 md:py-8 container mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 md:gap-2 text-[7px] md:text-sm text-white/40 mb-6 font-semibold uppercase tracking-widest md:tracking-[0.2em]">
          <Link to="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-2 h-2 md:w-4 md:h-4 text-white/20" />
          <Link to="/store" className="hover:text-white transition-colors">
            Khám phá
          </Link>
          <ChevronRight className="w-2 h-2 md:w-4 md:h-4 text-white/20" />
          <span className="text-white/60 font-bold truncate max-w-[150px] md:max-w-[400px]">{movie.title || movie.name}</span>
        </nav>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
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
