import MoviesCard from '../../components/home/MoviesCard'; 
const SimilarMovies = ({ movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <h3 className="text-xl font-bold tracking-widest text-gray-400 uppercase mb-10 border-b border-white/10 pb-4 inline-block">
        PHIM TƯƠNG TỰ
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
        {movies.map((movie, idx) => (
          <MoviesCard key={movie.id || idx} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default SimilarMovies;
