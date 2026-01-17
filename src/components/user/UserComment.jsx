import { useTrending } from '../../hooks/useTrending';
import { getImageUrl } from '../../lib/utils/image';

const UserComment = ({ isFullView = false, onViewAllClick }) => {
  const { movies: trendingMovies } = useTrending();
  
  // Create mock reviews based on trending movies
  // If full view, we can pretend there are more reviews by duplicating or using more trending movies
  const sourceMovies = isFullView ? trendingMovies : trendingMovies.slice(0, 2);
  
  const reviews = sourceMovies.map((movie, index) => ({
    id: movie.id + index, // ensure unique ID if we have duplicates in real scenarios
    movieTitle: movie.title || movie.name,
    avatar: getImageUrl(movie.poster_path),
    rating: 5,
    content: index % 2 === 0
      ? 'Visual masterpiece. The sound design is incredible...' 
      : 'Still blows my mind every time I watch it.',
    date: '2d ago',
  }));

  if (reviews.length === 0) return null;

  return (
    <div className={`${isFullView ? '' : 'bg-white/[0.03] border border-white/5 rounded-3xl p-6 mb-6'}`}>
      {!isFullView && (
        <div className="flex items-center gap-2 mb-6 text-yellow-500">
           <i className="fa-solid fa-star text-sm"></i>
           <h2 className="text-lg font-bold text-white">Recent Reviews</h2>
        </div>
      )}

      <div className={`${isFullView ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className={`flex gap-4 group ${isFullView ? 'bg-zinc-900/50 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all' : ''}`}
          >
            <div className={`relative shrink-0 ${isFullView ? 'w-24 h-36' : 'w-12 h-16'}`}>
                <img
                src={review.avatar}
                alt={review.movieTitle}
                className="w-full h-full rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10 shadow-lg"
                />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-bold text-white group-hover:text-blue-500 transition-colors ${isFullView ? 'text-lg' : 'text-sm'}`}>
                  {review.movieTitle}
                </h3>
                <span className={`text-gray-500 font-bold whitespace-nowrap ${isFullView ? 'text-xs' : 'text-[10px]'}`}>
                  {review.date}
                </span>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fa-solid fa-star ${isFullView ? 'text-xs' : 'text-[10px]'} ${
                      i < review.rating ? 'text-yellow-500' : 'text-gray-700'
                    }`}
                  />
                ))}
              </div>

              <p className={`text-gray-400 leading-relaxed font-medium line-clamp-3 ${isFullView ? 'text-sm' : 'text-xs'}`}>
                "{review.content}"
              </p>
              
               {isFullView && (
                   <div className="mt-auto pt-4 flex items-center gap-4">
                       <button className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                            <i className="fa-regular fa-thumbs-up"></i> Helpful
                       </button>
                       <button className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
                            <i className="fa-regular fa-message"></i> Reply
                       </button>
                   </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {!isFullView && (
        <button 
          onClick={onViewAllClick}
          className="w-full mt-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <span>View all reviews</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      )}
    </div>
  );
};

export default UserComment;
