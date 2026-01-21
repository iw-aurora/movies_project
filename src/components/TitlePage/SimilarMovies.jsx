import MoviesCard from '../../components/home/MoviesCard'; 
const SimilarMovies = ({ movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-4 md:py-16 max-w-7xl mx-auto px-6">
      <h3 className="text-sm md:text-xl font-bold tracking-widest text-gray-400 uppercase mb-4 md:mb-10 border-b border-white/10 pb-2 md:pb-4 inline-block">
        PHIM TƯƠNG TỰ
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-6">
        {movies.slice(0, 5).map((movie, idx) => (
          <div key={movie.id || idx} className={idx === 4 ? 'hidden md:block' : ''}>
            <MoviesCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarMovies;
