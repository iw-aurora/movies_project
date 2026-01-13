import React, { useState } from "react";
import { getImageUrl } from "../../lib/utils/image";

const TrailerSection = ({ trailers, poster_path }) => {
  // Chỉ lấy tối đa 3 trailer YouTube
  let trailerList = trailers.filter(t => t.site === "YouTube" && t.type === "Trailer");

  // Lấp đầy nếu < 3
  while (trailerList.length < 3) {
    if (trailerList.length > 0) {
      trailerList.push(trailerList[0]);
    } else {
      trailerList.push({
        key: null,
        title: "No Trailer",
        thumbnailUrl: getImageUrl(poster_path, "w500"),
      });
    }
  }

  const [selectedIdx, setSelectedIdx] = useState(null); // index ô đang chơi video

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <h3 className="text-xl font-bold tracking-widest text-gray-400 uppercase mb-10 border-b border-white/10 pb-4 inline-block">
        TRAILER
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trailerList.map((trailer, idx) => {
          const isSelected = selectedIdx === idx && trailer.key;

          return (
            <div
              key={idx}
              className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-2xl"
              onClick={() => trailer.key && setSelectedIdx(idx)}
            >
              {isSelected ? (
                // render iframe nếu ô đang chọn
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  allowFullScreen
                  title={trailer.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                // render thumbnail nếu chưa chọn
                <>
                  <img
                    src={trailer.key ? `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg` : trailer.thumbnailUrl}
                    alt={trailer.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      HD
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-sm font-bold text-white uppercase tracking-wider">TRAILER</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrailerSection;
