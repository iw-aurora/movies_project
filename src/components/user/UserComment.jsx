import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { subscribeToUserComments } from '../../firebase/CommentService';
import { getImageUrl } from '../../lib/utils/image';

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
    return (
      <div>
         <div className={`${isFullView ? '' : 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-6'}`}>
            <div className="flex items-center justify-center py-12">
              <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600"></i>
            </div>
         </div>
      </div>
    );
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
      {!isFullView && (
        <div className="mb-6">
           <h2 className="text-xl font-bold text-white tracking-tight">Recent Reviews</h2>
        </div>
      )}

      <div className={`${isFullView ? '' : 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-6 space-y-6 group hover:border-white/10 transition-colors'}`}>
        <div className={`${isFullView ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              onClick={() => navigate(`/watch/${review.movieId}#comment-${review.id}`)}
              className={`flex gap-4 group cursor-pointer ${isFullView ? 'bg-zinc-900/50 p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all' : ''}`}
            >
              <div className={`relative shrink-0 ${isFullView ? 'w-24 h-36' : 'w-12 h-16'}`}>
                  <img
                  src={review.moviePoster ? getImageUrl(review.moviePoster) : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={review.movieTitle}
                  className="w-full h-full rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10 shadow-lg"
                  />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-white group-hover:text-blue-500 transition-colors ${isFullView ? 'text-lg' : 'text-s'}`}>
                    {review.movieTitle || 'Untitled Movie'}
                  </h3>
                  <span className={`text-gray-500 font-bold whitespace-nowrap ${isFullView ? 'text-xs' : 'text-[10px]'}`}>
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa-solid fa-star ${isFullView ? 'text-xs' : 'text-[10px]'} ${
                        i < (review.rating || 0) ? 'text-yellow-500' : 'text-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <p className={`text-gray-400 leading-relaxed font-medium line-clamp-3 ${isFullView ? 'text-sm' : 'text-xs'}`}>
                  "{review.text || review.content || review.comment || 'No comment'}"
                </p>
                
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
