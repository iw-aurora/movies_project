import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import MoviesCard from '../components/home/MoviesCard';
import { HeroSkeleton, MovieCardSkeleton } from '../components/skeleton/Skeletons';
import { fetchPopularSeries, fetchSeriesByGenre } from '../lib/api/movies';
import { SERIES_GENRES } from '../lib/api/genres';
import { getImageUrl } from '../lib/utils/image';
import { MIN_LOADING_TIME } from '../config/config';

const GENRE_LIST = [
  { id: 'all', name: 'Tất cả' },
  { id: SERIES_GENRES.ACTION_ADVENTURE, name: 'Hành động & Phiêu lưu' },
  { id: SERIES_GENRES.ANIMATION, name: 'Hoạt hình' },
  { id: SERIES_GENRES.COMEDY, name: 'Hài hước' },
  { id: SERIES_GENRES.DRAMA, name: 'Tâm lý' },
  { id: SERIES_GENRES.SCI_FI_FANTASY, name: 'Viễn tưởng' },
  { id: SERIES_GENRES.MYSTERY, name: 'Bí ẩn' },
];

const SeriesPage = () => {
  const [activeGenre, setActiveGenre] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [series, setSeries] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [minLoading, setMinLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  const loadSeries = async (currentPage, genreId, isLoadMore = false) => {
    try {
      if (isLoadMore) setIsLoadingMore(true);
      else {
        setSeries([]); // Clear series to show skeleton
        setDataLoading(true);
      }

      // Fetch 3 pages at once to get 60 items (guarantees full rows for 2, 3, 4, 5, 6 columns)
      const pagesToFetch = [
        (currentPage - 1) * 3 + 1,
        (currentPage - 1) * 3 + 2,
        (currentPage - 1) * 3 + 3
      ];

      const fetchBatch = pagesToFetch.map(p => 
        genreId === 'all' ? fetchPopularSeries(p) : fetchSeriesByGenre(genreId, p)
      );

      const promises = [Promise.all(fetchBatch)];

      // Enforce minimum loading time of 250ms for better UX
      if (!isLoadMore) {
        promises.push(new Promise(resolve => setTimeout(resolve, 250)));
      }

      const [results] = await Promise.all(promises);
      const newSeriesList = results.flatMap(res => res?.success ? res.data.results : []);

      if (results[0]?.success && results[0]?.data) {
        setTotalPages(Math.floor(results[0].data.total_pages / 3));

        if (isLoadMore) {
          setSeries(prev => [...prev, ...newSeriesList]);
        } else {
          setSeries(newSeriesList);
          if (newSeriesList.length > 0) {
            setFeaturedSeries(newSeriesList[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch series:', error);
    } finally {
      setDataLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadSeries(1, activeGenre, false);
  }, [activeGenre]);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = dataLoading || minLoading;

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadSeries(nextPage, activeGenre, true);
  };

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setIsDropdownOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const activeGenreName =
    GENRE_LIST.find(g => g.id === activeGenre)?.name || 'Tất cả';

  // Only show full page skeleton on initial load
  if (isLoading && !featuredSeries && series.length === 0) {
    return (
      <main className="min-h-screen pb-20 bg-[#111112] text-white">
        <HeroSkeleton />
        <section className="px-8 mt-12 container mx-auto">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="space-y-4">
                     <div className="h-10 w-64 bg-zinc-800 rounded-lg animate-pulse"></div>
                     <div className="h-4 w-96 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-48 bg-zinc-800 rounded-xl animate-pulse"></div>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <MovieCardSkeleton key={i} layout="POSTER" />
              ))}
           </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 bg-[#111112] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[95vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              featuredSeries
                ? getImageUrl(featuredSeries.backdrop_path, 'original')
                : 'https://picsum.photos/seed/series/1920/1080'
            }
            alt={featuredSeries?.name || 'Featured'}
            className="w-full h-full object-cover object-[center_10%] md:object-center scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111112] via-[#111112]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-black/20" />
        </div>

        <div className="relative h-full flex items-center container mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                PHIM BỘ
              </span>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-widest italic flex items-center gap-1">
                <i className="fa-solid fa-star text-yellow-500"></i>
                {featuredSeries?.vote_average?.toFixed(1) || 'N/A'} Rating
              </span>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-widest italic border-l border-white/20 pl-3">
                {featuredSeries?.first_air_date?.split('-')[0] || '2024'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
              {featuredSeries?.name || 'KHO PHIM BỘ ĐẶC SẮC'}
            </h1>

            <p className="text-sm md:text-lg text-gray-300 line-clamp-2 md:line-clamp-3 font-medium max-w-xl leading-relaxed">
              {featuredSeries?.overview ||
                'Tuyển tập những bộ phim truyền hình, phim bộ mới nhất và hay nhất từ khắp nơi trên thế giới.'}
            </p>

            {featuredSeries && (
              <div className="flex items-center gap-4 pt-4">
                <Link
                  to={`/watch/${featuredSeries.id}`}
                  className="bg-white text-black px-4 py-2 md:px-8 md:py-4 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 md:gap-3 shadow-2xl active:scale-95 text-xs md:text-lg"
                >
                  <i className="fa-solid fa-play"></i>
                  Xem ngay
                </Link>

                <Link
                  to={`/series/${featuredSeries.id}`}
                  className="bg-white/10 backdrop-blur-md text-white px-4 py-2 md:px-8 md:py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 md:gap-3 border border-white/10 active:scale-95 text-xs md:text-lg"
                >
                  <i className="fa-solid fa-circle-info"></i>
                  Chi tiết
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter & Listing */}
      <section className="px-2 md:px-8 mt-6 md:mt-12 container mx-auto">
        <div className="flex flex-col gap-6 mb-12">
          {/* Title Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
              KHO PHIM <span className="text-blue-500">BỘ MỚI NHẤT</span>
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Cập nhật liên tục các tập phim mới nhất của những series đình đám.
            </p>
          </div>

          {/* Filter Section */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-white/[0.02] border border-white/5 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs md:text-sm text-gray-400 font-normal">Thể loại:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <i className="fa-solid fa-tv text-blue-500 text-sm"></i>
                <span className="text-sm md:text-base font-semibold text-blue-500">{activeGenreName}</span>
              </div>
              {activeGenre !== 'all' && (
                <button
                  onClick={() => {
                    setActiveGenre('all');
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <i className="fa-solid fa-xmark"></i>
                  Xóa bộ lọc
                </button>
              )}
            </div>
            
            <div className="relative z-40 w-fit self-start" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white text-black px-2.5 md:px-5 h-[30px] md:h-[44px] rounded-lg font-semibold text-[10px] md:text-xs uppercase tracking-wide flex items-center justify-center gap-2 md:gap-2.5 hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-md"
              >
                <i className="fa-solid fa-sliders"></i>
                <span className="hidden sm:inline">Chọn thể loại</span>
                <span className="sm:hidden">Bộ lọc</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu - Native Absolute (No Portal) */}
              {isDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-[#0f0f0f] border border-white/10 rounded-lg shadow-2xl z-[45] overflow-hidden animate-in fade-in zoom-in duration-200"
                  >
                    <div className="p-1.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {GENRE_LIST.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => handleGenreChange(genre.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-md transition-all text-sm font-medium flex items-center justify-between mb-0.5 last:mb-0 ${
                            activeGenre === genre.id
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>{genre.name}</span>
                          {activeGenre === genre.id && (
                            <i className="fa-solid fa-check text-xs"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {isLoading && series.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={`skeleton-${i}`} layout="POSTER" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {series.map((item, index) => (
              <MoviesCard
                key={`${item.id}-${index}`}
                movie={item}
                layout="POSTER"
              />
            ))}
          </div>
        )}


        {/* Load More Skeletons */}
        {isLoadingMore && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={`loading-${i}`} layout="POSTER" />
            ))}
          </div>
        )}

        {page < totalPages && !isLoadingMore && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="min-w-[200px] bg-zinc-900 hover:bg-zinc-800 text-white px-12 py-4 rounded-xl font-bold border border-white/5 transition-all active:scale-95"
            >
              Xem thêm
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default SeriesPage;
