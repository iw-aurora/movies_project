import React, { useState, useMemo, useEffect } from 'react';
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
  getDoc
} from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext';
import Swal from 'sweetalert2';

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
  
  // New States
  const [isFavorite, setIsFavorite] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [replyText, setReplyText] = useState('');

  // 1. Initial Data Fetching (Comments & Favorite Status)
  useEffect(() => {
    if (!movie?.id) return;
    const mid = movie.id.toString();

    // Fetch Favorite Status
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

    // Fetch Comments
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

  // 2. Stats Calculation
  const statsSummary = useMemo(() => {
    const tmdbRating = movie.vote_average || 0;
    const tmdbCount = movie.vote_count || 0;
    const userCount = comments.length;
    
    // User data override if available, else TMDB
    if (userCount === 0) {
      const average = (tmdbRating / 2).toFixed(1);
      const breakdown = [5, 4, 3, 2, 1].map(stars => {
         const scoreTarget = Math.round(tmdbRating / 2);
         const isTarget = stars === scoreTarget;
         return { stars, count: isTarget ? tmdbCount : 0, percentage: isTarget ? 100 : 0 };
      });
      return { total: tmdbCount, average, breakdown, isTMDB: true };
    }

    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumPoints = 0;
    comments.forEach(c => {
      const r = Number(c.rating) || 5;
      ratingsCount[r] = (ratingsCount[r] || 0) + 1;
      sumPoints += r;
    });

    const average = (sumPoints / userCount).toFixed(1);
    const breakdown = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: ratingsCount[stars],
      percentage: Math.round((ratingsCount[stars] / userCount) * 100)
    }));

    return { total: userCount, average, breakdown, isTMDB: false };
  }, [comments, movie]);

  // 3. Sorting Logic
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

  // 4. Handlers
  const toggleFavorite = async () => {
    if (!user) return Swal.fire('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để thêm vào yêu thích', 'warning');
    
    // Optimistic UI Update for instant feedback
    const wasFavorite = isFavorite;
    setIsFavorite(!wasFavorite); 

    const mid = movie.id.toString();
    const docRef = doc(db, 'users', user.uid, 'my_list', mid);

    try {
      if (wasFavorite) {
        // Remove from list
        await deleteDoc(docRef);
        Swal.fire({
            icon: 'success', title: 'Đã xóa', text: 'Đã xóa khỏi danh sách yêu thích',
            toast: true, position: 'top-end', showConfirmButton: false, timer: 1500,
            background: '#1a1a1a', color: '#fff'
        });
      } else {
        // Add to list
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
      setIsFavorite(wasFavorite); // Revert state on error
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

      // Ensure we have a valid name. Priority: Auth DisplayName > Email > 'User'
      // Note: In a real app, you might want to fetch the latest profile from 'users' collection too.
      const displayUserName = user.displayName || user.email?.split('@')[0] || 'User';

      await addDoc(collection(db, 'movie_comments'), {
        movieId: mid,
        userId: user.uid,
        userName: displayUserName, 
        userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${displayUserName}&background=random`,
        text: commentText,
        rating: rating,
        hasSpoiler: containsSpoilers,
        likes: 0,
        dislikes: 0,
        userVotes: {},
        replies: [], // New field for replies
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
          id: Date.now().toString(), // Simple ID
          userId: user.uid,
          userName: displayUserName,
          userAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${displayUserName}&background=random`,
          text: replyText,
          createdAt: new Date().toISOString() // Store as ISO string for simplicity in array
      };

      try {
          // Use arrayUnion to append to the 'replies' array field
          await updateDoc(commentRef, {
              replies: increment(0) // Trick to ensure field exists if needed, but actually we use arrayUnion
          }).catch(() => {}); // Ignore if doc doesn't exist

          // We actually need to read the doc, get current replies, and append, OR use arrayUnion
          // arrayUnion is cleaner but doesn't support serverTimestamp well inside objects in arrays.
          // Let's use get/update for safety or arrayUnion with ISO string timestamp.
          const { arrayUnion } = await import('firebase/firestore'); // dynamic import or just use from top
          
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

      {/* Ratings & Comment Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <BarChart3 className="text-blue-500" size={24} />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Đánh giá chung</h2>
          </div>
          
          <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">{statsSummary.average}</div>
              <div className="flex justify-center gap-1 text-yellow-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(Number(statsSummary.average)) ? "currentColor" : "none"} />
                ))}
              </div>
              <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{statsSummary.total} nhận xét</div>
              {statsSummary.isTMDB && (
                <div className="mt-3 py-1 px-3 bg-blue-600/10 border border-blue-500/20 rounded-full inline-block">
                   <span className="text-[8px] text-blue-500 font-black uppercase tracking-tighter">Dữ liệu từ TMDB</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {statsSummary.breakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 w-8">
                    <span className="text-xs font-black text-gray-400">{item.stars}</span>
                    <Star size={10} className="text-gray-600" />
                  </div>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] font-black text-gray-600 w-8 text-right">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <MessageSquare className="text-blue-500" size={24} />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Để lại bình luận</h2>
          </div>

          <form onSubmit={handleSubmitComment} className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Đánh giá của bạn:</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`transition-all ${userRating >= star ? 'text-yellow-500 scale-110' : 'text-gray-800 hover:text-gray-600'}`}
                      >
                        <Star size={24} fill={userRating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? "Chia sẻ cảm nghĩ của bạn về bộ phim..." : "Vui lòng đăng nhập để bình luận"}
                  disabled={!user}
                  className="w-full bg-black border border-white/5 rounded-2xl p-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 resize-none h-32 transition-all disabled:opacity-50"
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitComment(e);
                      }
                  }}
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setContainsSpoilers(!containsSpoilers)}
                disabled={!user}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${containsSpoilers ? 'text-blue-500' : 'text-gray-600 hover:text-gray-400'} disabled:opacity-50`}
              >
                <EyeOff size={14} /> Có Spoilers?
              </button>
              
              <button
                type="submit"
                disabled={!commentText.trim() || isSending || !user}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                <Send size={16} /> {isSending ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Bình luận</h2>
              <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-gray-500">{comments.length}</span>
           </div>
           <div className="flex gap-4">
              {['Top Rated', 'Newest'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeSort === sort ? 'text-blue-500' : 'text-gray-600 hover:text-white'}`}
                >
                  {sort === 'Top Rated' ? 'Hữu ích nhất' : 'Mới nhất'}
                </button>
              ))}
           </div>
        </div>

        <div className="space-y-8">
          {loading ? (
             <div className="text-center py-10">
                <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-3xl"></i>
             </div>
          ) : comments.length === 0 ? (
             <div className="text-center py-16 bg-white/[0.01] rounded-[32px] border border-white/5">
                <MessageSquare className="mx-auto text-gray-800 mb-4" size={40} />
                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
             </div>
          ) : sortedComments.slice(0, visibleCommentsCount).map((comment) => (
            <div key={comment.id} className="group/item border-b border-white/5 pb-8 last:border-0">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/5 bg-zinc-900 shadow-2xl">
                  <img 
                    src={comment.userAvatar} 
                    alt={comment.userName} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${comment.userName}&background=random` }}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-white uppercase italic">{comment.userName}</span>
                        <div className="flex gap-0.5 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < (Number(comment.rating) || 0) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-700 font-bold">
                          • {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(comment.createdAt.toDate()).toLocaleDateString('vi-VN') : 'Vừa xong'}
                        </span>
                      </div>
                      {user && user.uid === comment.userId && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-widest transition-all hover:scale-105"
                          title="Xóa bình luận này"
                        >
                          XÓA
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    {comment.hasSpoiler && !revealedSpoilers.has(comment.id) ? (
                      <div 
                        onClick={() => toggleSpoiler(comment.id)}
                        className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all group"
                      >
                        <EyeOff className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Nội dung có Spoilers</span>
                        <span className="text-[9px] text-gray-600 font-bold">Nhấn để xem chi tiết</span>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-base leading-relaxed font-medium">{comment.text}</p>
                    )}
                  </div>
                  
                  {/* Action Buttons & Reply Toggle */}
                  <div className="flex items-center gap-8 pt-2">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                      <button 
                        onClick={() => handleVote(comment.id, 'like')}
                        className={`flex items-center gap-2 transition-colors ${comment.userVotes?.[user?.uid] === 'like' ? 'text-blue-500' : 'text-gray-600 hover:text-blue-400'}`}
                      >
                        <ThumbsUp size={14} fill={comment.userVotes?.[user?.uid] === 'like' ? "currentColor" : "none"} /> {comment.likes || 0}
                      </button>
                      <button 
                         onClick={() => handleVote(comment.id, 'dislike')}
                         className={`flex items-center gap-2 transition-colors ${comment.userVotes?.[user?.uid] === 'dislike' ? 'text-red-500' : 'text-gray-600 hover:text-red-400'}`}
                      >
                        <ThumbsDown size={14} fill={comment.userVotes?.[user?.uid] === 'dislike' ? "currentColor" : "none"} /> {comment.dislikes || 0}
                      </button>
                      <button 
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors ml-4"
                      >
                          <CornerDownRight size={14} /> Trả lời
                      </button>
                    </div>
                  </div>

                  {/* Replies Rendering */}
                  {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-6 border-l w-full border-white/10 mt-4 space-y-4">
                          {comment.replies.map((reply, rIdx) => (
                              <div key={rIdx} className="flex gap-4">
                                  <img src={reply.userAvatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                  <div>
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-bold text-white">{reply.userName}</span>
                                          <span className="text-[10px] text-gray-600">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                                      </div>
                                      <p className="text-sm text-gray-400 ">{reply.text}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* Reply Input Form */}
                  {replyingTo === comment.id && (
                      <div className="mt-4 flex gap-4 animate-in fade-in slide-in-from-top-2">
                           <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/5">
                               {user ? (
                                   <img src={user.photoURL} className="w-full h-full object-cover" alt="Me" />
                               ) : <div className="w-full h-full bg-zinc-800" />}
                           </div>
                           <div className="flex-1">
                               <input 
                                  type="text" 
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={`Trả lời ${comment.userName}...`}
                                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                  onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleReplySubmit(comment.id);
                                  }}
                                  autoFocus
                               />
                               <div className="flex justify-end gap-2 mt-2">
                                   <button onClick={() => setReplyingTo(null)} className="text-[10px] uppercase font-bold text-gray-500 hover:text-white px-3 py-1">Hủy</button>
                                   <button onClick={() => handleReplySubmit(comment.id)} className="text-[10px] uppercase font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500">Gửi</button>
                               </div>
                           </div>
                      </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCommentsCount < comments.length && (
          <div className="text-center pt-8">
            <button
               onClick={() => setVisibleCommentsCount(prev => prev + 5)}
               className="bg-white/5 text-gray-400 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              Xem thêm bình luận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieInfo;
