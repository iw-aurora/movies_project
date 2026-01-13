import { useRef, useEffect } from "react";

import MovieCard from "./MoviesCard";

const MoviesRow = ({ title, movies = [], layout = "POSTER", scrollable = true }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (!rowRef.current) return;

    const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;

    if (direction === "right" && scrollLeft + clientWidth >= scrollWidth - 1) {
      rowRef.current.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    rowRef.current.scrollTo({
      left: direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!scrollable) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollable]);

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
          <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
          {title}
        </h2>
        {scrollable && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white active:scale-95"
            >
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </div>
        )}
      </div>

      {!scrollable ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} layout={layout} />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div ref={rowRef} className="flex gap-6 pb-10 overflow-x-auto no-scrollbar scroll-smooth">
            {movies.map((movie) => (
              <div key={movie.id} className={layout === "POSTER" ? "min-w-[200px]" : "min-w-[340px]"}>
                <MovieCard movie={movie} layout={layout} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MoviesRow;
