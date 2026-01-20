import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../Context/AuthContext';
import { getUserProfile, updateUser, uploadUserAvatar, getUserStats } from "../../firebase/UserService";
import { updateProfile } from "firebase/auth";

const ProfileHero = ({ onEditProfileClick }) => {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ favorites: 0, history: 0, comments: 0 });
  const [greeting, setGreeting] = useState('');
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const [profile, statistics] = await Promise.all([
             getUserProfile(user.uid),
             getUserStats(user.uid)
          ]);
          setUserData(profile);
          setStats(statistics);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    // Calculate Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');

    fetchUserData();
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const photoURL = await uploadUserAvatar(user.uid, file);
      await updateProfile(user, { photoURL });
      await updateUser(user.uid, { photoURL });
      
      const updatedUser = { ...user, photoURL };
      setUser(updatedUser);

      setUserData(prev => ({ ...prev, photoURL }));
      
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar.");
    } finally {
      setUploading(false);
    }
  };

  const memberSince = userData?.createdAt 
    ? new Date(userData.createdAt).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="relative w-full h-[350px] rounded-3xl overflow-hidden mb-8 group">
      {/* Background Cover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-black/80">
        <img
          src="https://picsum.photos/seed/cinema/1200/400"
          className="w-full h-full object-cover mix-blend-overlay opacity-50"
          alt="cover"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="flex items-end gap-6">
          <div className="relative group/avatar cursor-pointer">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full border-4 border-black overflow-hidden shadow-2xl relative bg-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform"
            >
              {userData?.photoURL || user?.photoURL ? (
                <img
                  src={userData?.photoURL || user?.photoURL}
                  className="w-full h-full object-cover transition-opacity group-hover/avatar:opacity-50"
                  alt="Avatar"
                />
              ) : (
                <span className="text-4xl font-black text-white group-hover/avatar:opacity-50 transition-opacity">
                    {(userData?.displayName || userData?.username || user?.displayName || 'U')[0]?.toUpperCase()}
                </span>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity z-10">
                <i className="fa-solid fa-camera text-white text-2xl drop-shadow-lg"></i>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 pb-1">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2 block pl-1">{greeting}</span>
            <h1 className="text-4xl font-black text-white mb-2 truncate max-w-lg tracking-tight leading-none">
              {userData?.displayName || userData?.username || user?.displayName || 'User'}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <i className="fa-regular fa-calendar"></i>
                    <span>Member since {memberSince}</span>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-white">
                        <i className="fa-solid fa-eye text-blue-500"></i>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-sm">{stats.history}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Đã xem</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                        <i className="fa-solid fa-heart text-red-500"></i>
                         <div className="flex flex-col leading-none">
                            <span className="font-bold text-sm">{stats.favorites}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Yêu thích</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                        <i className="fa-solid fa-comment text-yellow-500"></i>
                         <div className="flex flex-col leading-none">
                            <span className="font-bold text-sm">{stats.comments}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Bình luận</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfileHero;
