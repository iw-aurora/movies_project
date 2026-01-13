import bg from "../../assets/images/bg.png";
const Explore = () => {
  const categories = [
    {
      name: "Phim Chiếu rạp",
      bg: bg,
      overlay: "bg-red-500/10",
    },
    {
      name: "Phim Cổ trang",
      bg: bg,
      overlay: "bg-orange-500/10",
    },
    {
      name: "Phim Hành động",
      bg: bg,
      overlay: "bg-blue-500/10",
    },
  ];

  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-10">
        <span className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></span>
        <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Khám phá thể loại</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="relative h-56 overflow-hidden cursor-pointer group rounded-3xl border border-white/5 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.bg})` }}
            />

            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>

              {/* Glowing blobs */}
              <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-red-600/20 blur-[60px] rounded-full animate-pulse transition-opacity opacity-50 group-hover:opacity-100"></div>
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-600/20 blur-[70px] rounded-full transition-opacity opacity-50 group-hover:opacity-100"></div>

              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px]"></div>
              <div className={`absolute inset-0 ${cat.overlay}`}></div>
            </div>

            {/* Decorative Notch-like logic */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#050505] rounded-full group-hover:scale-110 transition-transform duration-500 z-30 ring-1 ring-white/10" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-[#050505] rounded-full group-hover:scale-110 transition-transform duration-500 z-30 ring-1 ring-white/10" />

            <div className="relative h-full w-full flex flex-col items-center justify-center z-10 px-6 text-center">
              <span className="text-2xl md:text-3xl font-black text-white tracking-tighter drop-shadow-2xl group-hover:tracking-widest transition-all duration-700 uppercase italic">
                {cat.name}
              </span>
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Tìm hiểu ngay
              </span>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
