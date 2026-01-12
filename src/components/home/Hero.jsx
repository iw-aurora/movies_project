import { getImageUrl } from '../../service/Tmdb';

const Hero = ({ movie }) => {
  if (!movie) {
    return <div className="h-[700px] bg-black animate-pulse"></div>;
  }

  return (
    <div className="relative h-[700px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40"></div>
      </div>

    
      <div className="relative h-full flex items-center ">
        <div className="px-16 -translate-x-10 max-w-lg">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter leading-none drop-shadow-2xl text-white">
            {movie.title || movie.name}
          </h1>

          <p className="text-lg text-gray-200 mb-8 line-clamp-5 drop-shadow-md">
            {movie.overview}
          </p>

          <button className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <i className="fa-solid fa-play"></i>
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
