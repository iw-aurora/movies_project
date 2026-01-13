import { getImageUrl } from "../../lib/utils/image";
import { formatRating } from "../../lib/utils/format";
import { Link } from "react-router-dom";

const MoviesCard = ({ movie, layout = "POSTER" }) => {
  const isPoster = layout === "POSTER";

  return (
    <Link to={`/title/${movie.id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 shadow-xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        <div className={isPoster ? "aspect-[2/3]" : "aspect-video"}>
          <img
            src={isPoster ? getImageUrl(movie.poster_path) : getImageUrl(movie.backdrop_path)}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Play Icon Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-500">
            <i className="fa-solid fa-play text-white text-xl ml-1"></i>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] text-white font-black uppercase px-2 py-0.5 bg-blue-600/80 backdrop-blur-md rounded-md border border-white/10">
            HD
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 px-1">
        <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
          {movie.title || movie.name}
        </h3>

        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-3">
            <span className="text-yellow-500 flex items-center gap-1">
              <i className="fa-solid fa-star text-[9px]"></i>
              {formatRating(movie.vote_average)}
            </span>
            <span className="text-zinc-500">{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "2024"}</span>
          </div>
          <span className="text-zinc-500 uppercase tracking-widest">
            {movie.runtime ? `${movie.runtime}m` : movie.media_type === "tv" ? "Series" : "2h 15m"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MoviesCard;
