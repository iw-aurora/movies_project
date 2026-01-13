import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent py-4 px-6 md:px-12 flex items-center">
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <i className="fa-solid fa-moon text-black text-xl"></i>
        </div>
        <span className="text-xl font-black tracking-tighter text-white uppercase italic">
          MOONPLAY
        </span>
      </Link>
    </nav>
  );
};

export default Navbar;
