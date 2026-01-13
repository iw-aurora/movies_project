import { getImageUrl } from "../../lib/utils/image";

const FeatureRow = ({ title, movies }) => {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-10">
        <span className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></span>
        <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">{title}</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-12">
        {movies.slice(0, 5).map((movie, index) => (
          <div key={movie.id} className="relative group cursor-pointer pt-6 w-64">
            <div
              className="absolute left-0 -top-6 text-[120px] font-black leading-none
                            select-none pointer-events-none z-10 italic text-white/5 group-hover:text-blue-500/20 transition-colors duration-500"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              }}
            >
              {index + 1}
            </div>

            <div
              className="relative overflow-hidden rounded-2xl aspect-[2/3]
                            shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500
                            group-hover:scale-105 group-hover:-translate-y-2 z-0 group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] border border-white/5 group-hover:border-blue-500/30"
            >
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-70"></div>

              <div className="absolute bottom-5 left-5 right-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500 text-xs font-black flex items-center gap-1">
                    <i className="fa-solid fa-star text-[10px]"></i>
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold">{movie.release_date?.slice(0, 4) || "2024"}</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase leading-none tracking-tighter drop-shadow-2xl mb-2">
                  {movie.title || movie.name}
                </h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase py-0.5 px-2 bg-blue-600/10 rounded border border-blue-500/20">
                    Đặc Sắc
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureRow;
