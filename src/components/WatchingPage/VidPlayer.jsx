import { useState } from 'react';
import { Play } from 'lucide-react';

const VidPlayer = ({ trailerUrl, movie, backdropUrl }) => {
  const [isStarted, setIsStarted] = useState(false);

  if (!movie) return null;

  return (
    <div className="relative group aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-blue-500/20">
      {!isStarted ? (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsStarted(true)}
        >
          {/* Backdrop Image */}
          <img
            src={backdropUrl || "https://images.unsplash.com/photo-1489599849909-33c4e652c2a9?q=80&w=2670&auto=format&fit=crop"}
            alt="Backdrop"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 grayscale group-hover:grayscale-0"
          />

          {/* Play Overlay Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:bg-blue-500 group-hover:shadow-blue-500/60"
            >
              <Play fill="white" className="text-white ml-1" size={36} />
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
            <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">
              Now Playing
            </span>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              {movie.title || movie.name}
            </h2>
          </div>
        </div>
      ) : (
        <iframe
          src={`${
            trailerUrl || 'https://www.youtube.com/embed/AQsZqe4HW-8'
          }?autoplay=1&rel=0&modestbranding=1`}
          title="MoonPlay Video Player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] rounded-3xl" />
    </div>
  );
};

export default VidPlayer;
