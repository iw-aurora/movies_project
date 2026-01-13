import sales from '../assets/images/sales.png';
import deal from '../assets/images/deal.png';
import Hero from '../components/home/Hero';
import MoviesRow from '../components/home/MoviesRow';
import FeatureRow from '../components/home/FeatureRow.jsx';
import Explore from '../components/home/Explore.jsx';
import { useHomeData } from '../hooks/useHomeData';

const Home = () => {
  const { heroMovie, sections, loading } = useHomeData();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main>
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <Hero movie={heroMovie} />

            <div className="container mx-auto pb-20">
              <MoviesRow title="Phim hot" movies={sections.hot} layout="BACKDROP" />
              <img src={sales} alt="Sales banner" className="w-full my-8" />
              <MoviesRow title="Top 5 phim hôm nay" movies={sections.top5} layout="BACKDROP" scrollable={false} />
              <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" />
              <MoviesRow title="Phim Tài liệu thiên nhiên" movies={sections.nature} layout="BACKDROP" />
              <MoviesRow title="Phim Hài truyền hình" movies={sections.comedy} layout="BACKDROP" />
              <MoviesRow title="Phim Hàn Quốc" movies={sections.korean} layout="BACKDROP" />
              <MoviesRow title="Phim Anime" movies={sections.anime} layout="POSTER" />
              <MoviesRow title="Phim Khoa học viễn tưởng" movies={sections.scifi} layout="BACKDROP" />
              <MoviesRow title="Phim Kinh dị" movies={sections.horror} layout="BACKDROP" />
              <FeatureRow title="TOP PHIM ĐẶC SẮC" movies={sections.topSpecial} />
              <img src={deal} alt="Deal banner" className="w-full my-8" />
              <Explore />
              <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
