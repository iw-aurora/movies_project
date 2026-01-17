import { useState, useEffect, useRef } from "react";
import { useAuth } from '../../Context/AuthContext';
import { getUserProfile, updateUser, uploadUserAvatar } from "../../firebase/UserService";
import { updateProfile } from "firebase/auth";

const ProfileHero = ({ onEditProfileClick }) => {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserData(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // 1. Upload to Storage
      const photoURL = await uploadUserAvatar(user.uid, file);
      
      // 2. Update Auth Profile
      await updateProfile(user, { photoURL });
      
      // 3. Update Firestore
      await updateUser(user.uid, { photoURL });
      
      // 4. Update Global Auth State (triggers Header re-render)
      // We create a new object to ensure React detects the change
      const updatedUser = { ...user, photoURL };
      setUser(updatedUser);

      // 5. Update Local Component State
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
              className="w-32 h-32 rounded-full border-4 border-black overflow-hidden shadow-2xl relative bg-zinc-800 flex items-center justify-center"
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

          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-black text-white mb-2 truncate max-w-lg">
              {userData?.displayName || userData?.username || user?.displayName || 'Welcome Back'}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i>
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
