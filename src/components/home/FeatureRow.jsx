import { getImageUrl } from '../../service/Tmdb';

const FeatureRow = ({ title, movies }) => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 border-l-4 border-blue-600 pl-3">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6">
        {movies.slice(0, 5).map((movie, index) => (
          <div key={movie.id} className="relative group cursor-pointer">
            
        
            <div
                className="absolute -left-4 -top-8 text-[200px] font-black leading-none
                            select-none pointer-events-none z-10 italic text-white/20"
                style={{
                    WebkitTextStroke: '2px rgba(255,255,255,0.9)',
                }}
                >
                {index + 1}
            </div>


        
            <div className="relative overflow-hidden rounded-xl aspect-[2/3]
                            shadow-2xl transition-transform duration-300
                            group-hover:scale-105 z-0">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-bold text-white uppercase leading-tight">
                  {movie.title || movie.name}
                </h3>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureRow;
