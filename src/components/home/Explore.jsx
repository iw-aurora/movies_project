import bg from '../../image/bg.png'
const Explore = () => {
  const categories = [
    { 
      name: 'Phim Chiếu rạp', 
      bg: bg, 
      overlay: 'bg-red-500/10' 
    },
    { 
      name: 'Phim Cổ trang', 
      bg: bg, 
      overlay: 'bg-orange-500/10' 
    },
    { 
      name: 'Phim Hành động', 
      bg: bg, 
      overlay: 'bg-blue-500/10' 
    },
  ];

  return (
    <div className="py-10 px-6">
      <h2 className="text-sm font-bold mb-6 text-gray-500 uppercase tracking-widest">Khám phá</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            className="relative h-46 overflow-hidden cursor-pointer group "
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cat.bg})` }}
            />

            <div className="absolute inset-0">
              
              <div className="absolute inset-0 bg-black/50"></div> 

            
              <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-red-600/30 blur-3xl rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-blue-600/30 blur-3xl rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-yellow-600/30 blur-2xl rounded-full"></div>

            
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

              
              <div className={`absolute inset-0 ${cat.overlay}`}></div>
            </div>

            
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
             w-10 h-10 bg-white rounded-full z-30"
            />

            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
             w-10 h-10 bg-white rounded-full z-30"
            />


            
            <div className="relative h-full w-full flex items-center justify-center z-10">
               <span className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:tracking-wider transition-all duration-500">
                 {cat.name}
               </span>
            </div>
            
    
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
