import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { subscribeToUserComments } from '../../firebase/CommentService';
import { getImageUrl } from '../../lib/utils/image';
import { UserCommentSkeleton } from '../skeleton/Skeletons';

const UserComment = ({ isFullView = false, onViewAllClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const limitCount = isFullView ? null : 3;
    
    const unsubscribe = subscribeToUserComments(
      user.uid,
      (comments) => {
        setReviews(comments);
        setLoading(false);
      },
      limitCount
    );

    return () => unsubscribe();
  }, [user, isFullView]);

  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <UserCommentSkeleton isFullView={isFullView} />;
  }

  if (reviews.length === 0) {
    return (
      <div>
         {!isFullView && (
            <div className="mb-6">
               <h2 className="text-xl font-bold text-white tracking-tight">Recent Reviews</h2>
            </div>
         )}
         <div className={`${isFullView ? '' : 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-6'}`}>
            <div className="text-center py-12 text-gray-500">
              <i className="fa-regular fa-comment-dots text-4xl mb-4 block"></i>
              <p className="text-sm font-medium">Bạn chưa có đánh giá nào</p>
              <p className="text-xs mt-2">Hãy xem phim và để lại nhận xét của bạn!</p>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div>
      {!isFullView ? (
        <div className="mb-6">
           <h2 className="text-xl font-bold text-white tracking-tight">Recent Reviews</h2>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2 uppercase italic tracking-tighter">Đánh giá <span className="text-blue-500">Của bạn</span></h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Lịch sử nhận xét và đánh giá phim</p>
            </div>
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center text-blue-500 shadow-lg">
                <i className="fa-solid fa-comments text-base md:text-xl"></i>
            </div>
        </div>
      )}

      <div className={`${isFullView ? '' : 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-6 space-y-6 group hover:border-white/10 transition-colors'}`}>
        <div className={`${isFullView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-6'}`}>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              onClick={() => navigate(`/watch/${review.movieId}#comment-${review.id}`)}
              className={`flex gap-4 group cursor-pointer ${isFullView ? 'flex-col bg-[#18181b] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300' : ''}`}
            >
              <div className={`relative shrink-0 ${isFullView ? 'w-full aspect-video rounded-2xl overflow-hidden' : 'w-12 h-16'}`}>
                  <img
                  src={review.moviePoster ? getImageUrl(review.moviePoster, isFullView ? 'w500' : 'w200') : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={review.movieTitle}
                  className={`w-full h-full object-cover transition-all duration-500 ${isFullView ? 'group-hover:scale-110' : 'grayscale group-hover:grayscale-0 rounded-xl border border-white/10 shadow-lg'}`}
                  />
                  {isFullView && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                          <div className="w-full">
                               <h3 className="font-black text-white text-lg line-clamp-1 group-hover:text-blue-400 transition-colors shadow-black drop-shadow-md">
                                {review.movieTitle || 'Untitled Movie'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                            key={i}
                                            className={`fa-solid fa-star text-[10px] ${
                                                i < (review.rating || 0) ? 'text-yellow-500' : 'text-gray-600'
                                            }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold px-2 py-0.5 bg-black/50 rounded-full backdrop-blur-md border border-white/10">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                          </div>
                      </div>
                  )}
              </div>

              <div className={`flex-1 flex flex-col ${isFullView ? 'pt-2' : ''}`}>
                {!isFullView && (
                    <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white group-hover:text-blue-500 transition-colors text-sm">
                        {review.movieTitle || 'Untitled Movie'}
                    </h3>
                    <span className="text-gray-500 font-bold whitespace-nowrap text-[10px]">
                        {formatDate(review.createdAt)}
                    </span>
                    </div>
                )}

                {!isFullView && (
                    <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <i
                        key={i}
                        className={`fa-solid fa-star text-[10px] ${
                            i < (review.rating || 0) ? 'text-yellow-500' : 'text-gray-700'
                        }`}
                        />
                    ))}
                    </div>
                )}

                <div className={`relative ${isFullView ? 'bg-black/40 p-4 rounded-xl border border-white/5' : ''}`}>
                    {isFullView && (
                        <i className="fa-solid fa-quote-left text-blue-500/20 text-3xl absolute top-2 left-2"></i>
                    )}
                    <p className={`text-gray-400 leading-relaxed font-medium line-clamp-3 ${isFullView ? 'text-sm relative z-10 pl-2' : 'text-xs'}`}>
                    "{review.text || review.content || review.comment || 'No comment'}"
                    </p>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {!isFullView && reviews.length > 0 && (
          <button 
            onClick={onViewAllClick}
            className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span>View all reviews ({reviews.length})</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserComment;
