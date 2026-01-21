import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#131315] py-8 md:py-16 px-6 border-t border-white/[0.08]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fa-solid fa-moon text-black text-lg md:text-xl"></i>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
              MOONPLAY
            </span>
          </div>

          <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xs">
            Moon Play là dịch vụ phim trực tuyến chất lượng cao, mang đến trải nghiệm điện ảnh tuyệt vời nhất cho bạn.
          </p>
        </div>

        <div className="col-span-1">
          <h4 className="text-white font-bold mb-4 md:mb-6 uppercase tracking-wider text-[11px] md:text-sm">
            Giới thiệu
          </h4>
          <ul className="text-gray-500 space-y-3 md:space-y-4 text-xs md:text-sm">
            <li>
              <Link to="#" className="hover:text-white transition-colors">
                Quy chế sử dụng dịch vụ
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition-colors">
                Khuyến mãi
              </Link>
            </li>
          </ul>
        </div>

        
        <div className="col-span-1">
          <h4 className="text-white font-bold mb-4 md:mb-6 uppercase tracking-wider text-[11px] md:text-sm">
            Hỗ trợ & Kết nối
          </h4>

          <ul className="text-gray-500 space-y-3 md:space-y-4 text-xs md:text-sm">
            <li className="font-bold text-white text-sm md:text-base">0843601796</li>
            <li className="text-[10px] md:text-xs">Email: support@moonplay.com</li>

            <li className="pt-2">
              <div className="flex gap-3 md:gap-4">
                {[
                  { icon: 'facebook-f', link: '#' },
                  { icon: 'instagram', link: '#' },
                  { icon: 'youtube', link: '#' },
                  { icon: 'tiktok', link: '#' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all text-sm"
                  >
                    <i className={`fa-brands fa-${item.icon}`}></i>
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>


        
      </div>

    
      <div className="container mx-auto mt-6 md:mt-10 border-t border-white/5 pt-4 md:pt-6 text-center text-gray-600 text-[10px] md:text-xs">
        <p className="opacity-60 italic">© 2026 MOONPLAY. Designed for Premium Cinema Experience.</p>
        <p className="mt-1 opacity-40">Developed with TMDB API. All content is for demonstration purposes.</p>
      </div>

    </footer>
  );
};

export default Footer;
