import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MoviesCard from '../components/home/MoviesCard';
import { searchMovies, discoverMovies } from '../lib/api/movies';
import { GENRES } from '../lib/api/genres';

const GENRE_LIST = [
  { id: 'all', name: 'Tất cả' },
  { id: GENRES.ACTION, name: 'Hành động' },
  { id: GENRES.HORROR, name: 'Kinh dị' },
  { id: GENRES.SCI_FI, name: 'Viễn tưởng' },
  { id: GENRES.ROMANCE, name: 'Lãng mạn' },
  { id: GENRES.ANIMATION, name: 'Hoạt hình' },
  { id: GENRES.COMEDY, name: 'Hài hước' },
  { id: GENRES.DRAMA, name: 'Kịch tính' },
  { id: GENRES.ADVENTURE, name: 'Phiêu lưu' },
  { id: GENRES.DOCUMENTARY, name: 'Tài liệu' },
  { id: GENRES.FAMILY, name: 'Gia đình' },
  { id: GENRES.MUSIC, name: 'Âm nhạc' },
];

const SORTS = [
  { label: "Mới nhất", value: "newest", icon: "fa-clock" },
  { label: "Đánh giá cao", value: "rating", icon: "fa-star" },
  { label: "Năm sản xuất", value: "year", icon: "fa-calendar-days" },
];

const StorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tempCategory, setTempCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]); // Stores ONLY current page movies
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedCategory, sortBy]);

  // Main Data Fetching Effect
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      
      try {
        // We fetch 3 pages from TMDB (20 * 3 = 60 items) to ensure the grid is full
        // for most screen sizes (divisible by 2, 3, 4, 5, 6)
        const PAGES_TO_LOAD = 3;
        const apiStartPage = (currentPage - 1) * PAGES_TO_LOAD + 1;
        const promises = [];

        for (let i = 0; i < PAGES_TO_LOAD; i++) {
            const pageToFetch = apiStartPage + i;
            
            // 1. Search Mode
            if (debouncedQuery) {
                promises.push(searchMovies(debouncedQuery, pageToFetch));
            } 
            // 2. Discover Mode
            else {
                let apiSortBy = 'popularity.desc';
                if (sortBy === 'newest') apiSortBy = 'primary_release_date.desc';
                if (sortBy === 'rating') apiSortBy = 'vote_average.desc';
                if (sortBy === 'year') apiSortBy = 'primary_release_date.desc';

                promises.push(discoverMovies({
                    page: pageToFetch,
                    genreId: selectedCategory,
                    sortBy: apiSortBy
                }));
            }
        }

        const responses = await Promise.all(promises);
        
        let allResults = [];
        let maxApiPages = 0;

        responses.forEach(response => {
            if (response.success && response.data) {
                allResults = [...allResults, ...(response.data.results || [])];
                maxApiPages = Math.max(maxApiPages, response.data.total_pages || 0);
            }
        });

        // Remove duplicates if any (rare but valid)
        const uniqueMovies = Array.from(new Map(allResults.map(m => [m.id, m])).values());

        setMovies(uniqueMovies);
        
        // Recalculate total UI pages (since 1 UI page = 3 API pages)
        // Cap at 500 API pages -> ~166 UI pages
        const realTotalPages = Math.ceil(Math.min(maxApiPages, 500) / PAGES_TO_LOAD);
        setTotalPages(realTotalPages || 1);

      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [debouncedQuery, selectedCategory, sortBy, currentPage]);

  const handleApplyFilter = () => {
    setSelectedCategory(tempCategory);
    setIsModalOpen(false);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const selectedCategoryName = GENRE_LIST.find(g => g.id === selectedCategory)?.name || 'Tất cả';

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen pt-20 bg-[#111112] text-white">
      {/* HERO */}
      <div className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-black/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px]"
          alt="Banner"
        />
        <div className="relative z-20 text-center space-y-4 px-6">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase">
            THE <span className="text-blue-500">STORE</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-blue-500"></span>
            <p className="text-gray-300 font-medium tracking-[0.2em] uppercase text-xs md:text-sm">
              Khám phá thế giới điện ảnh vô tận
            </p>
            <span className="h-px w-12 bg-blue-500"></span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-30">
        {/* TOOLBAR */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-grow w-full group">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              placeholder="Tìm kiếm phim, series, diễn viên..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/10 flex-grow md:flex-grow-0">
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    sortBy === s.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <i className={`fa-solid ${s.icon}`}></i>
                  <span className="hidden lg:inline">{s.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setTempCategory(selectedCategory);
                setIsModalOpen(true);
              }}
              className="bg-white text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3"
            >
              <i className="fa-solid fa-sliders"></i>
              Thể loại
              {selectedCategory !== 'all' && (
                <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        {/* RESULT */}
        <div className="mt-12 mb-8 flex items-end justify-between px-2">
          <div>
            <h2 className="text-2xl font-black uppercase italic">
              <span className="text-blue-500">{debouncedQuery ? `Kết quả tìm kiếm: "${debouncedQuery}"` : `# ${selectedCategoryName}`}</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
               Trang {currentPage}/{totalPages}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
            <p className="text-gray-400 text-sm">Đang tải phim...</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <MoviesCard key={movie.id} movie={movie} layout="POSTER" />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 mb-8 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                  </button>

                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-600">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] h-10 px-3 rounded-lg font-bold text-sm transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="fa-solid fa-chevron-right text-sm"></i>
                  </button>
                </div>

                {/* Quick jump */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Đi đến trang:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center text-gray-500 italic">
            Không có kết quả phù hợp
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95">
          <div className="w-full max-w-4xl bg-[#0f0f0f] rounded-3xl p-10">
            <h3 className="text-4xl font-black mb-8 uppercase italic">
              Lọc <span className="text-blue-500">Thể loại</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
              {GENRE_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTempCategory(cat.id)}
                  className={`p-6 rounded-2xl font-bold ${
                    tempCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-black border border-white/10 text-gray-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 text-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyFilter}
                className="px-10 py-4 bg-white text-black font-black rounded-2xl"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;
