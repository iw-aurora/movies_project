import { Link } from 'react-router-dom';
import { usePopularMovies } from '../../hooks/usePopular';
import { getImageUrl } from '../../lib/utils/image';

const ContinueWatching = ({ onViewAllClick, compact = false }) => {
  const { movies: popularMovies } = usePopularMovies();

  // Mock progress for the first 2 movies
  const movies = popularMovies.slice(0, 2).map((movie, index) => ({
    ...movie,
    progress: index === 0 ? 65 : 80,
    remainingTime: index === 0 ? '1h 24m remaining' : '45m remaining'
  }));

  if (movies.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Continue Watching
        </h2>

        {onViewAllClick && (
          <button 
             onClick={onViewAllClick}
             className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
          >
             <span>View All</span>
             <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/title/${movie.id}`} className="group cursor-pointer block">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-blue-500/50 transition-all">
              <img
                src={getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 scale-75 group-hover:scale-100 transition-transform">
                  <i className="fa-solid fa-play text-white ml-1"></i>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${movie.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-500 transition-colors">
                {movie.title || movie.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {movie.remainingTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatching;
