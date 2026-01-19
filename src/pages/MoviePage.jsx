import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoviesCard from '../components/home/MoviesCard';
import { fetchPopularMovies, fetchByGenre } from '../lib/api/movies';
import { GENRES } from '../lib/api/genres';
import { getBackdrop, getImageUrl } from '../lib/utils/image';

const GENRE_LIST = [
  { id: 'all', name: 'Tất cả' },
  { id: GENRES.ACTION, name: 'Hành động' },
  { id: GENRES.HORROR, name: 'Kinh dị' },
  { id: GENRES.ANIMATION, name: 'Hoạt hình' },
  { id: GENRES.COMEDY, name: 'Hài hước' },
  { id: GENRES.DRAMA, name: 'Tâm lý' },
  { id: GENRES.SCI_FI, name: 'Khoa học viễn tưởng' },
];

const MoviePage = () => {
  const [activeGenre, setActiveGenre] = useState('all');
  const [tempGenre, setTempGenre] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMovies = async (currentPage, genreId, isLoadMore = false) => {
    try {
      if (isLoadMore) setIsLoadingMore(true);
      else setIsLoading(true);

      // Fetch 3 pages at once to get 60 items (guarantees full rows for 2, 3, 4, 5, 6 columns)
      const pagesToFetch = [
        (currentPage - 1) * 3 + 1,
        (currentPage - 1) * 3 + 2,
        (currentPage - 1) * 3 + 3
      ];

      const fetchBatch = pagesToFetch.map(p => 
        genreId === 'all' ? fetchPopularMovies(p) : fetchByGenre(genreId, p)
      );

      const results = await Promise.all(fetchBatch);
      const newMovies = results.flatMap(res => res.success ? res.data.results : []);
      
      if (results[0].success && results[0].data) {
        setTotalPages(Math.floor(results[0].data.total_pages / 3));
        
        if (isLoadMore) {
          setMovies(prev => [...prev, ...newMovies]);
        } else {
          setMovies(newMovies);
          if (newMovies.length > 0) {
            setFeaturedMovie(newMovies[0]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch or when genre changes
  useEffect(() => {
    setPage(1);
    loadMovies(1, activeGenre, false);
  }, [activeGenre]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage, activeGenre, true);
  };

  const handleApplyFilter = () => {
    setActiveGenre(tempGenre);
    setIsModalOpen(false);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const activeGenreName = GENRE_LIST.find(g => g.id === activeGenre)?.name || 'Tất cả';

  return (
    <main className="min-h-screen pb-20 bg-[#111112] text-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredMovie ? getImageUrl(featuredMovie.backdrop_path, 'original') : "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
            alt={featuredMovie ? (featuredMovie.title || featuredMovie.name) : "Featured Movie"}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-black/20"></div>
        </div>

        <div className="relative h-full flex items-center container mx-auto">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">PHIM LẺ</span>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-widest italic flex items-center gap-1">
                <i className="fa-solid fa-star text-yellow-500"></i>
                {featuredMovie?.vote_average?.toFixed(1) || '8.5'} Rating
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-4 uppercase tracking-tighter leading-tight drop-shadow-2xl text-white">
              {featuredMovie ? (featuredMovie.title || featuredMovie.name) : 'KHO PHIM ĐIỆN ẢNH'}
            </h1>

            <p className="text-lg text-gray-300 line-clamp-3 drop-shadow-md font-medium max-w-xl leading-relaxed">
              {featuredMovie?.overview || 'Khám phá kho phim lẻ, phim chiếu rạp mới nhất được cập nhật mỗi ngày với chất lượng cao và phụ đề tiếng Việt.'}
            </p>

            <div className="flex items-center gap-4 pt-4">
              {featuredMovie && (
                <>
                  <Link 
                    to={`/watch/${featuredMovie.id}`} 
                    className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 shadow-2xl active:scale-95 text-lg"
                  >
                    <i className="fa-solid fa-play"></i>
                    Xem ngay
                  </Link>
                  <Link 
                    to={`/title/${featuredMovie.id}`} 
                    className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-3 border border-white/10 active:scale-95 text-lg"
                  >
                    <i className="fa-solid fa-circle-info"></i>
                    Chi tiết
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Listing */}
      <section className="px-8 mt-12 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              KHO PHIM <span className="text-blue-500">ĐIỆN ẢNH</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Danh sách phim lẻ, phim chiếu rạp mới nhất được cập nhật mỗi ngày.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Thể loại:</span>
            <span className="text-base font-bold text-blue-500">{activeGenreName}</span>
            <button
              onClick={() => {
                setTempGenre(activeGenre);
                setIsModalOpen(true);
              }}
              className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all"
            >
              <i className="fa-solid fa-sliders"></i>
              Chọn thể loại
              {activeGenre !== 'all' && (
                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Movie Grid */}
        {isLoading && movies.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
             <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie, index) => (
              <MoviesCard 
                key={`${movie.id}-${index}`}
                movie={movie}
                layout="POSTER"
              />
            ))}
          </div>
        )}

        {!isLoading && movies.length === 0 && (
          <div className="py-32 text-center text-gray-500 italic">
            Không tìm thấy phim phù hợp với bộ lọc này.
          </div>
        )}

        {page < totalPages && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`min-w-[200px] bg-zinc-900 hover:bg-zinc-800 text-white px-12 py-4 rounded-xl font-bold border border-white/5 transition-all flex items-center justify-center gap-3 ${
                isLoadingMore ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              {isLoadingMore ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Đang tải...
                </>
              ) : (
                'Xem Thêm'
              )}
            </button>
          </div>
        )}

        {!isLoading && page >= totalPages && movies.length > 0 && (
          <div className="mt-16 text-center text-gray-600 text-sm font-medium uppercase tracking-widest">
            — Bạn đã xem hết danh sách —
          </div>
        )}
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95">
          <div className="w-full max-w-4xl bg-[#0f0f0f] rounded-3xl p-10 border border-white/10">
            <h3 className="text-4xl font-black mb-8 uppercase italic">
              Chọn <span className="text-blue-500">Thể loại</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
              {GENRE_LIST.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setTempGenre(genre.id)}
                  className={`p-6 rounded-2xl font-bold transition-all ${
                    tempGenre === genre.id
                      ? "bg-blue-600 text-white"
                      : "bg-black border border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 text-gray-400 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyFilter}
                className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MoviePage;
