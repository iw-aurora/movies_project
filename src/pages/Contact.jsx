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
             <section className="px-20 py-12 container mx-auto text-center space-y-4">
                  <div className="h-10 w-48 bg-zinc-800 rounded-lg animate-pulse mx-auto"></div>
                  <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse mx-auto"></div>
             </section>

             <div className="container mx-auto px-4">
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl h-[400px] animate-pulse mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                       {[1,2,3].map(i => <div key={i} className="h-32 bg-zinc-800 rounded-xl animate-pulse"></div>)}
                  </div>
             </div>

             <section className="container mx-auto pb-10 px-4">
                 <MoviesRowSkeleton layout="BACKDROP" />
             </section>
        </div>
     );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#111112] text-zinc-100 overflow-x-hidden">
      {/* Introduction Section */}
      <section className="px-20 py-12 container mx-auto">
        <div className="mb-6 animate-fade-in-up text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4 uppercase italic tracking-tighter">
            Moon<span className="text-blue-500">Play</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Chúng tôi luôn mong muốn mang đến cho bạn những trải nghiệm tốt nhất trên trang web MoonPlay.
            Đừng ngần ngại để lại những thông tin hay góp ý qua form dưới đây.
          </p>
        </div>

        {/* Contact Form & Socials */}
        <div className="container mx-auto">
           <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl backdrop-blur-sm mb-6">
              <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                Góp ý của bạn
              </h3>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ và tên</label>
                    <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nhập họ tên của bạn..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-700 font-medium text-white"
                    />
                </div>
                
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nội dung góp ý</label>
                    <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Bạn có góp ý gì để chúng tôi phát triển hơn..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-700 font-medium resize-none text-white"
                    />
                </div>
                <button 
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-base font-black uppercase tracking-wider hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                      <><i className="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...</>
                  ) : (
                      <><i className="fa-solid fa-paper-plane"></i> Gửi Ngay</>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fa-solid fa-clock text-blue-500 text-lg"></i>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phản hồi</p>
                <p className="text-sm font-black text-white">24/7</p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fa-solid fa-users text-green-500 text-lg"></i>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Người dùng</p>
                <p className="text-sm font-black text-white">10,000+</p>
              </div>
              
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fa-solid fa-film text-purple-500 text-lg"></i>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phim</p>
                <p className="text-sm font-black text-white">50,000+</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: 'facebook-f', label: 'Facebook', color: 'blue', link: '#' },
                { icon: 'instagram', label: 'Instagram', color: 'pink', link: '#' },
                { icon: 'youtube', label: 'Youtube', color: 'red', link: '#' },
                { icon: 'tiktok', label: 'Tiktok', color: 'gray', link: '#' },
              ].map((item, i) => (
                <a key={i} href={item.link} className="flex items-center gap-2 group cursor-pointer bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                  <div className={`w-8 h-8 rounded-full bg-${item.color}-500/10 flex items-center justify-center group-hover:bg-${item.color}-600 group-hover:text-white transition-all text-${item.color}-500`}>
                    <i className={`fa-brands fa-${item.icon} text-sm`}></i>
                  </div>
                  <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
      </section>

      {/* Suggested Movies */}
      <section className="container mx-auto pb-10">
         <MoviesRow title="Gợi ý phim cho bạn" movies={sections.top5} layout="BACKDROP" />
      </section>

      {/* Banner 1: Sales */}
      <div className="w-full relative group overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
          <img
            src={sales}
            alt="Sales banner"
            className="w-full object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105"
          />
      </div>

      {/* Featured Movies */}
      <section className="container mx-auto pb-10">
         <MoviesRow title="Phim thuê đặc sắc" movies={sections.featured} layout="POSTER" />
      </section>
      
      {/* Banner 2: Deal */}
      <div className="w-full relative group overflow-hidden my-16">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <img
            src={deal}
            alt="Deal banner"
            className="w-full object-cover max-h-[500px] transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

       {/* Upcoming Movies */}
       <section className="container mx-auto pb-10">
         <MoviesRow title="PHIM SẮP CHIẾU" movies={sections.upcoming} layout="BACKDROP" />
      </section>

      {/* Hot Movies */}
      <section className="container mx-auto pb-20">
         <MoviesRow title="PHIM HOT ĐẶC SẮC" movies={sections.hot} layout="POSTER" />
      </section>
    </div>
  );
};

export default Contact;
