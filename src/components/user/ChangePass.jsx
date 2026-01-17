import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getUserProfile, updateUser } from "../../firebase/UserService";
import { updateProfile, updatePassword } from "firebase/auth";

const ChangePass = (props) => {
  const { user } = useAuth();
  
  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          // Initialize display name from Auth or Firestore
          setDisplayName(user.displayName || '');
          
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

  if (props.compact) {
    return (
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4 text-blue-500">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <i className="fa-solid fa-gear text-sm"></i>
            </div>
            <h2 className="text-base font-bold text-white">Profile & Security</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6 font-medium leading-relaxed flex-1">
            Manage your personal information, update your display name, and secure your account with a strong password.
        </p>
        <button 
            onClick={props.onMoreClick}
            className="w-full py-3 bg-white/5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2 group"
        >
            <span>More Settings</span>
            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex items-center justify-between mb-2">
         <div>
            <h2 className="text-2xl font-bold text-white mb-1">Account Settings</h2>
            <p className="text-sm text-gray-500">Manage your profile and security preferences</p>
         </div>
         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-user-gear text-white text-sm"></i>
         </div>
       </div>

       {message.text && (
            <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'}`}></i>
                {message.text}
            </div>
        )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-blue-500/20 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i className="fa-solid fa-id-card text-6xl text-blue-500"></i>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                    Profile Information
                </h3>

                <form className="space-y-6" onSubmit={handleUpdateProfile}>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                            Display Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-gray-700 text-white"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                                <i className="fa-solid fa-user text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-600 rounded-xl text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk"></i>
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-red-500/20 transition-colors">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i className="fa-solid fa-shield-halved text-6xl text-red-500"></i>
                </div>

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                    Security
                </h3>

                <form className="space-y-6" onSubmit={handleUpdatePassword}>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                value={currentPass}
                                readOnly
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-10 py-3.5 text-sm focus:border-red-500 focus:outline-none transition-all text-gray-500 cursor-not-allowed"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                                <i className="fa-solid fa-key text-xs"></i>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                            >
                                <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                            New Password
                        </label>
                        <div className="relative">
                             <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500/50 focus:outline-none transition-all placeholder:text-gray-700 text-white"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                                <i className="fa-solid fa-lock text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading || !newPassword}
                        className="w-full py-3.5 bg-red-600 rounded-xl text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-600 to-red-700"
                    >
                         {loading ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            <>
                                <i className="fa-solid fa-check"></i>
                                Update Password
                            </>
                        )}
                    </button>
                </form>
            </div>
       </div>
    </div>
  );
};

export default ChangePass;
