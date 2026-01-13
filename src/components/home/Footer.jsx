import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 py-16 px-6 border-t border-zinc-800 max-h-92">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <i className="fa-solid fa-moon text-black text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              MOONPLAY
            </span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Moon Play là dịch vụ được cung cấp bởi Công ty Cổ Phần Moon Play,
            thành viên của Công ty Cổ Phần Giải Trí và Giáo Dục Moon
          </p>
        </div>

        <div className="col-span-1">
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
            Giới thiệu
          </h4>
          <ul className="text-gray-400 space-y-4 text-sm">
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
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
            Hỗ trợ
          </h4>

          <ul className="text-gray-400 space-y-4 text-sm">
            <li className="font-bold text-white">0843601796</li>

            <li>Hoặc kết nối qua:</li>

            <li>
                <div className="col-span-1 flex flex-col justify-end">
                    <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
                         Kết nối với chúng tôi
                    </h4>
                </div>
              <div className="flex gap-4 pt-2">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <i className="fa-brands fa-tiktok"></i>
                </a>
              </div>
            </li>
          </ul>
        </div>


        
      </div>

    
      <div className="container mx-auto mt-10 border-t border-zinc-800 pt-6 text-center text-gray-500 text-xs">
        © 2024 MOONPLAY. Developed with TMDB API. All content is for demonstration purposes.
        </div>

    </footer>
  );
};

export default Footer;
