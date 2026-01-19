import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MoviesCard from '../components/home/MoviesCard';
import { fetchPopularSeries, fetchSeriesByGenre } from '../lib/api/movies';
import { SERIES_GENRES } from '../lib/api/genres';
import { getImageUrl } from '../lib/utils/image';

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
  const [tempGenre, setTempGenre] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [series, setSeries] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadSeries = async (currentPage, genreId, isLoadMore = false) => {
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
        genreId === 'all' ? fetchPopularSeries(p) : fetchSeriesByGenre(genreId, p)
      );

      const results = await Promise.all(fetchBatch);
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
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadSeries(1, activeGenre, false);
  }, [activeGenre]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadSeries(nextPage, activeGenre, true);
  };

  const handleApplyFilter = () => {
    setActiveGenre(tempGenre);
    setIsModalOpen(false);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const activeGenreName =
    GENRE_LIST.find(g => g.id === activeGenre)?.name || 'Tất cả';

  return (
    <main className="min-h-screen pb-20 bg-[#111112] text-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              featuredSeries
                ? getImageUrl(featuredSeries.backdrop_path, 'original')
                : 'https://picsum.photos/seed/series/1920/1080'
            }
            alt={featuredSeries?.name || 'Featured'}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111112] via-[#111112]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-black/20" />
        </div>

        <div className="relative h-full flex items-center container mx-auto px-8">
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

            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
              {featuredSeries?.name || 'KHO PHIM BỘ ĐẶC SẮC'}
            </h1>

            <p className="text-lg text-gray-300 line-clamp-3 font-medium max-w-xl leading-relaxed">
              {featuredSeries?.overview ||
                'Tuyển tập những bộ phim truyền hình, phim bộ mới nhất và hay nhất từ khắp nơi trên thế giới.'}
            </p>

            {featuredSeries && (
              <div className="flex items-center gap-4 pt-4">
                <Link
                  to={`/watch/${featuredSeries.id}`}
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-3 shadow-2xl active:scale-95 text-lg"
                >
                  <i className="fa-solid fa-play"></i>
                  Xem ngay
                </Link>

                <Link
                  to={`/series/${featuredSeries.id}`}
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-3 border border-white/10 active:scale-95 text-lg"
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
      <section className="px-8 mt-12 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              KHO PHIM <span className="text-blue-500">BỘ MỚI NHẤT</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Cập nhật liên tục các tập phim mới nhất của những series đình đám.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Thể loại:</span>
            <span className="text-base font-bold text-blue-500">
              {activeGenreName}
            </span>
            <button
              onClick={() => {
                setTempGenre(activeGenre);
                setIsModalOpen(true);
              }}
              className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all"
            >
              <i className="fa-solid fa-sliders"></i>
              Chọn thể loại
            </button>
          </div>
        </div>

        {isLoading && series.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {series.map((item, index) => (
              <MoviesCard
                key={`${item.id}-${index}`}
                movie={item}
                layout="POSTER"
              />
            ))}
          </div>
        )}

        {page < totalPages && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="min-w-[200px] bg-zinc-900 hover:bg-zinc-800 text-white px-12 py-4 rounded-xl font-bold border border-white/5 transition-all"
            >
              {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
            </button>
          </div>
        )}
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95">
          <div className="w-full max-w-4xl bg-[#0f0f0f] rounded-3xl p-10 border border-white/10 shadow-2xl">
            <h3 className="text-4xl font-black mb-8 uppercase italic">
              Chọn <span className="text-blue-500">Thể loại</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
              {GENRE_LIST.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setTempGenre(genre.id)}
                  className={`p-6 rounded-2xl font-bold transition-all ${
                    tempGenre === genre.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-black border border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 text-gray-400 hover:text-white font-bold"
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

export default SeriesPage;
