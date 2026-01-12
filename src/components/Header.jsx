import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


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
    { to: '/sale', label: 'Khuyến mãi' },
    { to: '/news', label: 'Tin tức' },
    { to: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
        isScrolled
          ? 'bg-gradient-to-b from-black via-black/70 to-white'
          : 'bg-gradient-to-r from-black/30 via-black/10 to-transparent'
      }`}
    >
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
             <i className="fa-solid fa-moon text-black text-xl"></i>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            MOONPLAY
          </span>
        </div>

    
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
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

    
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-all shadow-lg active:scale-95">
          Đăng nhập
        </button>
      </div>
    </header>
  );
};

export default Header;
