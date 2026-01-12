import { getImageUrl } from '../../service/Tmdb';

const MoviesCard = ({ movie, layout = 'POSTER' }) => {
  const isPoster = layout === 'POSTER';
  
  return (
    <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 z-0 hover:z-10">
      <div className={`overflow-hidden rounded-md bg-zinc-900 shadow-md ${isPoster ? 'aspect-[2/3]' : 'aspect-video'}`}>
        <img 
          src={isPoster ? getImageUrl(movie.poster_path) : getImageUrl(movie.backdrop_path)} 
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
          loading="lazy"
        />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="text-sm font-bold text-white line-clamp-1">{movie.title || movie.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-yellow-400 font-bold">
            <i className="fa-solid fa-star mr-1"></i>
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-300 uppercase px-1 border border-gray-500 rounded">HD</span>
        </div>
      </div>
    </div>
  );
};

export default MoviesCard;
