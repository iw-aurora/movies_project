import { getAvatar } from '../../lib/utils/image';

const Cast = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="py-8 md:py-16 max-w-7xl mx-auto px-6">
      <h3 className="text-sm md:text-xl font-bold tracking-widest text-gray-400 uppercase mb-4 md:mb-10 border-b border-white/10 pb-2 md:pb-4 inline-block">
        DIỄN VIÊN
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-8">
        {cast.map((actor, idx) => (
          <div key={actor.id || idx} className={`flex flex-col items-center text-center group cursor-pointer ${idx === 5 ? 'md:hidden' : ''}`}>
            <div className="w-14 h-14 md:w-32 md:h-32 rounded-full overflow-hidden mb-2 md:mb-4 border border-white/10 group-hover:border-white transition-all duration-300 group-hover:scale-105 shadow-xl">
              <img 
                src={getAvatar(actor.profile_path)} 
                alt={actor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-white text-[9px] md:text-base mb-0.5 md:mb-1 group-hover:text-gray-400 transition-colors line-clamp-1">{actor.name}</h4>
            <p className="text-[8px] md:text-xs text-gray-400 leading-tight line-clamp-1">{actor.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cast;
