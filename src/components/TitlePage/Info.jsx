import React from 'react';
import { Clock, Star, Share2, Check, Play } from 'lucide-react';
import { getPoster, getBackdrop } from '../../lib/utils/image';

const Info = ({ movie }) => {
  if (!movie) return null;

  const backdropUrl = getBackdrop(movie.backdrop_path, 'original');
  const posterUrl = getPoster(movie.poster_path, 'w500');
  const vietnameseTitle = movie.title;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const duration = movie.runtime ? `${movie.runtime} phút` : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const genres = movie.genres?.map(g => g.name) || [];
  const country = movie.production_countries?.map(c => c.name).join(', ') || '';
  const releaseDate = movie.release_date || '';
  const synopsis = movie.overview || '';

  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b111b] via-[#0b111b]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b111b] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-12 flex flex-col md:flex-row items-start md:items-end gap-10">
        {/* Poster + Button */}
        <div className="flex-shrink-0 w-64 md:w-80 group">
          <div className="relative overflow-hidden rounded-lg shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300">
            <img src={posterUrl} alt={vietnameseTitle} className="w-full h-auto object-cover" />
          </div>
          <button className="w-full mt-6 bg-[#e50914] hover:bg-[#b2070f] text-white font-bold py-4 rounded flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95">
            <Play fill="currentColor" size={24} />
            <span className="text-xl uppercase tracking-wider">Xem phim</span>
          </button>
        </div>

        {/* Movie Info */}
        <div className="flex-grow pb-8 space-y-6 text-white">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-bold text-shadow-md">{vietnameseTitle}</h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">
              {movie.original_title || vietnameseTitle} ({year})
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 text-gray-200">
            <div className="flex items-center space-x-2">
              <Clock size={24} className="text-yellow-500" />
              <span className="text-lg font-medium">{duration}</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-yellow-500 text-black px-1 rounded font-bold text-xs">IMDb</div>
              <span className="text-lg font-bold">{rating}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-white transition-colors">
                <Share2 size={20} />
                <span>Chia sẻ</span>
              </button>
              <button className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors">
                <Check size={20} />
                <span>Đã xem</span>
              </button>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-6 py-1 border border-white/40 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-lg max-w-md pt-4">
            <div className="flex">
              <span className="text-gray-400 w-24">Đạo diễn</span>
              <span className="font-semibold">{movie.director}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-24">Quốc gia</span>
              <span className="font-semibold">{country}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-24">Khởi chiếu</span>
              <span className="font-semibold">{releaseDate}</span>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-gray-300 leading-relaxed text-lg max-w-3xl border-l-4 border-red-600 pl-6 py-2 bg-gradient-to-r from-red-600/5 to-transparent">
            {synopsis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
