import { useState, useEffect } from "react";
import { useIntroduceData } from "../hooks/useIntroduceData";
import MoviesRow from "../components/home/MoviesRow";
import Explore from "../components/home/Explore";
import deal from "../assets/images/deal.png";
import { MoviesRowSkeleton } from "../components/skeleton/Skeletons";

import { MIN_LOADING_TIME } from "../config/config";

const Introduce = () => {
  const { sections, loading: dataLoading } = useIntroduceData();
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  const loading = dataLoading || minLoading;

  if (loading || !sections) {
    return (
      <div className="min-h-screen bg-[#111112] px-4">
        <section className="max-w-7xl mx-auto pt-32 mb-16 space-y-4">
          <div className="w-64 h-12 animate-shimmer rounded-lg"></div>
          <div className="w-full h-32 animate-shimmer rounded-xl"></div>
        </section>
        <div className="space-y-20 pb-20">
          <section className="container mx-auto">
            <MoviesRowSkeleton layout="BACKDROP" />
            <MoviesRowSkeleton layout="POSTER" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111112] text-zinc-100">
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-32 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic">Về MoonPlay</h1>
          </div>

          <p className="text-zinc-400 text-xl font-medium leading-relaxed text-justify max-w-4xl">
            Chào mừng bạn đến với <span className="text-white font-bold italic">MoonPlay</span> – nơi bạn có thể khám phá thế giới điện ảnh đầy cảm
            xúc và chiều sâu. Từ những bộ phim bom tấn cho đến các tác phẩm nghệ thuật độc lập, MoonPlay mang đến trải nghiệm xem phim tinh tế, trực
            quan và dễ tiếp cận cho mọi đối tượng yêu điện ảnh.
          </p>
        </section>

        <div className="space-y-20 pb-20">
          <section className="container mx-auto">
            <MoviesRow title="Top 5 phim hôm nay" movies={sections.top5} layout="BACKDROP" scrollable={false} />
          </section>

          <section className="max-w-7xl mx-auto px-6">
            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="text-zinc-300 text-lg font-medium leading-relaxed text-justify">
                MoonPlay là nền tảng xem phim trực tuyến được thiết kế tối giản nhưng hiệu quả, giúp người dùng dễ dàng tìm kiếm và tận hưởng những bộ
                phim yêu thích. Với hệ thống phân loại rõ ràng, giao diện thân thiện và khả năng gợi ý thông minh, MoonPlay mang đến trải nghiệm xem
                phim mượt mượt và liền mạch.
              </p>
            </div>
          </section>

          <section className="container mx-auto">
            <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" />
          </section>

          <section className="max-w-7xl mx-auto px-6">
            <div className="bg-blue-600/10 p-10 rounded-3xl border border-blue-500/20 backdrop-blur-sm">
              <p className="text-zinc-300 text-lg font-medium leading-relaxed text-justify">
                Không chỉ tập trung vào những tác phẩm nổi tiếng, MoonPlay còn giới thiệu các bộ phim độc đáo đến từ nhiều quốc gia và nền văn hoá
                khác nhau. Bạn có thể khám phá phim nghệ thuật, phim tài liệu, phim độc lập và những câu chuyện điện ảnh mang đậm dấu ấn cá nhân của
                các nhà làm phim.
              </p>
            </div>
          </section>

          <div className="w-full relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-transparent"></div>
            <img
              src={deal}
              alt="Deal banner"
              className="w-full object-cover max-h-[500px] transition-transform duration-1000 group-hover:scale-110"
            />
          </div>

          <section className="container mx-auto">
            <Explore />
          </section>

          <section className="container mx-auto">
            <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Introduce;
