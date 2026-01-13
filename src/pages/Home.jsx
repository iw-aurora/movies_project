import sales from "../assets/images/sales.png";
import deal from "../assets/images/deal.png";
import Hero from "../components/home/Hero";
import MoviesRow from "../components/home/MoviesRow";
import FeatureRow from "../components/home/FeatureRow.jsx";
import Explore from "../components/home/Explore.jsx";
import { useHomeData } from "../hooks/useHomeData";

import { useState, useEffect } from "react";
import { HeroSkeleton, MoviesRowSkeleton, FeatureRowSkeleton } from "../components/skeleton/Skeletons";

import { MIN_LOADING_TIME } from "../config/config";

const Home = () => {
  const { heroMovie, sections, loading: dataLoading } = useHomeData();
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  const loading = dataLoading || minLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111112]">
        <HeroSkeleton />
        <div className="space-y-8 pb-20 pt-10 px-4">
          <section className="container mx-auto">
            <MoviesRowSkeleton layout="BACKDROP" />
          </section>
          <div className="w-full h-[300px] md:h-[400px] animate-shimmer rounded-xl"></div>
          <section className="container mx-auto">
            <MoviesRowSkeleton layout="BACKDROP" />
            <MoviesRowSkeleton layout="POSTER" />
          </section>
          <section className="bg-zinc-900/40 py-16">
            <div className="container mx-auto">
              <FeatureRowSkeleton />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111112] text-zinc-100 overflow-x-hidden">
      <main>
        <Hero movie={heroMovie} />

        <div className="space-y-8 pb-20 pt-10">
          <section className="container mx-auto">
            <MoviesRow title="🔥 Phim hot tuần này" movies={sections.hot} layout="BACKDROP" />
          </section>

          <div className="w-full relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
            <img
              src={sales}
              alt="Sales banner"
              className="w-full object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <section className="container mx-auto">
            <MoviesRow title="Top 5 phim hôm nay" movies={sections.top5} layout="BACKDROP" scrollable={false} />
            <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" />
            <MoviesRow title="Hành tinh xanh" movies={sections.nature} layout="BACKDROP" />
          </section>

          <section className="container mx-auto">
            <MoviesRow title="Phim Hài truyền hình" movies={sections.comedy} layout="BACKDROP" />
            <MoviesRow title="Điện ảnh Hàn Quốc" movies={sections.korean} layout="BACKDROP" />
            <MoviesRow title="Thế giới Anime" movies={sections.anime} layout="POSTER" />
          </section>

          <section className="bg-zinc-900/40 py-16">
            <div className="container mx-auto">
              <FeatureRow title="TOP PHIM ĐẶC SẮC" movies={sections.topSpecial} />
            </div>
          </section>

          <div className="w-full relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            <img
              src={deal}
              alt="Deal banner"
              className="w-full object-cover max-h-[500px] transition-transform duration-1000 group-hover:scale-110"
            />
          </div>

          <section className="container mx-auto">
            <Explore />
            <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
