import { useState, useEffect, useMemo } from 'react';
import { subscribeToComments, hardDeleteComment, getMoviesWithComments } from '../../firebase/CommentService';
import { Clapperboard, MessageSquare, Search, Trash2, ArrowLeft, Calendar, User as UserIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const CommentManage = () => {
  const [comments, setComments] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = subscribeToComments((data) => {
      setComments(data);
      setMovies(getMoviesWithComments(data));
    });
    return () => unsub();
  }, []);

  const filteredComments = useMemo(() => {
    let result = [...comments];

    if (selectedMovieId) {
      result = result.filter(c => c.movieId === selectedMovieId);
    }

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(c =>
        (c.content?.toLowerCase() || c.text?.toLowerCase() || '').includes(lowSearch) ||
        (c.userName?.toLowerCase() || '').includes(lowSearch)
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments, selectedMovieId, searchTerm]);

  const selectedMovie = movies.find(m => m.id === selectedMovieId);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Xóa vĩnh viễn?',
      text: `Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa bình luận này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      background: '#18181b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      await hardDeleteComment(id);
      Swal.fire({
        title: 'Đã xóa',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        background: '#18181b',
        color: '#fff'
      });
    }
  };

  return (

    <div className="mt-4 md:mt-10 bg-zinc-900/20 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER BAR (Consistent with UserTable) */}
      <div className="px-8 py-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between bg-zinc-900/40 gap-4">
        <div className="flex items-center space-x-3">
           {!selectedMovieId ? (
              <>
                 <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                 <h2 className="text-xs md:text-lg font-bold text-white tracking-tight">
                    Danh sách phim có bình luận
                 </h2>
              </>
           ) : (
              <>
                <button
                   onClick={() => setSelectedMovieId(null)}
                   className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                   title="Quay lại danh sách phim"
                >
                   <ArrowLeft size={16} />
                </button>
                <div className="flex flex-col">
                   <h2 className="text-xs md:text-lg font-bold text-white tracking-tight line-clamp-1">{selectedMovie?.title}</h2>
                </div>
              </>
           )}
        </div>

        {/* SEARCH BAR */}
        <div className="flex flex-1 max-w-md relative group">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-rose-500 transition-colors" />
           </div>
           <input
              type="text"
              placeholder={!selectedMovieId ? "Tìm kiếm phim..." : "Tìm nội dung, người dùng..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl pl-11 pr-10 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/50 outline-none transition-all"
           />
           {searchTerm && (
               <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
               >
                 <i className="fa-solid fa-xmark"></i>
               </button>
           )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-8">
         {!selectedMovieId ? (
             /* MOVIE GRID */
             <>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map(movie => (
                      <button
                        key={movie.id}
                        onClick={() => { setSelectedMovieId(movie.id); setSearchTerm(''); }}
                        className="group relative bg-zinc-900/40 rounded-2xl border border-white/5 overflow-hidden hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 text-left transition-all"
                      >
                        <div className="aspect-[2/3] w-full overflow-hidden">
                          <img
                            src={movie.poster?.startsWith('/') ? `https://image.tmdb.org/t/p/w500${movie.poster}` : movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-sm font-black text-white line-clamp-1">
                            {movie.title}
                          </h3>
                          <div className="mt-1 flex items-center space-x-2 text-zinc-400 text-[10px] font-bold">
                            <MessageSquare size={12} className="text-rose-500" />
                            <span>{movie.commentCount} bình luận</span>
                          </div>
                        </div>
                      </button>
                    ))}
                 </div>
                 {movies.length === 0 && (
                     <div className="text-center py-20 text-zinc-600 italic text-sm">Chưa có dữ liệu.</div>
                 )}
                 {movies.length > 0 && movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                     <div className="text-center py-20 text-zinc-600 italic text-sm">Không tìm thấy phim nào phù hợp.</div>
                 )}
             </>
         ) : (
             /* COMMENTS LIST */
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {filteredComments.length > 0 ? (
                  filteredComments.map(comment => (
                    <div
                      key={comment.id}
                      className={`relative bg-zinc-950/30 rounded-2xl border border-white/5 p-4 transition-all hover:bg-zinc-900/50 group ${
                        comment.isDeleted ? 'opacity-50 grayscale border-dashed' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 shrink-0 overflow-hidden border border-white/10">
                             <img 
                                src={comment.userAvatar} 
                                alt={comment.userName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName || 'User')}&background=random` }}
                             />
                        </div>
                        
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">{comment.userName}</span>
                                  <span className="text-[10px] text-zinc-500 font-medium">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                              </div>
                           </div>
                           <p className={`text-sm text-zinc-300 leading-relaxed ${comment.isDeleted ? 'line-through italic text-red-400' : ''}`}>
                              {comment.content || comment.text}
                           </p>
                           {comment.hasSpoiler && <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-1 block">Contains Spoiler</span>}
                        </div>

                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <button
                              onClick={() => handleDelete(comment.id)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:scale-110"
                              title="Xóa vĩnh viễn"
                            >
                              <Trash2 size={18} />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-zinc-500 border border-white/5 rounded-2xl border-dashed text-sm">
                    Không tìm thấy bình luận nào phù hợp.
                  </div>
                )}
             </div>
         )}
      </div>
    </div>
  );
};

export default CommentManage;
