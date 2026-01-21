import React from "react";
import { Clock, Star, Share2, Check, Play } from "lucide-react";
import { getPoster, getBackdrop } from "../../lib/utils/image";
import { Link } from "react-router-dom";

const Info = ({ movie }) => {
  if (!movie) return null;

  const backdropUrl = getBackdrop(movie.backdrop_path, "original");
  const posterUrl = getPoster(movie.poster_path, "w500");
  const vietnameseTitle = movie.title;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const duration = movie.runtime ? `${movie.runtime} phút` : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const genres = movie.genres?.map((g) => g.name) || [];
  const country = movie.production_countries?.map((c) => c.name).join(", ") || "";
  const releaseDate = movie.release_date || "";
  const synopsis = movie.overview || "";

  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-[#111112]/80 to-[#111112]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111112] via-[#111112]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#111112] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-24 pb-8 md:pt-32 md:pb-12 flex flex-col lg:flex-row items-center lg:items-end gap-6 md:gap-12">
        {/* Poster + Action */}
        <div className="flex-shrink-0 w-32 md:w-80 lg:w-96 group">
          <div className="relative overflow-hidden rounded-xl md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-[1.02] transition-all duration-700">
            <img src={posterUrl} alt={vietnameseTitle} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl md:rounded-3xl" />
          </div>

          <Link to={`/watch/${movie.id}`} className="w-full mt-3 md:mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black py-2 md:py-5 rounded-lg md:rounded-2xl flex items-center justify-center space-x-1.5 md:space-x-3 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] active:scale-95 group/btn overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            <Play fill="currentColor" size={14} className="relative z-10 md:w-7 md:h-7" />
            <span className="text-xs md:text-xl uppercase tracking-widest relative z-10">Xem ngay</span>
          </Link>
        </div>

        {/* Info Content */}
        <div className="flex-grow pb-8 md:pb-12 space-y-3 md:space-y-8 text-white text-center lg:text-left">
          <div className="space-y-1 md:space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="bg-blue-600 px-1.5 py-0.5 md:px-3 md:py-1 rounded text-[6px] md:text-[10px] font-black uppercase tracking-widest">Cinema</span>
              <span className="text-blue-400 font-black text-[10px] md:text-lg">{year}</span>
            </div>

            <h1 className="text-base md:text-5xl lg:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight">
              {vietnameseTitle}
            </h1>

            <p className="text-[10px] md:text-2xl text-zinc-400 font-bold tracking-tight opacity-70 italic">{movie.original_title || vietnameseTitle}</p>

          </div>

          {/* Stats Bar */}
          {/* Stats Bar */}
          <div className="grid grid-cols-4 items-center gap-1.5 md:gap-8 w-full md:w-auto mt-2 md:mt-0">
            
            {/* Duration */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 md:gap-3 bg-white/5 md:bg-transparent px-1 py-1.5 md:p-0 rounded-lg md:rounded-none border border-white/10 md:border-none h-full">
              <div className="md:p-3 md:bg-white/5 md:rounded-2xl md:border md:border-white/10 flex items-center justify-center shrink-0">
                <Clock size={10} className="text-blue-400 md:w-[22px] md:h-[22px]" />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="hidden md:block text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-0.5">Thời lượng</span>
                <span className="text-[10px] md:text-lg font-black tracking-tight leading-none whitespace-nowrap">{duration.replace(' phút', 'p')}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 md:gap-3 bg-white/5 md:bg-transparent px-1 py-1.5 md:p-0 rounded-lg md:rounded-none border border-white/10 md:border-none h-full">
              <div className="md:p-3 md:bg-white/5 md:rounded-2xl md:border md:border-white/10 flex items-center justify-center shrink-0">
                <Star size={10} className="text-yellow-500 fill-yellow-500 md:w-[22px] md:h-[22px]" />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="hidden md:block text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-0.5">Đánh giá</span>
                <span className="text-[10px] md:text-lg font-black leading-none whitespace-nowrap">{rating}</span>
              </div>
            </div>

            {/* Share */}
            <button className="flex items-center justify-center w-full h-full p-1.5 md:p-4 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-2xl transition-all border border-white/10 text-zinc-300 hover:text-white group">
                <Share2 size={12} className="group-hover:scale-110 transition-transform md:w-[24px] md:h-[24px]" />
            </button>

            {/* Watched */}
            <button className="flex items-center justify-center gap-1 md:gap-3 px-1 py-1.5 md:px-6 md:py-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg md:rounded-2xl transition-all border border-green-500/20 font-black tracking-widest text-[8px] md:text-xs h-full whitespace-nowrap">
                <Check size={10} className="md:w-[20px] md:h-[20px]" />
                <span className="md:inline">ĐÃ XEM</span>
            </button>
          </div>

          {/* Genres Section */}
          <div className="flex flex-nowrap overflow-x-auto md:flex-wrap justify-center md:justify-start gap-1.5 md:gap-3 max-w-full pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
             {/* Note: scrollbar-hide class needs to be defined in CSS or use inline styles, 
                 but standard overflow-x-auto works. Added whitespace-nowrap and shrink-0 */}
            {genres.map((genre) => (
              <span
                key={genre}
                className="whitespace-nowrap shrink-0 px-2 py-1 md:px-6 md:py-2 bg-zinc-800/50 hover:bg-blue-600 border border-white/5 hover:border-blue-500 rounded-md md:rounded-xl text-[8px] md:text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                {genre.replace(/^Phim\s+/i, '')}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 md:gap-10 max-w-2xl border-t border-white/5 pt-4 md:pt-8 text-left md:text-left">
            <div className="flex flex-col gap-0.5 md:gap-1 pl-4 md:pl-0 border-l md:border-l-0 border-white/5">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Đạo diễn</span>
              <span className="text-xs md:text-xl font-black text-white italic tracking-tighter uppercase">{movie.director}</span>
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1 pl-4 md:pl-0 border-l md:border-l-0 border-white/5">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Quốc gia</span>
              <span className="text-xs md:text-xl font-black text-white italic tracking-tighter uppercase">{country}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="max-w-4xl pt-2 md:pt-4 text-center lg:text-left space-y-2 md:space-y-4">
            <h3 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[9px] md:text-[11px] flex items-center justify-center lg:justify-start gap-3">
              <span className="w-6 h-[1.5px] md:w-10 md:h-[2px] bg-blue-600 rounded-full"></span>
              Tóm tắt nội dung
            </h3>
            <p className="text-zinc-400 leading-relaxed md:leading-loose text-[13px] md:text-xl font-medium italic opacity-90">{synopsis}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Info;