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
    <div className="pt-24 md:pt-32 min-h-screen bg-[#111112] text-zinc-100 overflow-x-hidden no-scrollbar">
      {/* Introduction Section */}
      <section className="container mx-auto px-4 md:px-6 mb-8">
        <div className="animate-fade-in text-center space-y-2">
          <h1 className="text-3xl md:text-6xl font-extrabold uppercase tracking-tight text-gradient leading-none">
            MoonPlay
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed text-[12px] md:text-base font-medium">
            Chúng tôi luôn lắng nghe ý kiến của bạn để hoàn thiện MoonPlay mỗi ngày.
            Hãy để lại góp ý hoặc báo lỗi bên dưới nhé.
          </p>
        </div>
      </section>

      {/* Main Content: Form & Info */}
      <section className="container mx-auto px-5 md:px-15 mb-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Contact Form */}
          <div className="bg-zinc-900/40 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"></span>
              <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tight">
                Gửi Phản Hồi
              </h3>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="block text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên của bạn..."
                  className="w-full bg-zinc-800/40 border border-white/5 rounded-xl px-4 py-3 text-[13px] md:text-base focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all placeholder:text-zinc-600 font-medium text-white shadow-inner"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Nội dung phản hồi
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Góp ý hoặc báo lỗi tại đây..."
                  className="w-full bg-zinc-800/40 border border-white/5 rounded-xl px-4 py-3 text-[13px] md:text-base focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800/60 transition-all placeholder:text-zinc-600 font-medium resize-none text-white shadow-inner"
                />
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-[13px] md:text-base font-black uppercase tracking-widest hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-2"
              >
                {submitting ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i> Gửi ngay</>
                )}
              </button>
            </form>
          </div>

          {/* Quick Info Cards & Social Links */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {[
                { icon: 'fa-clock', label: 'Support 24/7', color: 'blue' },
                { icon: 'fa-users', label: '10K+ Users', color: 'green' },
                { icon: 'fa-film', label: '50K+ Movies', color: 'purple' },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl text-center group hover:bg-zinc-800/60 transition-all flex flex-col items-center justify-center space-y-3">
                  <div className={`w-10 h-10 bg-${item.color}-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${item.icon} text-${item.color}-500 text-lg`}></i>
                  </div>
                  <p className="text-[8px] md:text-xs font-black text-white uppercase italic tracking-tighter leading-tight">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {[
                { icon: 'facebook-f', label: 'Facebook', color: 'blue', link: '#' },
                { icon: 'instagram', label: 'instagram', color: 'pink', link: '#' },
                { icon: 'youtube', label: 'Youtube', color: 'red', link: '#' },
                { icon: 'tiktok', label: 'Tiktok', color: 'zinc', link: '#' },
              ].map((item, i) => (
                <a key={i} href={item.link} className="flex flex-col items-center justify-center gap-0.5 md:gap-3 group cursor-pointer bg-zinc-900/40 p-2 md:p-4 rounded-2xl hover:bg-zinc-800 transition-all border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className={`fa-brands fa-${item.icon} text-lg text-zinc-400 group-hover:text-white transition-colors`}></i>
                  </div>
                  <span className="hidden md:block text-[9px] md:text-[10px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest transition-colors leading-none text-center">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Content Section */}
      <div className="space-y-8 pb-10">
        {/* Suggested Movies */}
        <section className="container mx-auto px-4 md:px-6">
          <MoviesRow title="Gợi ý phim cho bạn" movies={sections.top5} layout="BACKDROP" className="py-2" />
        </section>

        {/* Banner 1 */}
        <div className="w-full relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
          <img
            src={sales}
            alt="Sales banner"
            className="w-full object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Featured Movies */}
        <section className="container mx-auto px-4 md:px-6">
          <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" className="py-0" />
        </section>
        
        {/* Banner 2 */}
        <div className="w-full relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          <img
            src={deal}
            alt="Deal banner"
            className="w-full object-cover max-h-[500px] transition-transform duration-1000 group-hover:scale-110"
          />
        </div>

        {/* Upcoming Movies */}
        <section className="container mx-auto px-4 md:px-6">
          <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" className="py-0" />
        </section>

        {/* Hot Movies */}
        <section className="container mx-auto px-4 md:px-6">
          <MoviesRow title="PHIM HOT ĐẶC SẮC" movies={sections.hot} layout="POSTER" className="py-0" />
        </section>
      </div>
    </div>
  );
};

export default Contact;
