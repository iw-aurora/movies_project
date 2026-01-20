import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  EyeOff,
  Trash2,
  Send,
  MessageSquare,
  BarChart3,
  Clock,
  Globe,
  Database,
  Layers,
  Heart,
  CornerDownRight
} from 'lucide-react';
import { db } from '../../firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext';
import Swal from 'sweetalert2';

import { calculateMovieRating } from '../../lib/utils/ratingHelpers';

const MovieInfo = ({ movie }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());
  const [activeSort, setActiveSort] = useState('Newest');
  const [isSending, setIsSending] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const [activeServer, setActiveServer] = useState('Server VIP');
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyText, setReplyText] = useState('');
  const { hash } = useLocation();


  useEffect(() => {
    if (!movie?.id) return;
    const mid = movie.id.toString();
    if (user) {
      const checkFavorite = async () => {
        try {
          const docRef = doc(db, 'users', user.uid, 'my_list', mid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsFavorite(true);
          }
        } catch (error) {
           console.error("Error checking favorites:", error);
        }
      };
      checkFavorite();
    } else {
        setIsFavorite(false);
    }
    const q = query(collection(db, 'movie_comments'), where('movieId', '==', mid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [movie?.id, user]);

  const statsSummary = useMemo(() => {
    // New Logic: Use helper to combine TMDB + User Ratings
    const tmdbRating = movie.vote_average || 0;
    const tmdbCount = movie.vote_count || 0;
    
    return calculateMovieRating(tmdbRating, tmdbCount, comments);
  }, [comments, movie]);

  const sortedComments = useMemo(() => {
    const list = [...comments].sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
      
      if (activeSort === 'Top Rated') {
        const likesA = a.likes || 0;
        const likesB = b.likes || 0;
        if (likesB !== likesA) return likesB - likesA;
      }
      return timeB - timeA;
    });
    return list;
  }, [comments, activeSort]);

  useEffect(() => {
    if (!loading && hash && sortedComments.length > 0) {
      const commentId = hash.replace('#comment-', '');
      const commentIndex = sortedComments.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        if (visibleCommentsCount <= commentIndex) {
            setVisibleCommentsCount(commentIndex + 5);
        }
        setTimeout(() => {
            const element = document.getElementById(`comment-${commentId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.transition = 'background-color 0.5s ease';
                element.style.backgroundColor = 'rgba(37, 99, 235, 0.15)'; 
                setTimeout(() => {
                   element.style.backgroundColor = '';
                }, 2000);
            }
        }, 300);
      }
    }
  }, [loading, hash, sortedComments, visibleCommentsCount]);

  const toggleFavorite = async () => {
    if (!user) return Swal.fire('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để thêm vào yêu thích', 'warning');
    
    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite); 

    const mid = movie.id.toString();
    const docRef = doc(db, 'users', user.uid, 'my_list', mid);

    try {
      if (wasFavorite) {
        await deleteDoc(docRef);
        Swal.fire({
            icon: 'success', title: 'Đã xóa', text: 'Đã xóa khỏi danh sách yêu thích',
            toast: true, position: 'top-end', showConfirmButton: false, timer: 1500,
            background: '#1a1a1a', color: '#fff'
        });
      } else {
        await setDoc(docRef, {
            id: mid,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            addedAt: serverTimestamp()
        });
         Swal.fire({
            icon: 'success', title: 'Đã thêm', text: 'Đã thêm vào danh sách yêu thích',
            toast: true, position: 'top-end', showConfirmButton: false, timer: 1500,
            background: '#1a1a1a', color: '#fff'
        });
      }
    } catch (error) {
      console.error("Favorite Error:", error);
      setIsFavorite(wasFavorite); 
      Swal.fire('Lỗi', 'Có lỗi xảy ra khi cập nhật danh sách yêu thích', 'error');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire('Lỗi', 'Vui lòng đăng nhập', 'warning');
    if (!commentText.trim()) return;

    setIsSending(true);
    try {
      const mid = movie.id.toString();
      const rating = userRating || 5;

      const displayUserName = user.displayName || user.email?.split('@')[0] || 'User';

      await addDoc(collection(db, 'movie_comments'), {
        movieId: mid,
        userId: user.uid,
        userName: displayUserName, 
        userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${displayUserName}&background=random`,
        text: commentText,
        content: commentText, 
        rating: rating,
        movieTitle: movie.title || movie.name || 'Unknown',
        moviePoster: movie.poster_path || '',
        hasSpoiler: containsSpoilers,
        likes: 0,
        dislikes: 0,
        userVotes: {},
        replies: [], 
        createdAt: serverTimestamp()
      });

      setCommentText('');
      setUserRating(0);
      setContainsSpoilers(false);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Bình luận của bạn đã được gửi.',
        toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,
        background: '#1a1a1a', color: '#fff'
      });
    } catch (error) {
      console.error("Comment Error: ", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleReplySubmit = async (commentId) => {
      if (!user) return;
      if (!replyText.trim()) return;
  
      const commentRef = doc(db, 'movie_comments', commentId);
      const displayUserName = user.displayName || user.email?.split('@')[0] || 'User';

      const newReply = {
          id: Date.now().toString(), 
          userId: user.uid,
          userName: displayUserName,
          userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${displayUserName}&background=random`,
          text: replyText,
          createdAt: new Date().toISOString()
      };

      try {
          await updateDoc(commentRef, {
              replies: arrayUnion(newReply)
          });

          setReplyText('');
          setReplyingTo(null);
          Swal.fire({
            icon: 'success',
            title: 'Đã trả lời',
            toast: true, position: 'top-end', showConfirmButton: false, timer: 1500,
             background: '#1a1a1a', color: '#fff'
          });

      } catch (error) {
          console.error("Reply Error:", error);
           Swal.fire('Lỗi', 'Không thể gửi câu trả lời', 'error');
      }
  };

  const handleVote = async (commentId, type) => {
    if (!user) return;
    const commentRef = doc(db, 'movie_comments', commentId);
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const userVotes = comment.userVotes || {};
    const currentVote = userVotes[user.uid];
    let updates = {};

    if (currentVote === type) {
      updates[`userVotes.${user.uid}`] = null;
      updates[type === 'like' ? 'likes' : 'dislikes'] = increment(-1);
    } else {
      updates[`userVotes.${user.uid}`] = type;
      updates[type === 'like' ? 'likes' : 'dislikes'] = increment(1);
      if (currentVote) {
        updates[currentVote === 'like' ? 'likes' : 'dislikes'] = increment(-1);
      }
    }
    await updateDoc(commentRef, updates).catch(e => console.error(e));
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy',
      background: '#1a1a1a', color: '#fff'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, 'movie_comments', commentId));
    }
  };

  const handleDeleteReply = async (commentId, replyToDelete) => {
    if (!user) return;
    const result = await Swal.fire({
      title: 'Xóa trả lời?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      background: '#1a1a1a', color: '#fff'
    });

    if (result.isConfirmed) {
      try {
          const commentRef = doc(db, 'movie_comments', commentId);
          await updateDoc(commentRef, {
              replies: arrayRemove(replyToDelete)
          });
          Swal.fire({
            icon: 'success', title: 'Đã xóa', 
            toast: true, position: 'top-end', showConfirmButton: false, timer: 1500,
            background: '#1a1a1a', color: '#fff'
          });
      } catch (error) {
          console.error("Error deleting reply:", error);
          Swal.fire('Lỗi', 'Không thể xóa câu trả lời', 'error');
      }
    }
  };

  const toggleSpoiler = (id) => {
    const next = new Set(revealedSpoilers);
    next.has(id) ? next.delete(id) : next.add(id);
    setRevealedSpoilers(next);
  };
  
  if (!movie) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Player Controls */}
      <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-sm space-y-6">
        {/* Row 1: Controls (Server, Auto Play, Favorite) */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Left: Server Selection */}
           <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">
                 <Database size={12} className="text-blue-500" /> Chọn Server
              </div>
              <div className="flex gap-2">
                 {['Server VIP', 'Backup 1', 'Backup 2'].map(server => (
                   <button
                     key={server}
                     onClick={() => setActiveServer(server)}
                     className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeServer === server ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
                   >
                     {server}
                   </button>
                 ))}
              </div>
           </div>

           {/* Right: Actions (Auto Play, Favorite) */}
           <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Auto Play Toggle */}
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Auto Play</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-700/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
                    </label>
                </div>

                {/* Favorite Button (Icon Only) */}
                <button 
                    onClick={toggleFavorite}
                    title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isFavorite ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
                </button>
           </div>
        </div>

        {/* Row 2: Episodes */}
        <div className="pt-4 border-t border-white/5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">
                 <Layers size={12} className="text-blue-500" /> Danh sách tập
              </div>
              <div className="flex gap-2">
                 <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                    Tập 1
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Movie Meta Info Card */}
      <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{movie.title || movie.name}</h1>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 text-blue-500 rounded-lg text-xs font-black">
                <Star size={12} fill="currentColor" />
                {statsSummary.average}
              </div>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed font-medium italic">
              {movie.overview}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Clock size={12} /> Thời lượng
                  </div>
                  <div className="text-white font-black">{movie.runtime || movie.episode_run_time?.[0] || 'N/A'} Phút</div>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Star size={12} /> Đánh giá
                  </div>
                  <div className="text-white font-black">{statsSummary.total} Lượt</div>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Globe size={12} /> Quốc gia
                  </div>
                  <div className="text-white font-black truncate">{movie.production_countries?.[0]?.name || 'N/A'}</div>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Star size={12} /> Thể loại
                  </div>
                  <div className="text-white font-black truncate">{movie.genres?.[0]?.name || 'Phim'}</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratings & Reviews Section - Redesigned */}
      <div className="max-w-5xl mx-auto space-y-10">
         
         <div className="flex items-center gap-4 mb-2 pb-4 border-b border-white/5">
             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Bình luận & Đánh giá</h2>
             <span className="text-sm text-gray-500 font-medium">(Audience Reviews)</span>
         </div>

         {/* 1. Stats Card */}
         <div className="bg-[#1a1a1a] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row gap-10 md:gap-20 item-center shadow-2xl border border-white/5">
             {/* Left: Big Score */}
             <div className="flex flex-col items-center justify-center min-w-[200px] text-center">
                 <div className="text-[5rem] leading-none font-black text-white mb-2 tracking-tighter shadow-blue-500/50 drop-shadow-2xl">{statsSummary.average}</div>
                 <div className="flex gap-1.5 text-red-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < Math.round(Number(statsSummary.average)) ? "currentColor" : "none"} />
                    ))}
                 </div>
                 <div className="text-gray-500 text-sm font-bold uppercase tracking-widest">{statsSummary.total} Reviews</div>
             </div>

             {/* Right: Progress Bars */}
             <div className="flex-1 space-y-3 w-full justify-center flex flex-col">
                {statsSummary.breakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 w-3">{item.stars}</span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-500 w-10 text-right">{item.percentage}%</span>
                    </div>
                ))}
             </div>
         </div>

         {/* 2. Comment Input */}
         <div className="flex gap-6">
             <div className="hidden md:block w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                {user ? (
                    <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><MessageSquare size={20} /></div>
                )}
             </div>
             
             <div className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden focus-within:border-white/20 transition-colors shadow-lg">
                <form onSubmit={handleSubmitComment}>
                    <textarea 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Bạn nghĩ gì về bộ phim này? Hãy chia sẻ suy nghĩ của bạn..." 
                        className="w-full bg-transparent border-none p-6 text-base text-gray-200 placeholder:text-gray-600 focus:ring-0 min-h-[120px] resize-none"
                    />
                    
                    <div className="bg-[#151515] px-6 py-4 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="hidden md:flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <button
                                    key={star}
                                    type="button"
                                    onClick={() => setUserRating(star)}
                                    className={`transition-transform hover:scale-125 ${userRating >= star ? 'text-yellow-500' : 'text-gray-700'}`}
                                 >
                                    <Star size={18} fill={userRating >= star ? "currentColor" : "none"} />
                                 </button>
                               ))}
                           </div>
                           <span className="text-xs text-gray-500 font-medium hidden md:block">{userRating > 0 ? `${userRating} Stars` : 'Rate this movie'}</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 border rounded transition-colors flex items-center justify-center ${containsSpoilers ? 'bg-red-500 border-red-500' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                    {containsSpoilers && <EyeOff size={10} className="text-white" />}
                                </div>
                                <input type="checkbox" checked={containsSpoilers} onChange={() => setContainsSpoilers(!containsSpoilers)} className="hidden" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Contains Spoilers</span>
                            </label>

                            <button 
                                type="submit"
                                disabled={!commentText.trim() || isSending || !user}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:shadow-none"
                            > 
                                {isSending ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </form>
             </div>
         </div>

         {/* 3. Filters & List */}
         <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex gap-2">
                   {['Top Rated', 'Newest'].map(sort => (
                        <button
                          key={sort}
                          onClick={() => setActiveSort(sort)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${activeSort === sort ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}
                        >
                          {sort}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Showing {Math.min(visibleCommentsCount, comments.length)} of {comments.length}
                </div>
             </div>

             <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-700" />
                        <p className="text-gray-500">Chưa có bình luận nào.</p>
                    </div>
                ) : (
                    sortedComments.slice(0, visibleCommentsCount).map(comment => (
                        <div key={comment.id} id={`comment-${comment.id}`} className="flex gap-4 md:gap-6 group">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                                <img 
                                    src={comment.userAvatar} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=random` }}
                                    alt="" 
                                />
                            </div>
                            <div className="flex-1 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-bold text-white">{comment.userName}</span>
                                    {Number(comment.rating) > 0 && (
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < Number(comment.rating) ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    )}
                                    <span className="text-[10px] text-gray-600 font-bold">• {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                    {comment.hasSpoiler && <span className="text-[9px] bg-red-900/50 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-wider">Spoiler</span>}
                                </div>

                                <div className="relative mb-3">
                                    {comment.hasSpoiler && !revealedSpoilers.has(comment.id) ? (
                                        <div 
                                            onClick={() => toggleSpoiler(comment.id)} 
                                            className="bg-[#1c1c1c] border border-red-900/30 rounded-lg p-8 text-center cursor-pointer hover:bg-[#222] transition-colors group/spoiler relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                                <EyeOff size={100} />
                                            </div>
                                            <p className="text-red-500 font-black uppercase tracking-[0.2em] mb-1 relative z-10">Contains Spoilers</p>
                                            <p className="text-gray-600 text-xs relative z-10">Click to reveal</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-300 text-sm leading-relaxed">{comment.content || comment.text}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-6">
                                    <button onClick={() => handleVote(comment.id, 'like')} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.userVotes?.[user?.uid] === 'like' ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}>
                                        <ThumbsUp size={14} fill={comment.userVotes?.[user?.uid] === 'like' ? "currentColor" : "none"} /> {comment.likes || 0}
                                    </button>
                                    <button onClick={() => handleVote(comment.id, 'dislike')} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.userVotes?.[user?.uid] === 'dislike' ? 'text-gray-400' : 'text-gray-500 hover:text-white'}`}>
                                        <ThumbsDown size={14} fill={comment.userVotes?.[user?.uid] === 'dislike' ? "currentColor" : "none"} /> 
                                    </button>
                                    <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider">Reply</button>
                                    {user && user.uid === comment.userId && (
                                        <button onClick={() => handleDeleteComment(comment.id)} className="text-xs font-bold text-gray-600 hover:text-red-500 ml-auto">Delete</button>
                                    )}
                                </div>

                                {/* Replies */}
                                {comment.replies?.length > 0 && (
                                    <div className="mt-6 space-y-4 pl-4 border-l-2 border-white/5">
                                        {comment.replies.map((reply, rid) => (
                                            <div key={rid} className="flex gap-4">
                                                <img src={reply.userAvatar} className="w-8 h-8 rounded-full object-cover bg-zinc-800" alt="" />
                                                <div className="flex-1">
                                                     <div className="flex items-center gap-2 mb-1">
                                                         <span className="text-xs font-bold text-white">{reply.userName}</span>
                                                         <span className="text-[10px] text-gray-600">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                                                     </div>
                                                     <p className="text-sm text-gray-400">{reply.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Input */}
                                {replyingTo === comment.id && (
                                    <div className="mt-4 flex gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex-1 relative">
                                            <input 
                                                autoFocus
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
                                                placeholder={`Reply to ${comment.userName}...`}
                                                className="w-full bg-[#151515] border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                                            />
                                            <button 
                                                onClick={() => handleReplySubmit(comment.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-500"
                                            >
                                                <CornerDownRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                
                {visibleCommentsCount < comments.length && (
                    <div className="text-center pt-8">
                        <button onClick={() => setVisibleCommentsCount(p => p + 5)} className="px-8 py-3 rounded-full border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">Load More Comments</button>
                    </div>
                )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default MovieInfo;
