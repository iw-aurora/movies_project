import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getUserProfile, updateUser, deleteUserAccount } from "../../firebase/UserService";
import { updateProfile, updatePassword } from "firebase/auth";
import { deleteAuthUser } from "../../firebase/AuthService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ChangePass = (props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Preferences & Notifications State (Mock)
  const [preferences, setPreferences] = useState({
    language: 'vi',
    autoplay: true,
    quality: 'high'
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    newReleases: true,
    browserPush: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          // Initialize display name from Auth or Firestore
          setDisplayName(user.displayName || '');
          setEmail(user.email || '');
          
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
              if (userProfile.username) setDisplayName(userProfile.username); // Prefer Firestore username if exists
              if (userProfile.password) setCurrentPass(userProfile.password);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(user, { displayName });
      await updateUser(user.uid, { username: displayName, displayName }); // Sync with Firestore
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
       console.error(error);
       setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updatePassword(user, newPassword);
      // Optionally update stored password in Firestore if that's the design (User seems to imply it by asking to read 'recentpass')
      await updateUser(user.uid, { password: newPassword });
      setCurrentPass(newPassword);
      setNewPassword('');
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update password. Re-authentication may be required.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa tài khoản',
      html: `
        <p class="text-gray-300 mb-4">Bạn có chắc chắn muốn xóa tài khoản vĩnh viễn?</p>
        <p class="text-red-500 font-bold text-sm">⚠️ Hành động này không thể hoàn tác!</p>
        <p class="text-gray-400 text-xs mt-2">Tất cả dữ liệu của bạn sẽ bị xóa:</p>
        <ul class="text-gray-400 text-xs mt-2 text-left list-disc list-inside">
          <li>Lịch sử xem phim</li>
          <li>Danh sách yêu thích</li>
          <li>Bình luận và đánh giá</li>
        </ul>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa tài khoản',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      background: '#1f2937',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Xóa dữ liệu Firestore
      await deleteUserAccount(user.uid);
      
      // 2. Xóa Firebase Auth
      await deleteAuthUser(user);

      // 3. Thông báo thành công
      await Swal.fire({
        title: 'Đã xóa tài khoản',
        text: 'Tài khoản của bạn đã được xóa thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff'
      });

      // 4. Chuyển về trang chủ
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Delete account error:', error);
      Swal.fire({
        title: 'Lỗi',
        text: 'Không thể xóa tài khoản. Vui lòng thử lại sau.',
        icon: 'error',
        background: '#1f2937',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  if (props.compact) {
    return (
      <div>
        <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Profile & Security</h2>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-6 h-full flex flex-col transition-all hover:border-white/10 group">
            <div className="flex items-center gap-3 mb-4 text-blue-500">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <i className="fa-solid fa-user-shield text-sm"></i>
                </div>
                <h2 className="text-base font-bold text-white">Bảo mật tài khoản</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed flex-1">
                Quản lý thông tin cá nhân, cập nhật tên hiển thị và bảo mật tài khoản của bạn với mật khẩu mạnh.
            </p>
            <button 
                onClick={props.onMoreClick}
                className="w-full py-3 bg-white/5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2 group/btn"
            >
                <span>Cài đặt thêm</span>
                <i className="fa-solid fa-arrow-right group/btn-hover:translate-x-1 transition-transform"></i>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       {/* Header */}
       <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Cài đặt <span className="text-blue-500">Tài khoản</span></h2>
            <p className="text-sm text-gray-500 font-medium">Quản lý thông tin cá nhân và tùy chọn ứng dụng</p>
         </div>
       </div>

       {message.text && (
            <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'}`}></i>
                {message.text}
            </div>
        )}

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Profile & Security */}
            <div className="space-y-8">
                {/* Profile Section */}
                <div className="bg-[#18181b] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <i className="fa-solid fa-id-card text-8xl text-blue-500"></i>
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                             <i className="fa-solid fa-user"></i>
                        </div>
                        Thông tin cá nhân
                    </h3>

                    <form className="space-y-6" onSubmit={handleUpdateProfile}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                Email đăng nhập
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-medium text-gray-400 cursor-not-allowed group-hover/input:border-white/20 transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                    <i className="fa-solid fa-envelope"></i>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                Tên hiển thị
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Nhập tên hiển thị"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-gray-600 group-hover/input:border-white/20"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                                    <i className="fa-solid fa-signature"></i>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi</>}
                        </button>
                    </form>
                </div>

                {/* Security Section */}
                <div className="bg-[#18181b] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/30 transition-all shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <i className="fa-solid fa-shield-halved text-8xl text-green-500"></i>
                    </div>

                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                             <i className="fa-solid fa-key"></i>
                        </div>
                        Đổi mật khẩu
                    </h3>

                    <form className="space-y-6" onSubmit={handleUpdatePassword}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                Mật khẩu hiện tại
                            </label>
                            <div className="relative group/input">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={currentPass}
                                    readOnly
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-sm font-medium text-gray-500 cursor-not-allowed"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                >
                                    <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                Mật khẩu mới
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none transition-all placeholder:text-gray-600 group-hover/input:border-white/20"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-green-500 transition-colors">
                                    <i className="fa-solid fa-unlock-keyhole"></i>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading || !newPassword}
                            className="w-full py-4 bg-green-600 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-check"></i> Cập nhật mật khẩu</>}
                        </button>
                    </form>
                </div>
            </div>

            {/* RIGHT COLUMN: General Settings & Danger Zone */}
            <div className="space-y-8">
                {/* General Settings (Merged Preferences & Notifications) */}
                <div className="bg-[#18181b] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <i className="fa-solid fa-sliders text-8xl text-purple-500"></i>
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                             <i className="fa-solid fa-gear"></i>
                        </div>
                        Cài đặt chung
                    </h3>

                    <div className="space-y-6">
                        {/* Language */}
                        <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-gray-300">
                                    <i className="fa-solid fa-earth-americas text-lg"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-0.5">Ngôn ngữ hiển thị</p>
                                    <p className="text-xs text-gray-500 font-medium">Tiếng Việt / English</p>
                                </div>
                            </div>
                            <select 
                                value={preferences.language}
                                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                className="bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-gray-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        {/* Autoplay */}
                        <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-gray-300">
                                    <i className="fa-solid fa-play text-lg"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-0.5">Tự động phát</p>
                                    <p className="text-xs text-gray-500 font-medium">Chuyển tập tự động</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setPreferences({...preferences, autoplay: !preferences.autoplay})}
                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${preferences.autoplay ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-zinc-700'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center text-[10px] ${preferences.autoplay ? 'translate-x-6 text-purple-600' : 'translate-x-0 text-zinc-600'}`}>
                                    {preferences.autoplay && <i className="fa-solid fa-check"></i>}
                                </div>
                            </button>
                        </div>

                        {/* Notifications */}
                        {[
                            { id: 'emailUpdates', icon: 'envelope-open-text', label: 'Email cập nhật', desc: 'Nhận tin tức mới nhất' },
                            { id: 'newReleases', icon: 'bell', label: 'Phim mới ra mắt', desc: 'Thông báo khi có phim mới' },
                        ].map(item => (
                             <div key={item.id} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-gray-300">
                                        <i className={`fa-solid fa-${item.icon} text-lg`}></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white mb-0.5">{item.label}</p>
                                        <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                                    className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${notifications[item.id] ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-zinc-700'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center text-[10px] ${notifications[item.id] ? 'translate-x-6 text-purple-600' : 'translate-x-0 text-zinc-600'}`}>
                                         {notifications[item.id] && <i className="fa-solid fa-check"></i>}
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Danger Zone */}
                 <div className="bg-red-900/10 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group hover:bg-red-900/20 transition-all">
                     <div className="flex-1">
                         <h3 className="text-lg font-black text-red-500 mb-2 flex items-center gap-3">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            VÙNG NGUY HIỂM
                        </h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            Xóa tài khoản vĩnh viễn sẽ xóa toàn bộ dữ liệu, lịch sử xem và danh sách yêu thích. Hành động này không thể hoàn tác.
                        </p>
                     </div>
                     <button 
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="whitespace-nowrap px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/50 hover:border-red-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-red-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         Xóa tài khoản
                     </button>
                </div>
            </div>
       </div>
    </div>
  );
};

export default ChangePass;
