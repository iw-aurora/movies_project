import { getAvatar } from '../../lib/utils/image';

const Cast = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <h3 className="text-xl font-bold tracking-widest text-gray-400 uppercase mb-10 border-b border-white/10 pb-4 inline-block">
        DIỄN VIÊN
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {cast.map((actor, idx) => (
          <div key={actor.id || idx} className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-white transition-all duration-300 group-hover:scale-105 shadow-xl">
              <img 
                src={getAvatar(actor.profile_path)} 
                alt={actor.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-white mb-1 group-hover:text-gray-400 transition-colors">{actor.name}</h4>
            <p className="text-xs text-gray-400 leading-tight">{actor.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cast;
