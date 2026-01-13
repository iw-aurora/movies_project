import React from "react";
import { Clock, Star, Share2, Check, Play } from "lucide-react";
import { getPoster, getBackdrop } from "../../lib/utils/image";

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
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-12 flex flex-col lg:flex-row items-center lg:items-end gap-12">
        {/* Poster + Action */}
        <div className="flex-shrink-0 w-64 md:w-80 lg:w-96 group">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-[1.02] transition-all duration-700">
            <img src={posterUrl} alt={vietnameseTitle} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl" />
          </div>

          <button className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] active:scale-95 group/btn overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            <Play fill="currentColor" size={28} className="relative z-10" />
            <span className="text-xl uppercase tracking-widest relative z-10">Xem phim ngay</span>
          </button>
        </div>

        {/* Info Content */}
        <div className="flex-grow pb-12 space-y-8 text-white text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="bg-blue-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Cinema</span>
              <span className="text-blue-400 font-black text-lg">{year}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight">
              {vietnameseTitle}
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 font-bold tracking-tight opacity-70 italic">{movie.original_title || vietnameseTitle}</p>

          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-zinc-300">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Clock size={22} className="text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Thời lượng</span>
                <span className="text-lg font-black tracking-tight">{duration}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Star size={22} className="text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Đánh giá</span>
                <span className="text-lg font-black">
                  {rating} <span className="text-zinc-500 text-xs">/ 10</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:ml-6">
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-zinc-300 hover:text-white group">
                <Share2 size={24} className="group-hover:scale-110 transition-transform" />
              </button>
              <button className="flex items-center gap-3 px-6 py-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-2xl transition-all border border-green-500/20 font-black tracking-widest text-xs">
                <Check size={20} />
                ĐÃ XEM
              </button>
            </div>
          </div>

          {/* Genres Section */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-6 py-2 bg-zinc-800/50 hover:bg-blue-600 border border-white/5 hover:border-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl border-t border-white/5 pt-8">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Đạo diễn</span>
              <span className="text-xl font-black text-white italic tracking-tighter uppercase">{movie.director}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Quốc gia</span>
              <span className="text-xl font-black text-white italic tracking-tighter uppercase">{country}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="max-w-4xl pt-4 text-center lg:text-left space-y-4">
            <h3 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center lg:justify-start gap-3">
              <span className="w-10 h-[2px] bg-blue-600 rounded-full"></span>
              Tóm tắt nội dung
            </h3>
            <p className="text-zinc-400 leading-loose text-lg md:text-xl font-medium italic opacity-90">{synopsis}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Info;
