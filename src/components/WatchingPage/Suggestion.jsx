import { ChevronRight, Play, Eye, Loader2, Star } from 'lucide-react';
import { getPoster } from '../../lib/utils/image';
import { Link } from 'react-router-dom';

const Suggestion = ({ episodes = [], currentEpisode, onEpisodeSelect, isLoading, recommendations = [] }) => {
  return (
    <aside className="space-y-8 w-full">
      {/* 
        Only show Episodes section if there are episodes. 
        For movies, this might be empty or we might skip it.
      */}
      {episodes.length > 0 && (
        <section className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 shadow-2xl min-h-[300px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
            Danh sách tập
          </h3>
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] bg-blue-500/10 px-2 py-1 rounded">
            S01
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-blue-600">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {episodes.map(ep => {
              const isActive = currentEpisode === ep.number;
              const isWatched = ep.number < currentEpisode;

              return (
                <button
                  key={ep.number}
                  onClick={() => onEpisodeSelect(ep)}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center text-sm font-black relative transition-all group overflow-hidden
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                        : 'bg-black text-gray-500 hover:bg-zinc-900 hover:text-white border border-white/5 hover:border-blue-500/40'
                    }
                  `}
                >
                  {/* Số tập hoặc icon Play */}
                  <span
                    className={`relative z-10 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'group-hover:opacity-0'
                    }`}
                  >
                    {isActive ? <Play size={16} fill="white" /> : ep.number}
                  </span>

                  {/* Icon đã xem */}
                  {isWatched && !isActive && (
                    <div className="absolute top-1.5 right-1.5 text-blue-400 z-10 group-hover:opacity-0 transition-opacity">
                      <Eye size={10} strokeWidth={4} />
                    </div>
                  )}

                  {/* Overlay tiêu đề khi hover */}
                  <div className="absolute inset-0 bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 p-2 text-center">
                    <span className="text-[10px] font-black text-white leading-tight uppercase line-clamp-2 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      {ep.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!isLoading && episodes.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-8 italic font-medium">
            Không tìm thấy tập phim nào.
          </p>
        )}
      </section>
      )}

      <section className="space-y-5 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
            Gợi ý cho bạn
          </h3>
          <button className="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:text-white flex items-center gap-1 group transition-colors">
            Xem thêm
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {recommendations.map(movie => (
            <Link
              to={`/watch/${movie.id}`}
              key={movie.id}
              className="flex gap-4 p-3 bg-[#0c0c0c] hover:bg-[#121212] border border-white/5 rounded-2xl transition-all group cursor-pointer block"
            >
              <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-xl grayscale group-hover:grayscale-0 group-hover:scale-95 transition-all bg-zinc-900 border border-white/5">
                <img
                  src={getPoster(movie.poster_path, "w200")}
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between py-1.5 min-w-0">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white line-clamp-2 leading-tight uppercase group-hover:text-blue-400 transition-colors">
                    {movie.title || movie.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                    <span>{movie.release_date?.slice(0, 4) || 'N/A'}</span>
                    <span className="text-blue-500">•</span>
                    <span className="truncate">Movie</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-black bg-blue-500/10 self-start px-2.5 py-1 rounded-md">
                  <Star size={10} fill="currentColor" />
                  <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </Link>
          ))}
          {recommendations.length === 0 && (
             <p className="text-center text-gray-500 text-sm py-10">Không có gợi ý nào.</p>
          )}
        </div>
      </section>
    </aside>
  );
};

export default Suggestion;
