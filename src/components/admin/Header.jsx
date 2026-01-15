import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { logout } from "../../firebase/AuthService";
import Swal from "sweetalert2";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await logout();
      await Swal.fire({
        title: "Đã đăng xuất",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error", err);
      Swal.fire({
        title: "Lỗi",
        text: "Đăng xuất thất bại",
        icon: "error",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        grid grid-cols-3 items-center px-8 py-4
        ${
          isScrolled
            ? "bg-black/80 backdrop-blur-lg border-b border-white/10"
            : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"
        }`}
    >
      {/* LEFT – LOGO */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-white rounded-xl rotate-3 group-hover:rotate-12 transition-transform flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <i className="fa-solid fa-moon text-black text-2xl"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
            MOON<span className="text-blue-500">PLAY</span>
          </span>
        </Link>
      </div>

      {/* CENTER – MENU */}
      <div className="flex justify-center">
        <Link
          to="/admin"
          className="relative text-sm font-semibold tracking-wide text-gray-300 hover:text-white transition group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Tài khoản
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      {/* RIGHT – USER */}
      <div className="flex justify-end items-center gap-4">
        {user && (
          <>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-white">
                {(user.displayName || "U")[0]}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold
                         hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
