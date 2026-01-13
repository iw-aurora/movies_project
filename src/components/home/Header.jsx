import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/introduce", label: "Giới thiệu" },
    { to: "/store", label: "Kho phim" },
    { to: "/movie", label: "Phim điện ảnh" },
    { to: "/series", label: "Phim bộ" },
    { to: "/contact", label: "Liên hệ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-4 flex items-center justify-between ${
        isScrolled ? "bg-black/80 backdrop-blur-lg border-b border-white/10" : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"
      }`}
    >
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-11 h-11 bg-white rounded-xl rotate-3 group-hover:rotate-12 transition-transform flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <i className="fa-solid fa-moon text-black text-2xl"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            MOON<span className="text-blue-500">PLAY</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-all duration-300 relative group ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <button className="hidden sm:block text-gray-400 hover:text-white transition-colors text-lg">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <Link
          to="/auth/login"
          className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95"
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  );
};

export default Header;
