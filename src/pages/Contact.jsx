import { useState, useEffect } from 'react';
import { useHomeData } from '../hooks/useHomeData';
import { getImageUrl } from '../lib/utils/image';
import Swal from 'sweetalert2';
import { useAuth } from '../Context/AuthContext';
import { sendFeedback } from '../firebase/FeedbackService';
import sales from "../assets/images/sales.png";
import deal from "../assets/images/deal.png";
import { Link } from 'react-router-dom';
import MoviesCard from '../components/home/MoviesCard';
import MoviesRow from '../components/home/MoviesRow';
import { MoviesRowSkeleton } from '../components/skeleton/Skeletons';
import { MIN_LOADING_TIME } from '../config/config';

const Contact = () => {
  const { user } = useAuth();
  const { sections, loading: dataLoading } = useHomeData();
  const [formData, setFormData] = useState({ 
    name: user?.displayName || '', 
    message: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [minLoading, setMinLoading] = useState(true);
  
  const loading = dataLoading || minLoading;

  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  // Sync user name when auth state changes
  useEffect(() => {
    if (user?.displayName) {
      setFormData(prev => ({ ...prev, name: user.displayName }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
        Swal.fire('Opps!', 'Vui lòng điền đầy đủ thông tin nha!', 'warning');
        return;
    }

    setSubmitting(true);
    try {
      const feedbackData = {
        name: formData.name,
        message: formData.message,
        userId: user?.uid || 'guest',
        userEmail: user?.email || 'anonymous',
        type: 'contact_page'
      };

      const result = await sendFeedback(feedbackData);
      
      if (result.success) {
        Swal.fire({
            title: 'Thành công!',
            text: 'Cảm ơn bạn đã góp ý. Chúng tôi sẽ ghi nhận!',
            icon: 'success',
            confirmButtonColor: '#3b82f6'
        });
        setFormData({ name: user?.displayName || '', message: '' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      Swal.fire('Lỗi', 'Không thể gửi phản hồi lúc này. Thử lại sau nhé!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return (
        <div className="pt-20 min-h-screen bg-[#111112] text-zinc-100 overflow-x-hidden">
             <section className="px-[5px] md:px-20 py-12 container mx-auto text-center space-y-4">
                  <div className="h-10 w-48 bg-zinc-800 rounded-lg animate-pulse mx-auto"></div>
                  <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse mx-auto"></div>
             </section>

             <div className="container mx-auto px-4">
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl h-[400px] animate-pulse mb-6"></div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                       {[1,2,3].map(i => <div key={i} className="h-24 md:h-32 bg-zinc-800 rounded-xl animate-pulse"></div>)}
                  </div>
             </div>

             <section className="container mx-auto pb-10 px-4">
                 <MoviesRowSkeleton layout="BACKDROP" />
             </section>
        </div>
     );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#111112] text-zinc-100 overflow-x-hidden no-scrollbar">
      {/* Introduction Section */}
      <section className="px-6 md:px-20 py-10 container mx-auto">
        <div className="mb-0 animate-fade-in text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-gradient">
            MoonPlay
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-xs md:text-sm font-medium">
            Chúng tôi luôn lắng nghe ý kiến của bạn để hoàn thiện MoonPlay mỗi ngày.
            Hãy để lại góp ý bên dưới nhé.
          </p>
        </div>

        {/* Contact Form & Socials */}
        <div className="container mx-auto">
           <div className="bg-zinc-900/40 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl mb-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></span>
                <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">
                  Gửi Phản Hồi
                </h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Tên của bạn..."
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/80 transition-all placeholder:text-zinc-600 font-medium text-white shadow-inner"
                    />
                </div>
                
                <div className="space-y-1.5">
                     <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nội dung</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Góp ý hoặc báo lỗi tại đây..."
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/80 transition-all placeholder:text-zinc-600 font-medium resize-none text-white shadow-inner"
                    />
                </div>
                <button 
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:from-blue-500 hover:to-blue-400 active:scale-[0.97] transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {submitting ? (
                      <><i className="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...</>
                  ) : (
                      <><i className="fa-solid fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i> Gửi ngay</>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
              <div className="bg-zinc-900/40 border border-white/5 p-1.5 md:p-3 rounded-xl md:rounded-2xl text-center group hover:bg-zinc-800/60 transition-all">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-clock text-blue-500 text-[10px] md:text-sm"></i>
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-white uppercase italic tracking-tighter">Support 24/7</p>
              </div>
              
              <div className="bg-zinc-900/40 border border-white/5 p-1.5 md:p-3 rounded-xl md:rounded-2xl text-center group hover:bg-zinc-800/60 transition-all">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-users text-green-500 text-[10px] md:text-sm"></i>
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-white uppercase italic tracking-tighter">10K+ Users</p>
              </div>
              
              <div className="bg-zinc-900/40 border border-white/5 p-1.5 md:p-3 rounded-xl md:rounded-2xl text-center group hover:bg-zinc-800/60 transition-all">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-film text-purple-500 text-[10px] md:text-sm"></i>
                </div>
                <p className="text-[8px] md:text-[10px] font-black text-white uppercase italic tracking-tighter">50K+ Movies</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {[
                { icon: 'facebook-f', label: 'FB', color: 'blue', link: '#' },
                { icon: 'instagram', label: 'IG', color: 'pink', link: '#' },
                { icon: 'youtube', label: 'YT', color: 'red', link: '#' },
                { icon: 'tiktok', label: 'TK', color: 'zinc', link: '#' },
              ].map((item, i) => (
                <a key={i} href={item.link} className="flex items-center justify-center gap-1 md:gap-2 group cursor-pointer bg-zinc-900/40 p-1.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-zinc-800 transition-all border border-white/5">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className={`fa-brands fa-${item.icon} text-[10px] md:text-xs text-zinc-400 group-hover:text-white transition-colors`}></i>
                  </div>
                  <span className="hidden md:block text-[8px] md:text-[10px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
      </section>

      {/* Suggested Movies */}
      <section className="container mx-auto px-6 pb-4 md:pb-10">
         <MoviesRow title="Gợi ý phim cho bạn" movies={sections.top5} layout="BACKDROP" className="py-0" />
      </section>

      {/* Banner 1: Sales */}
      <div className="w-full relative group overflow-hidden mb-4 md:mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
          <img
            src={sales}
            alt="Sales banner"
            className="w-full object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105"
          />
      </div>

      {/* Featured Movies */}
      <section className="container mx-auto px-6 pb-4 md:pb-10">
         <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" className="py-0" />
      </section>
      
      {/* Banner 2: Deal */}
      <div className="w-full relative group overflow-hidden my-4 md:my-16">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <img
            src={deal}
            alt="Deal banner"
            className="w-full object-cover max-h-[500px] transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

       {/* Upcoming Movies */}
       <section className="container mx-auto px-6 pb-4 md:pb-10">
         <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" className="py-0" />
      </section>

      {/* Hot Movies */}
      <section className="container mx-auto px-6 pb-20">
         <MoviesRow title="PHIM HOT ĐẶC SẮC" movies={sections.hot} layout="POSTER" className="py-0" />
      </section>
    </div>
  );
};

export default Contact;
