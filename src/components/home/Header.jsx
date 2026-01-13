import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/introduce', label: 'Giới thiệu' },
    { to: '/store', label: 'Kho phim' },
    { to: '/movie', label: 'Phim điện ảnh' },
    { to: '/series', label: 'Phim bộ' },
    { to: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
        isScrolled
          ? 'bg-linear-to-b from-black via-black/70 to-white'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-white/90t'
      }`}
    >
      <div className="flex items-center gap-10">
        
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
             <i className="fa-solid fa-moon text-black text-xl"></i>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            MOONPLAY
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-gray-300 hover:text-white transition-colors">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <Link to='/auth/login' className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-all shadow-lg active:scale-95">
          Đăng nhập
        </Link>
      </div>
    </header>
  );
};

export default Header;
