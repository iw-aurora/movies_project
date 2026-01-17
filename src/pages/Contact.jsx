import { useState } from 'react';
import { useHomeData } from '../hooks/useHomeData';
import { getImageUrl } from '../lib/utils/image';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';
import sales from "../assets/images/sales.png";
import deal from "../assets/images/deal.png";
import { Link } from 'react-router-dom';
import MoviesCard from '../components/home/MoviesCard';
import MoviesRow from '../components/home/MoviesRow';

const Contact = () => {
  const { sections, loading } = useHomeData();
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
        Swal.fire('Opps!', 'Vui lòng điền đầy đủ thông tin nha!', 'warning');
        return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      
      Swal.fire({
          title: 'Thành công!',
          text: 'Cảm ơn bạn đã góp ý. Chúng tôi sẽ ghi nhận!',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
      });
      setFormData({ name: '', message: '' });
    } catch (error) {
      console.error("Error sending feedback:", error);
      Swal.fire('Lỗi', 'Không thể gửi phản hồi lúc này. Thử lại sau nhé!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return <div className="min-h-screen bg-[#111112] pt-24 text-center text-white">Loading...</div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-[#111112] text-zinc-100 overflow-x-hidden">
      {/* Introduction Section */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <div className="mb-12 animate-fade-in-up text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tighter">
            Moon<span className="text-blue-500">Play</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-lg font-medium">
            Chúng tôi luôn mong muốn mang đến cho bạn những trải nghiệm tốt nhất trên trang web MoonPlay.
            Đừng ngần ngại để lại những thông tin hay góp ý qua form dưới đây.
          </p>
        </div>

        {/* Contact Form & Socials */}
        <div className="max-w-4xl mx-auto">
           <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-sm mb-12">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
                Góp ý của bạn để chúng tôi biết bạn thế nào?
              </h3>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ và tên</label>
                        <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Nhập họ tên của bạn..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-700 font-medium text-white"
                        />
                    </div>
                </div>
                
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nội dung góp ý</label>
                    <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Bạn có góp ý gì để chúng tôi phát triển hơn..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-700 font-medium resize-none text-white"
                    />
                </div>
                <button 
                    disabled={submitting}
                    className="min-w-[200px] bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                      <><i className="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...</>
                  ) : (
                      <><i className="fa-solid fa-paper-plane"></i> Gửi Ngay</>
                  )}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: 'facebook-f', label: 'Facebook', color: 'blue', link: '#' },
                { icon: 'instagram', label: 'Instagram', color: 'pink', link: '#' },
                { icon: 'youtube', label: 'Youtube', color: 'red', link: '#' },
                { icon: 'tiktok', label: 'Tiktok', color: 'gray', link: '#' },
              ].map((item, i) => (
                <a key={i} href={item.link} className="flex items-center gap-3 group cursor-pointer bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                  <div className={`w-10 h-10 rounded-full bg-${item.color}-500/10 flex items-center justify-center group-hover:bg-${item.color}-600 group-hover:text-white transition-all text-${item.color}-500`}>
                    <i className={`fa-brands fa-${item.icon} text-lg`}></i>
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
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
