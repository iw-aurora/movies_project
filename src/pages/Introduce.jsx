import { useIntroduceData } from '../hooks/useIntroduceData';
import MoviesRow from '../components/home/MoviesRow';
import deal from '../assets/images/deal.png';

const Introduce = () => {
  const { sections, loading } = useIntroduceData();

  if (loading || !sections) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505]">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 font-semibold tracking-widest uppercase animate-pulse">
          Đang tải MoonPlay...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main>

        <section className="max-w-7xl mx-auto px-6 pt-32">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            MoonPlay
          </h1>

          <p className="text-zinc-600 text-lg font-medium leading-loose text-justify">
            Chào mừng bạn đến với MoonPlay – nơi bạn có thể khám phá thế giới điện ảnh
            đầy cảm xúc và chiều sâu. Từ những bộ phim bom tấn cho đến các tác phẩm
            nghệ thuật độc lập, MoonPlay mang đến trải nghiệm xem phim tinh tế,
            trực quan và dễ tiếp cận cho mọi đối tượng yêu điện ảnh.
          </p>
        </section>

        <MoviesRow title="Top 5 phim hôm nay" movies={sections.top5} layout="BACKDROP" scrollable={false} />

        <p className="text-zinc-600 text-lg my-10 font-medium leading-loose text-justify max-w-7xl mx-auto px-6">
          MoonPlay là nền tảng xem phim trực tuyến được thiết kế tối giản nhưng hiệu quả,
          giúp người dùng dễ dàng tìm kiếm và tận hưởng những bộ phim yêu thích.
          Với hệ thống phân loại rõ ràng, giao diện thân thiện và khả năng gợi ý thông minh,
          MoonPlay mang đến trải nghiệm xem phim mượt mà và liền mạch.
        </p>

        <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" />

        <p className="text-zinc-600 text-lg my-10 font-medium leading-loose text-justify max-w-7xl mx-auto px-6">
          Không chỉ tập trung vào những tác phẩm nổi tiếng, MoonPlay còn giới thiệu
          các bộ phim độc đáo đến từ nhiều quốc gia và nền văn hoá khác nhau.
          Bạn có thể khám phá phim nghệ thuật, phim tài liệu, phim độc lập
          và những câu chuyện điện ảnh mang đậm dấu ấn cá nhân của các nhà làm phim.
        </p>

        <img src={deal} alt="Deal banner" className="w-full my-8" />

        <p className="text-zinc-600 text-lg my-10 font-medium leading-loose text-justify max-w-7xl mx-auto px-6">
          Hãy bắt đầu hành trình khám phá thế giới điện ảnh cùng MoonPlay ngay hôm nay.
          Đắm chìm trong những câu chuyện giàu cảm xúc, tìm thấy nguồn cảm hứng mới
          và tận hưởng những khoảnh khắc thư giãn trọn vẹn sau mỗi bộ phim.
        </p>

        <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" />

      </main>
    </div>
  );
};

export default Introduce;
