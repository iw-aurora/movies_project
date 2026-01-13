import { getImageUrl } from "../../lib/utils/image";

const Hero = ({ movie }) => {
  if (!movie) {
    return <div className="h-[700px] bg-black animate-pulse"></div>;
  }

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20"></div>
      </div>

      <div className="relative h-full flex items-center container mx-auto">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Original</span>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-widest italic flex items-center gap-1">
              <i className="fa-solid fa-star text-yellow-500"></i>
              {movie.vote_average?.toFixed(1)} Rating
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black mb-4 uppercase tracking-tighter leading-tight drop-shadow-2xl text-white">
            {movie.title || movie.name}
          </h1>

          <p className="text-lg text-gray-300 line-clamp-3 drop-shadow-md font-medium max-w-xl leading-relaxed">{movie.overview}</p>

          <div className="flex items-center gap-4 pt-4">
            <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 shadow-2xl active:scale-95 text-lg">
              <i className="fa-solid fa-play"></i>
              Xem ngay
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-3 border border-white/10 active:scale-95 text-lg">
              <i className="fa-solid fa-circle-info"></i>
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
