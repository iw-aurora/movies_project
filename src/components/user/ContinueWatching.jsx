import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { getWatchHistory } from '../../firebase/HistoryService';
import { getImageUrl } from '../../lib/utils/image';
import { History } from 'lucide-react';
import { ContinueWatchingSkeleton } from '../skeleton/Skeletons';

const ContinueWatching = ({ onViewAllClick, compact = false }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadHistory = async () => {
        const history = await getWatchHistory(user.uid);
        
        // Format for display
        const formatted = history.map(item => ({
            ...item,
            // Calculate remaining
            remainingTime: formatRemaining(item.duration - item.progress)
        }));

        setMovies(compact ? formatted.slice(0, 2) : formatted);
        setLoading(false);
      };
      loadHistory();
    } else {
        setMovies([]);
        setLoading(false);
    }
  }, [user, compact]);

  const formatRemaining = (seconds) => {
      if (seconds <= 0) return 'Completed';
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) return `${hours}h ${minutes}m còn lại`;
      return `${minutes}m còn lại`;
  };

  if (loading) return <ContinueWatchingSkeleton />;
  
  if (movies.length === 0) {
      return (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Continue Watching
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
             <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                <History size={24} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
             </div>
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">Chưa có lịch sử xem</p>
             <p className="text-zinc-600 text-[10px] mb-4">Các phim bạn đang xem dở sẽ hiện ở đây</p>
             <Link to="/" className="px-5 py-2 rounded-full bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                 Khám phá phim ngay
             </Link>
          </div>
        </section>
      );
  }

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
          <Link key={movie.id} to={`/watch/${movie.movieId || movie.id}`} className="group cursor-pointer block">
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
                    style={{ width: `${movie.percentage || 0}%` }}
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
