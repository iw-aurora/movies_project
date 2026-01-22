import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { logout } from "../../firebase/AuthService";
import Swal from 'sweetalert2';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useAuth();

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
      className={`fixed top-0 left-0 right-0 z-[70] transition-all px-4 md:px-8 py-3.5 flex items-center justify-between ${
        isMobileMenuOpen 
          ? "bg-black border-b border-white/5 duration-0" 
          : isScrolled 
            ? "bg-black/80 backdrop-blur-lg border-b border-white/10 duration-500" 
            : "bg-gradient-to-b from-black/90 via-black/40 to-transparent duration-500"
      }`}
    >
      <div className="flex items-center gap-4 lg:gap-12 relative z-50">
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="lg:hidden text-white text-2xl w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl active:scale-95 transition-all duration-300"
          >
             <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark rotate-90' : 'fa-bars'} transition-transform duration-500`}></i>
          </button>
          
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-xl rotate-3 group-hover:rotate-12 transition-transform flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <i className="fa-solid fa-moon text-black text-xl md:text-2xl"></i>
            </div>
            <span className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase italic">
              MOON<span className="text-blue-500">PLAY</span>
            </span>
          </Link>
        </div>

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

      <div className="flex items-center gap-6 relative z-50">

        {/* show login link when no user, otherwise show avatar + logout */}
        {(() => {
          // Hooks lifted to top level
          const handleLogout = async () => {
            const result = await Swal.fire({
              title: 'Bạn có chắc chắn muốn đăng xuất không?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Đăng xuất',
              cancelButtonText: 'Hủy',
              reverseButtons: true,
            });
            if (!result.isConfirmed) return;
            try {
              await logout();
              await Swal.fire({ title: 'Đã đăng xuất', icon: 'success', timer: 1200, showConfirmButton: false });
              navigate('/', { replace: true });
            } catch (err) {
              console.error('Logout error', err);
              Swal.fire({ title: 'Lỗi', text: 'Đăng xuất thất bại', icon: 'error' });
            }
          };

          const isAdmin = role === 'admin' || user?.email === 'admin@gmail.com';

          const AvatarContent = () => (
            <>
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">{(user.displayName || user.email || 'U')[0].toUpperCase()}</div>
              )}
            </>
          );

          return user ? (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Link to="/admin" className="cursor-pointer hover:opacity-80 transition-opacity" title="Go to Admin Dashboard">
                  <AvatarContent />
                </Link>
              ) : (
                 <Link to="/user" className="cursor-default">
                   <AvatarContent />
                 </Link>
              )}
              
              <button 
                onClick={handleLogout} 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 flex items-center justify-center transition-all active:scale-95 group"
                title="Đăng xuất"
              >
                <i className="fa-solid fa-right-from-bracket text-lg group-hover:translate-x-0.5 transition-transform"></i>
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="bg-white text-black px-2 py-1 md:px-6 md:py-2.5 rounded-full text-[9px] md:text-sm font-bold hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              Đăng nhập
            </Link>
          );
        })()}
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-[60] lg:hidden ${
          isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop - Simple fade without blur for performance */}
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Menu Content - Forced solid black background */}
        <div 
          style={{ backgroundColor: '#000000', opacity: 1 }}
          className={`absolute top-0 left-0 bottom-0 w-[280px] border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="py-3.5 px-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg rotate-3 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <i className="fa-solid fa-moon text-black text-lg"></i>
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                MOON<span className="text-blue-500">PLAY</span>
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white active:scale-95 transition-all"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="flex flex-col gap-1 pt-2 px-4 pb-4 overflow-y-auto">
            {navLinks.map((link) => {
              const getIcon = (label) => {
                switch(label) {
                  case 'Trang chủ': return 'fa-house';
                  case 'Giới thiệu': return 'fa-circle-info';
                  case 'Kho phim': return 'fa-clapperboard';
                  case 'Phim điện ảnh': return 'fa-film';
                  case 'Phim bộ': return 'fa-tv';
                  case 'Liên hệ': return 'fa-envelope';
                  default: return 'fa-link';
                }
              };

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all ${
                      isActive 
                        ? "bg-blue-600/10 text-blue-500 font-bold" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                   <i className={`fa-solid ${getIcon(link.label)} w-5 text-center text-sm`}></i>
                   <span className="text-[15px] tracking-wide">{link.label}</span>
                </NavLink>
              );
            })}
          </div>


        </div>
      </div>

    </header>
  );
};

export default Header;
