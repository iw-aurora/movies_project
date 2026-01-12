import { useEffect, useState } from 'react';
import sales from '../assets/images/sales.png';
import deal from '../assets/images/deal.png'
import { 
  fetchTrending, 
  fetchPopularMovies, 
  fetchByGenre, 
  fetchByRegion, 
  fetchAnime,
  fetchFeaturedMovies,
  fetchUpcoming 
} from '../lib/api/movies.js';

import { GENRES } from '../lib/api/genres.js';
import Header from '../components/Header.jsx';
import Hero from '../components/home/Hero';
import MoviesRow from '../components/home/MoviesRow';
import Footer from '../components/Footer.jsx';
import FeatureRow from '../components/home/FeatureRow.jsx';
import Explore from '../components/home/Explore.jsx';

const Home = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [sections, setSections] = useState({
    hot: [],
    top5: [],
    featured: [],
    nature: [],
    comedy: [],
    korean: [],
    anime: [],
    scifi: [],
    horror:[],
    topSpecial:[],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
            trendingRes,
            popularRes,
            featuredRes,
            natureRes,
            comedyRes,
            koreanRes,
            animeRes,
            scifiRes,
            horrorRes,
            upcomingRes
            ] = await Promise.all([
            fetchTrending(),
            fetchPopularMovies(),
            fetchFeaturedMovies(),
            fetchByGenre(GENRES.DOCUMENTARY),
            fetchByGenre(GENRES.COMEDY),
            fetchByRegion(GENRES.KOREAN),
            fetchAnime(),
            fetchByGenre(GENRES.SCI_FI),
            fetchByGenre(GENRES.HORROR),
            fetchUpcoming()
            ]);

            const trending = trendingRes.success ? trendingRes.data : { results: [] };
            const popular = popularRes.success ? popularRes.data : { results: [] };
            const featured = featuredRes.success ? featuredRes.data : { results: [] };
            const nature = natureRes.success ? natureRes.data : { results: [] };
            const comedy = comedyRes.success ? comedyRes.data : { results: [] };
            const korean = koreanRes.success ? koreanRes.data : { results: [] };
            const anime = animeRes.success ? animeRes.data : { results: [] };
            const scifi = scifiRes.success ? scifiRes.data : { results: [] };
            const horror = horrorRes.success ? horrorRes.data : { results: [] };
            const upcoming = upcomingRes.success ? upcomingRes.data : { results: [] };


        if (trending?.results?.length > 0) {
          const randomIndex = Math.floor(Math.random() * trending.results.length);
          setHeroMovie(trending.results[randomIndex]);
        }

        setSections({
          hot: trending?.results?.slice(0, 10) || [],
          top5: popular?.results?.slice(0, 5) || [],
          featured: featured?.results?.slice(0, 10) || [],
          topSpecial: popular?.results?.slice(0, 3) || [],
          nature: nature?.results || [],
          comedy: comedy?.results || [],
          korean: korean?.results || [],
          anime: anime?.results || [],
          scifi: scifi?.results || [],
          horror: horror?.results || [],
          upcoming: upcoming?.results?.slice(0, 10) || [],
        });

      } catch (error) {
        console.error('Error loading movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />

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
              <img src={sales} alt="Sales banner" className="w-full my-8"/>
              <MoviesRow title="Top 5 phim hôm nay" movies={sections.top5} layout="BACKDROP" scrollable={false}/>
              <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" />
              <MoviesRow title="Phim Tài liệu thiên nhiên" movies={sections.nature} layout="BACKDROP" />
              <MoviesRow title="Phim Hài truyền hình" movies={sections.comedy} layout="BACKDROP" />
              <MoviesRow title="Phim Hàn Quốc" movies={sections.korean} layout="BACKDROP" />
              <MoviesRow title="Phim Anime" movies={sections.anime} layout="POSTER" />
              <MoviesRow title="Phim Khoa học viễn tưởng" movies={sections.scifi} layout="BACKDROP" />
              <MoviesRow title="Phim Kinh dị" movies={sections.horror} layout="BACKDROP"/>
              <FeatureRow title="TOP PHIM ĐẶC SẮC" movies={sections.topSpecial}/>
              <img src={deal} alt="Deal banner" className="w-full my-8"/>
              <Explore/>
              <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP"/>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
