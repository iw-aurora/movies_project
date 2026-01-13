import { useRef } from 'react';
import MovieCard from './MoviesCard';

const MoviesRow = ({
  title,
  movies = [],
  layout = 'POSTER',
  scrollable = true,
}) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (!rowRef.current) return;

    const { scrollLeft, clientWidth } = rowRef.current;
    rowRef.current.scrollTo({
      left:
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-6">
    
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 border-l-4 border-blue-600 pl-3">
          {title}
        </h2>
      </div>

      {!scrollable ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} layout={layout} />
          ))}
        </div>
      ) : (
        
        <div className="relative group/row">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
                       bg-black/60 hover:bg-black/80 text-white
                       w-12 h-full
                       opacity-0 group-hover/row:opacity-100
                       transition-opacity"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div
            ref={rowRef}
            className="flex gap-4 px-6 pb-4 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={
                  layout === 'POSTER'
                    ? 'min-w-[180px]'
                    : 'min-w-[320px]'
                }
              >
                <MovieCard movie={movie} layout={layout} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20
                       bg-black/60 hover:bg-black/80 text-white
                       w-12 h-full
                       opacity-0 group-hover/row:opacity-100
                       transition-opacity"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default MoviesRow;
